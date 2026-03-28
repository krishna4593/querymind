import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../service/chat.socket";

import {
  fetchChats,
  fetchMessages,
  deleteChat,
  setSidebarOpen,
  setShowSearch,
  setSearchQuery,
  setActiveChat,
  resetCurrentChat,
  addMessage,
  updateLastMessage,
  setError,
} from "../state/chat.slice";

const useChat = () => {
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const {
    sidebarOpen,
    showSearch,
    searchQuery,
    messages,
    chats,
    filteredChats,
    activeChatId,
    activeChat,
    loading,
    sending,
    error,
    loadingChats,
    loadingMessages,
  } = useSelector((state) => state.chat);

  const [messageInput, setMessageInput] = useState("");

  useEffect(() => {
    socket.connect();
    dispatch(fetchChats());
  }, [dispatch]);

 useEffect(() => {

      socket.on("connect", () => {
        dispatch(setError(null));
      });

      socket.on("disconnect", () => {
        dispatch(setError("Connection lost. Reconnecting..."));
      });

      socket.on("connect_error", () => {
        dispatch(setError("Unable to connect to chat server."));
      });

    //receive streaming messages
    socket.on("receive_message", (message) => {
      dispatch(updateLastMessage(message));
    });

    // when stream ends
    socket.on("stream_end", async (data) => {
      if (data.chatId) {
        dispatch(setActiveChat(data.chatId));
        await dispatch(fetchChats());
        await dispatch(fetchMessages(data.chatId));
      }
    });

    // handle errors
    socket.on("error", (errorMessage) => {
      dispatch(setError(errorMessage));
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("receive_message");
      socket.off("stream_end");
      socket.off("error");
    };
  }, [dispatch]);

  const handleSearchToggle = useCallback(() => {
    const nextValue = !showSearch;
    dispatch(setShowSearch(nextValue));
    if (!nextValue) {
      dispatch(setSearchQuery(""));
    }
  }, [dispatch, showSearch]);

  const handleChatSelect = useCallback(
    async (chatId) => {
      dispatch(setActiveChat(chatId));
      await dispatch(fetchMessages(chatId)).unwrap();
    },
    [dispatch]
  );

  const handleDeleteChat = useCallback(
    async (chatId) => {
      await dispatch(deleteChat(chatId)).unwrap();
      await dispatch(fetchChats());
    },
    [dispatch]
  );

  const handleNewChat = useCallback(() => {
    dispatch(resetCurrentChat());
    setMessageInput("");
  }, [dispatch]);

  const handleSend = useCallback(
  (e) => {
    e.preventDefault();

    const message = messageInput.trim();
    if (!message || sending) return;

    // 🔴 check user
    if (!user?.user?.id) {
      dispatch(setError("Please login again before sending messages."));
      return;
    }

    setMessageInput("");

    // 🟢 1. Add USER message instantly
    dispatch(addMessage({
      id: Date.now(),
      role: "user",
      content: message,
    }));

    // 🟢 2. Add AI placeholder (for streaming)
    dispatch(addMessage({
      id: `ai-temp-${Date.now()}`,
      role: "ai",
      content: "",
      optimistic: true,
    }));

    // 🔥 3. SEND via socket
    socket.emit("send_message", {
      message,
      chatId: activeChatId,
      userId: user.user.id,
    });

  },
  [messageInput, activeChatId, sending, dispatch, user]
);

  return {
    sidebarOpen,
    setSidebarOpen: (value) => dispatch(setSidebarOpen(value)),
    showSearch,
    handleSearchToggle,
    searchQuery,
    setSearchQuery: (value) => dispatch(setSearchQuery(value)),
    messages,
    setMessages: () => {},
    messageInput,
    setMessageInput,
    loading,
    sending,
    error,
    filteredChats,
    chats,
    activeChatId,
    activeChat,
    loadingChats,
    loadingMessages,
    handleChatSelect,
    handleDeleteChat,
    handleNewChat,
    handleSend,
    
  };
};

export default useChat;