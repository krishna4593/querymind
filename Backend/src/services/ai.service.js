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




export async function generateResponse(messages) {

    const response = await agent.invoke({messages:[
new SystemMessage(
    `You are an AI assistant that helps users by providing accurate and concise information, like today date and time. You have access to a tool called "search_internet" that allows you to search the internet for up-to-date information. When you receive a user's message, you should first determine if the information needed to respond is available in your training data. If it is, provide a direct answer based on that knowledge. If the information is not available or if the user's query requires current data, use the "search_internet" tool to perform a search and gather the necessary information before responding. Always aim to provide clear and helpful answers to the user's questions.`
),
        ...( messages.map(msg => {
        if(msg.role === "user"){
            return new HumanMessage(msg.content);
        }
       else if(msg.role === "ai"){
            return new AIMessage(msg.content);
        }
    }))]
});
    return response.messages[response.messages.length - 1].text;
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