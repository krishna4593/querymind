import {Router} from 'express';
import { sendMessage, getChats, getMessages, deleteChat } from '../controllers/chat.controller.js';
import { authUser } from '../middlewares/auth.middleware.js';

const chatRouter = Router();

chatRouter.post('/messages',authUser, sendMessage);
chatRouter.get('/', authUser, getChats);
chatRouter.get('/:chatId/messages', authUser, getMessages);
chatRouter.post('/delete/:chatId/', authUser, deleteChat);

export default chatRouter;