import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000",
  withCredentials: true,
});

export async function fetchChatsApi() {
  const response = await api.get("/api/chats");
  return response.data;
}

export async function fetchMessagesApi(chatId) {
  const response = await api.get(`/api/chats/${chatId}/messages`);
  return response.data;
}

export async function sendMessageApi({ message, chatId }) {
  const payload = chatId ? { message, chat: chatId } : { message };
  const response = await api.post("/api/chats/messages", payload);
  return response.data;
}

export async function deleteChatApi(chatId) {
  const response = await api.post(`/api/chats/delete/${chatId}/`);
  return response.data;
}
