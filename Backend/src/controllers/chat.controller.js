import chatModel from "../modules/chat.model.js";
import messageModel  from "../modules/message.model.js";
import { generateChatTitle, generateResponse } from "../services/ai.service.js";

export async function sendMessage(req, res) {
    const { message, chat:chatId } = req.body;


  let chat, title;
  if(!chatId){
        title = await generateChatTitle(message);
        chat = await chatModel.create({
        user: req.user.id,
        title,
        
    })
  } 
    const userMessage = await messageModel.create({
        chatId: chatId || chat._id ,
        role: "user",
        content: message,
    });

    const messages = await messageModel.find({ chatId: chatId || chat._id })

    const result = await generateResponse(messages);
   
    const aiMessage = await messageModel.create({
        chatId: chatId || chat._id,
        role: "ai",
        content: result,
    });

     res.status(200).json({ 
        
        chat,
        title,
        userMessage,
        aiMessage,
        

     });
}

export async function getChats(req, res) {
    const user = req.user
    const chats = await chatModel.find({ user: user.id })
    res.status(200).json({
        message: "Chats retrieved successfully",
        chats
    });
}

export async function getMessages(req, res) {
    const { chatId } = req.params;
    const chat = await chatModel.findOne({  _id:chatId,
        user: req.user.id })
        if(!chat){
            return res.status(404).json({
                message: "Chat not found"
            });
            }
    const messages = await messageModel.find({ chatId: chatId })
    res.status(200).json({
        message: "Messages retrieved successfully",
        messages
    
    })
}

export async function deleteChat(req, res) {
    const { chatId } = req.params;
    const deletedChat = await chatModel.findOneAndDelete({  _id:chatId,
        user: req.user.id })

    if(!deletedChat){
        return res.status(404).json({
            message: "Chat not found"
        });
    }

    await messageModel.deleteMany({ chatId: chatId })

    res.status(200).json({
        message: "Chat deleted successfully",
    })
}