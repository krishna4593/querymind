import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatMistralAI} from "@langchain/mistralai";
import {HumanMessage, SystemMessage, AIMessage, tool, createAgent} from "langchain"
import * as z from "zod";
import { searchInternet } from "./internet.service.js";


 const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});

const searchInternetTool = tool(
    searchInternet,
    {
        name: "search_internet",
        description: "Use this tool to search the internet for up-to-date information, and current date , time. Input should be a search query string, and the output will be the search results.",
        schema: z.object({
            query: z.string().describe("The search query string to find relevant information on the internet.")
        })

    },
    z.string()
)
    
const agent = createAgent({ model:mistralModel, 
tools: [searchInternetTool]
})

const MAX_CONTEXT_MESSAGES = 14;


function buildConversation(messages) {
    const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
    return [
        new SystemMessage(
            `You are an AI assistant that helps users by providing accurate and concise information, like today date and time. You have access to a tool called "search_internet" that allows you to search the internet for up-to-date information. When you receive a user's message, you should first determine if the information needed to respond is available in your training data. If it is, provide a direct answer based on that knowledge. If the information is not available or if the user's query requires current data, use the "search_internet" tool to perform a search and gather the necessary information before responding. Always aim to provide clear and helpful answers to the user's questions.`
        ),
        ...recentMessages
            .map((msg) => {
                if (msg.role === "user") return new HumanMessage(msg.content || "");
                if (msg.role === "ai") return new AIMessage(msg.content || "");
                return null;
            })
            .filter(Boolean),
    ];
}

function extractText(content) {
    if (!content) return "";
    if (typeof content === "string") return content;
    if (Array.isArray(content)) {
        return content
            .map((part) => {
                if (typeof part === "string") return part;
                if (typeof part?.text === "string") return part.text;
                if (typeof part?.content === "string") return part.content;
                return "";
            })
            .join("");
    }
    if (typeof content?.text === "string") return content.text;
    return "";
}



export async function generateResponse(messages) {

    const result = await agent.invoke({
        messages: buildConversation(messages),
    });

    const directText = extractText(result?.content);
    if (directText.trim()) return directText;

    const lastMessage = result?.messages?.[result.messages.length - 1];
    const lastText = extractText(lastMessage?.content);
    return lastText.trim();
}

export async function generateChatTitle(messages) {

    const response = await mistralModel.invoke([
        new SystemMessage(
         `user will send first message of the chat, you will generate a title for the chat based on that message. The title should be concise, ideally 3-5 words, and should accurately reflect the content of the conversation. Do not include any additional information or context in the title, just focus on creating a clear and descriptive title based on the user's first message.`   
            ),

        new HumanMessage( `create a title for this chat based on the following message: ${messages} `)
    ]);
    return response.text;
}

export async function* generateResponseStream(messages) {
    const stream = await mistralModel.stream(buildConversation(messages));

    for await (const chunk of stream) {
        const text = extractText(chunk?.content ?? chunk);
        if (text) {
            yield text;
        }
    }
}