import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  fetchChatsApi,
  fetchMessagesApi,
  sendMessageApi,
  deleteChatApi,
} from "../api/chat.api";
import { mapChatFromApi, mapMessageFromApi } from "../model/chat.mapper";

export const fetchChats = createAsyncThunk("chat/fetchChats", async (_, thunkApi) => {
  try {
    const data = await fetchChatsApi();
    return (data.chats || []).map(mapChatFromApi);
  } catch (error) {
    return thunkApi.rejectWithValue(error?.response?.data?.message || error.message);
  }
});

export const fetchMessages = createAsyncThunk("chat/fetchMessages", async (chatId, thunkApi) => {
  try {
    const data = await fetchMessagesApi(chatId);
    return {
      chatId,
      messages: (data.messages || []).map(mapMessageFromApi),
    };
  } catch (error) {
    return thunkApi.rejectWithValue(error?.response?.data?.message || error.message);
  }
});

export const sendMessage = createAsyncThunk("chat/sendMessage", async ({ message, chatId }, thunkApi) => {
  try {
    const data = await sendMessageApi({ message, chatId });
    return {
      chat: data.chat ? mapChatFromApi(data.chat) : null,
      title: data.title,
      userMessage: data.userMessage ? mapMessageFromApi(data.userMessage) : null,
      aiMessage: data.aiMessage ? mapMessageFromApi(data.aiMessage) : null,
      sourceChatId: chatId || data?.chat?._id || null,
    };
  } catch (error) {
    return thunkApi.rejectWithValue(error?.response?.data?.message || error.message);
  }
});

export const deleteChat = createAsyncThunk("chat/deleteChat", async (chatId, thunkApi) => {
  try {
    await deleteChatApi(chatId);
    return chatId;
  } catch (error) {
    return thunkApi.rejectWithValue(error?.response?.data?.message || error.message);
  }
});

const initialState = {
  chats: [],
  filteredChats: [],
  messages: [],
  activeChatId: null,
  activeChat: null,
  searchQuery: "",
  showSearch: false,
  sidebarOpen: true,
  loading: false,
  sending: false,
  loadingChats: false,
  loadingMessages: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSidebarOpen(state, action) {
      state.sidebarOpen = action.payload;
    },
    setShowSearch(state, action) {
      state.showSearch = action.payload;
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
      if (!action.payload.trim()) {
        state.filteredChats = state.chats;
        return;
      }

      const query = action.payload.toLowerCase();
      state.filteredChats = state.chats.filter((chat) =>
        (chat.title || "").toLowerCase().includes(query)
      );
    },
    setActiveChat(state, action) {
      const chatId = action.payload;
      state.activeChatId = chatId;
      state.activeChat = state.chats.find((chat) => chat.id === chatId) || null;
    },
    resetCurrentChat(state) {
      state.activeChatId = null;
      state.activeChat = null;
      state.messages = [];
    },
    clearChatError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.loadingChats = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loadingChats = false;
        state.chats = action.payload;
        state.filteredChats = action.payload;

        if (state.activeChatId) {
          state.activeChat = state.chats.find((chat) => chat.id === state.activeChatId) || null;
        }
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loadingChats = false;
        state.error = action.payload || "Failed to load chats";
      })
      .addCase(fetchMessages.pending, (state) => {
        state.loadingMessages = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loadingMessages = false;
        state.messages = action.payload.messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loadingMessages = false;
        state.error = action.payload || "Failed to load messages";
      })
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;

        const { chat, userMessage, aiMessage, sourceChatId } = action.payload;

        if (chat) {
          const existingIndex = state.chats.findIndex((item) => item.id === chat.id);
          if (existingIndex === -1) {
            state.chats.unshift(chat);
          } else {
            state.chats[existingIndex] = chat;
          }
          state.filteredChats = state.searchQuery.trim()
            ? state.chats.filter((item) =>
                (item.title || "").toLowerCase().includes(state.searchQuery.toLowerCase())
              )
            : state.chats;
          state.activeChatId = chat.id;
          state.activeChat = chat;
        } else if (sourceChatId) {
          state.activeChatId = sourceChatId;
          state.activeChat = state.chats.find((item) => item.id === sourceChatId) || state.activeChat;
        }

        if (userMessage) {
          state.messages.push(userMessage);
        }
        if (aiMessage) {
          state.messages.push(aiMessage);
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload || "Failed to send message";
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        const chatId = action.payload;
        state.chats = state.chats.filter((chat) => chat.id !== chatId);
        state.filteredChats = state.filteredChats.filter((chat) => chat.id !== chatId);

        if (state.activeChatId === chatId) {
          state.activeChatId = null;
          state.activeChat = null;
          state.messages = [];
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.error = action.payload || "Failed to delete chat";
      });
  },
});

export const {
  setSidebarOpen,
  setShowSearch,
  setSearchQuery,
  setActiveChat,
  resetCurrentChat,
  clearChatError,
} = chatSlice.actions;

export default chatSlice.reducer;
