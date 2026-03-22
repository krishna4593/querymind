import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeSocket } from "../service/chat.socket";
import {
  fetchChats,
  fetchMessages,
  sendMessage,
  deleteChat,
  setSidebarOpen,
  setShowSearch,
  setSearchQuery,
  setActiveChat,
  resetCurrentChat,
} from "../state/chat.slice";

const useChat = () => {
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
    initializeSocket();
    dispatch(fetchChats());
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
    async (e) => {
      e.preventDefault();
      const message = messageInput.trim();
      if (!message || sending) return;

      setMessageInput("");
      try {
        await dispatch(
          sendMessage({
            message,
            chatId: activeChatId,
          })
        ).unwrap();

        if (!activeChatId) {
          await dispatch(fetchChats()).unwrap();
        }
      } catch {
        // Errors are already managed by the chat slice.
      }
    },
    [dispatch, messageInput, activeChatId, sending]
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
    initializeSocket,
  };
};

export default useChat;