import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {ChatMistralAI} from "@langchain/mistralai";
import {HumanMessage, SystemMessage, AIMessage} from "langchain"

 const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY,
});

const mistralModel = new ChatMistralAI({
  model: "mistral-small-latest",
  apiKey: process.env.MISTRAL_API_KEY,
});


export async function generateResponse(messages) {

    const response = await geminiModel.invoke(messages.map(msg => {
        if(msg.role === "user"){
            return new HumanMessage(msg.content);
        }
       else if(msg.role === "ai"){
            return new AIMessage(msg.content);
        }
    }));
    return response.text;
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