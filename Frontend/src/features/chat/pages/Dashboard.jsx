import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useAuth } from "../../auth/hook/useAuth.js";
import useChat from "../hooks/useChat.js";

const Dashboard = () => {
  const chat = useChat();
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth);

  const onLogout = async () => {
    const isLoggedOut = await handleLogout();
    if (isLoggedOut) {
      navigate("/login");
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#050608] text-zinc-100">
      <div className="relative flex h-full w-full gap-3 bg-[#090b0f] p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_40px_80px_rgba(0,0,0,0.45)] sm:gap-4 sm:p-3 md:gap-5 md:p-5">
        {!chat.sidebarOpen && (
          <button
            type="button"
            onClick={() => chat.setSidebarOpen(true)}
            className="absolute left-4 top-4 z-20 rounded-lg border border-zinc-700 bg-zinc-900/90 p-2 text-zinc-300 transition hover:border-zinc-500 hover:text-white"
            aria-label="Open sidebar"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 12h16" />
              <path d="M11 5l-7 7 7 7" />
            </svg>
          </button>
        )}

        {chat.sidebarOpen && (
          <div
            className="absolute inset-0 z-20 bg-black/60 md:hidden"
            onClick={() => chat.setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}

        {chat.sidebarOpen && (
          <aside className="absolute inset-y-2 left-2 z-30 flex w-[85vw] max-w-xs flex-col rounded-2xl border border-zinc-800/90 bg-[#0c0f14] transition-all duration-300 sm:w-72 md:static md:inset-auto md:z-auto md:h-full md:shrink-0">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-4">
            <div
              className="flex w-full items-center justify-center gap-2"
            >
              <span className="grid h-8 w-8 place-content-center rounded-lg bg-gradient-to-br from-cyan-400 to-emerald-400 text-[#051013] shadow-md shadow-cyan-500/20">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 12h7" />
                  <path d="M13 6h7" />
                  <path d="M13 18h7" />
                </svg>
              </span>

              <h1 className="text-lg font-semibold tracking-wide">queryMind</h1>
            </div>

            <button
              type="button"
              onClick={() => chat.setSidebarOpen(false)}
              className="ml-2 rounded-lg border border-zinc-700 bg-zinc-900/70 p-2 text-zinc-300 transition hover:border-zinc-500 hover:text-white"
              aria-label="Toggle sidebar"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16" />
                <path d="M13 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <div className="flex-1 space-y-4 overflow-hidden p-4">
            <div className="space-y-2">
              <button
                type="button"
                onClick={chat.handleNewChat}
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-900 px-3 py-2 text-left text-sm text-zinc-200 transition hover:border-cyan-500/50 hover:text-white"
              >
                + New Chat
              </button>

              <button
                type="button"
                onClick={chat.handleSearchToggle}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-left text-sm text-zinc-400 transition hover:border-zinc-600 hover:text-zinc-200"
              >
                Search Chat
              </button>

              {chat.showSearch && (
                <input
                  type="text"
                  value={chat.searchQuery}
                  onChange={(event) => chat.setSearchQuery(event.target.value)}
                  placeholder="Search by chat title"
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-900/80 px-3 py-2 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-cyan-500/60"
                />
              )}
            </div>

            <div className="h-[calc(100%-88px)] rounded-2xl border border-zinc-800 bg-black/20 p-3">
              <p className="mb-3 text-sm font-medium text-zinc-300">
                Your Chats {chat.loadingChats ? "..." : ""}
              </p>
              <div className="h-full space-y-2 overflow-y-auto pb-4 pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {chat.filteredChats.map((chatItem) => (
                  <div
                    key={chatItem.id}
                    className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition ${
                      chat.activeChatId === chatItem.id
                        ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-100"
                        : "border-zinc-800/80 bg-zinc-900/60 text-zinc-300 hover:border-cyan-500/40 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => chat.handleChatSelect(chatItem.id)}
                        className="min-w-0 flex-1 truncate text-left"
                        title={chatItem.title}
                      >
                        {chatItem.title}
                      </button>

                      <button
                        type="button"
                        onClick={() => chat.handleDeleteChat(chatItem.id)}
                        className="rounded-md p-1 text-zinc-400 transition hover:bg-red-500/20 hover:text-red-300"
                        aria-label="Delete chat"
                        title="Delete chat"
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18" />
                          <path d="M8 6V4h8v2" />
                          <path d="M19 6l-1 14H6L5 6" />
                          <path d="M10 11v6" />
                          <path d="M14 11v6" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}

                {!chat.loadingChats && chat.filteredChats.length === 0 && (
                  <p className="rounded-lg border border-zinc-800/80 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-500">
                    No chat found for this search.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-zinc-800 px-4 py-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-3">
              <p className="truncate text-sm font-medium text-zinc-200">{user?.user?.username || "User"}</p>
              <p className="truncate text-xs text-zinc-400">{user?.user?.email || "No email"}</p>
              <button
                type="button"
                onClick={onLogout}
                className="mt-3 w-full rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-200 transition hover:bg-red-500/20"
              >
                Logout
              </button>
            </div>
          </div>
        </aside>
        )}

        <section
          className={`flex min-w-0 flex-1 flex-col rounded-2xl bg-[#0a0d12] p-3 md:p-4 ${
            chat.sidebarOpen ? "" : "pt-12 md:pt-0 md:ml-10 md:mt-8"
          }`}
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-zinc-950/40 px-3 py-3 sm:px-4">
            <h2 className="truncate text-sm font-medium text-zinc-300 md:text-base">
              {chat.activeChat?.title || "New Chat"}
            </h2>
            <span className="rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-1 text-xs text-zinc-400">
              {user?.user?.username || "User"}
            </span>
          </div>

          {chat.error && (
            <p className="mb-3 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-200">
              {chat.error}
            </p>
          )}

          <div className="mb-4 flex-1 overflow-hidden rounded-2xl bg-gradient-to-b from-zinc-900/30 to-black/30 p-3 md:p-4">
            <div className="h-full space-y-3 overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {chat.loadingMessages && <p className="text-sm text-zinc-400">Loading messages...</p>}

              {!chat.loadingMessages && chat.messages.length === 0 && (
                <p className="text-sm text-zinc-500">Start a new message to create or continue a chat.</p>
              )}

              {chat.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[92%] break-words text-sm leading-relaxed sm:max-w-[85%] md:text-base ${
                    msg.role === "user"
                      ? "ml-auto w-fit rounded-2xl bg-cyan-500/10 px-3 py-3 text-cyan-100 sm:px-4"
                      : "w-full text-zinc-200"
                  }`}
                >
                  <p className="mb-1 text-xs uppercase tracking-wide text-zinc-400">
                    {msg.role === "user" ? "User message" : "AI response"}
                  </p>
                  {msg.role === "ai" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="mb-2 list-disc pl-5 last:mb-0">{children}</ul>,
                        ol: ({ children }) => <ol className="mb-2 list-decimal pl-5 last:mb-0">{children}</ol>,
                        code: ({ children }) => (
                          <code className="rounded bg-black/40 px-1.5 py-0.5 text-xs text-cyan-100">{children}</code>
                        ),
                        pre: ({ children }) => (
                          <pre className="mb-2 overflow-x-auto rounded-lg bg-black/50 p-3 text-xs last:mb-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">{children}</pre>
                        ),
                        a: ({ href, children }) => (
                          <a
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            className="text-cyan-300 underline underline-offset-2"
                          >
                            {children}
                          </a>
                        ),
                      }}
                    >
                      {msg.content || ""}
                    </ReactMarkdown>
                  ) : (
                    <p>{msg.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <form onSubmit={chat.handleSend} className="rounded-2xl border border-zinc-800 bg-[#06080c] p-2.5 sm:p-3">
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="text"
                value={chat.messageInput}
                onChange={(event) => chat.setMessageInput(event.target.value)}
                placeholder="Enter the message..."
                className="flex-1 rounded-xl border border-zinc-700 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none transition placeholder:text-zinc-500 focus:border-cyan-500/60 md:text-base"
              />
              <button
                type="submit"
                disabled={chat.sending}
                className="w-full rounded-xl border border-cyan-500/50 bg-cyan-500/20 px-5 py-3 text-sm font-medium text-cyan-100 transition hover:bg-cyan-500/30 sm:w-auto"
              >
                {chat.sending ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;