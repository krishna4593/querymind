import { useState, useCallback } from "react";
import { initializeSocket } from "../service/chat.socket";

const useChat = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [filteredChats, setFilteredChats] = useState([]);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const handleSearchToggle = useCallback(() => {
    setShowSearch((prev) => !prev);
    if (showSearch) {
      setSearchQuery("");
      setFilteredChats(chats);
    }
  }, [showSearch, chats]);

  const handleChatSelect = useCallback((chatId) => {
    setActiveChatId(chatId);
    const selected = chats.find((chat) => chat.id === chatId);
    setActiveChat(selected);
    setMessages(selected?.messages || []);
  }, [chats]);

  const handleDeleteChat = useCallback((chatId) => {
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    setFilteredChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      setActiveChatId(null);
      setActiveChat(null);
      setMessages([]);
    }
  }, [activeChatId]);

  const handleNewChat = useCallback(() => {
    setActiveChatId(null);
    setActiveChat(null);
    setMessages([]);
    setMessageInput("");
  }, []);

  const handleSend = useCallback(
    async (e) => {
      e.preventDefault();
      if (!messageInput.trim()) return;

      setSending(true);
      try {
        const userMessage = {
          id: Date.now(),
          role: "user",
          content: messageInput,
        };
        setMessages((prev) => [...prev, userMessage]);
        setMessageInput("");

        // Mock AI response - replace with actual API call
        setTimeout(() => {
          const aiMessage = {
            id: Date.now() + 1,
            role: "ai",
            content: "This is a mock response. Connect to your AI service.",
          };
          setMessages((prev) => [...prev, aiMessage]);
          setSending(false);
        }, 500);
      } catch (err) {
        setError(err.message);
        setSending(false);
      }
    },
    [messageInput]
  );

  return {
    sidebarOpen,
    setSidebarOpen,
    showSearch,
    handleSearchToggle,
    searchQuery,
    setSearchQuery,
    messages,
    setMessages,
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