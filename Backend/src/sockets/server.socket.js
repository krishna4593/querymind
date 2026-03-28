import {Server} from 'socket.io'
import { generateResponseStream } from '../services/ai.service.js';

import chatModel from '../modules/chat.model.js';
import messageModel from '../modules/message.model.js';

let io;

function buildFastTitle(message) {
    return (message || "New Chat")
        .trim()
        .split(/\s+/)
        .slice(0, 6)
        .join(" ")
        .slice(0, 60);
}

export const initSocketServer = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:5173",
            credentials: true
        }
    });

    console.log('Socket.io server initialized');

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        socket.on("send_message", async (data) => {
            try{
                const {message, chatId, userId} = data;
                
                if(!userId) {
                    socket.emit("error", "User ID is required");
                    return;
                }
                
                let chat, title;
                if(!chatId){
                    title = buildFastTitle(message);
                    chat = await chatModel.create({
                    user: userId,
                    title,
                })
                }
                
                const currentChatId = chatId || chat._id;
                await messageModel.create({
                    chatId: currentChatId,
                    role: "user",
                    content: message,
                });
                
                const messages = await messageModel.find({ chatId: currentChatId }).sort({ createdAt: 1 });
                let fullResponse = "";
                for await (const token of generateResponseStream(messages)) {
                    fullResponse += token;
                    socket.emit("receive_message", token);
                }
                
                // Only save AI message if we have content
                if(fullResponse.trim()){
                    await messageModel.create({
                        chatId: currentChatId,
                        role: "ai",
                        content: fullResponse,
                    });
                }

                socket.emit("stream_end", {
                    chatId: currentChatId,
                    title
                });
            }catch(error){
                console.error("Error processing message:", error);
                socket.emit("error", error.message || "An error occurred while processing your message. Please try again.");
            }
            
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });


 };

export function getIO(){
    if(!io){
        throw new Error('Socket.io not initialized')
    }
    return io;
}