"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Loader2, Trash2, Copy, Edit3 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedMessages = localStorage.getItem("chat_messages");
    if (savedMessages) {
      try {
        setMessages(JSON.parse(savedMessages));
      } catch (e) {
        console.error("Failed to parse saved messages", e);
      }
    }
  }, []);

  // Save to localStorage on update
  useEffect(() => {
    localStorage.setItem("chat_messages", JSON.stringify(messages));
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isLoading) {
      scrollToBottom();
    }
  }, [isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const updated = [
      ...messages,
      { role: "user", content: input },
    ];

    setMessages(updated);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updated,
        }),
      });

      const data = await res.json();

      setMessages([
        ...updated,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      console.error(error);
      setMessages([
        ...updated,
        { role: "assistant", content: "Oops! Something went wrong." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (index: number) => {
    // Copy the message content to the input field so the user can easily re-send or modify it
    setInput(messages[index].content);
    // We intentionally do not delete the chat history
  };

  return (
    <div className="flex flex-col h-screen bg-[#09090b] text-zinc-50 font-sans selection:bg-indigo-500/30">
      {/* Header */}
      <header className="px-6 py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between shadow-2xl shadow-indigo-900/5">
        <div className="flex items-center gap-3 w-full max-w-4xl mx-auto">
          <div className="p-2.5 bg-linear-to-br from-indigo-500/20 to-purple-500/20 rounded-xl relative overflow-hidden group shadow-inner border border-white/5">
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl group-hover:bg-indigo-500/40 transition-all duration-500"></div>
            <Bot className="w-5 h-5 text-indigo-400 relative z-10" />
          </div>
          <div>
            <h1 className="text-lg font-bold bg-linear-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent">StackBot AI</h1>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <p className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold">Ready</p>
            </div>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={() => { setMessages([]); setInput(''); }}
            className="flex items-center gap-2 text-zinc-400 hover:text-rose-400 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors text-sm"
            title="Clear Chat"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline font-medium">Clear</span>
          </button>
        )}
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 max-w-4xl mx-auto w-full scroll-smooth hide-scrollbar">
        <AnimatePresence initial={false}>
          {messages.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-6 pt-10"
            >
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-2xl relative z-10">
                  <Bot className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tight text-white mb-2">How can I help you today?</h2>
                <p className="text-zinc-400 max-w-md mx-auto text-[15px] leading-relaxed">
                  I am a locally run AI model ready to assist you. Ask me anything and I'll do my best to provide a helpful response.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-8 max-w-2xl w-full">
                {["Explain quantum computing in simple terms", "Write a Python script to scrape a website", "Draft an email to my boss about a project delay", "Give me ideas for a weekend trip"].map((suggestion, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setInput(suggestion); }}
                    className="p-4 rounded-xl border border-white/5 bg-white/2 hover:bg-white/4 text-left text-sm text-zinc-300 hover:text-white transition-all duration-300 group hover:border-indigo-500/30"
                  >
                    <span className="line-clamp-2">{suggestion}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className={cn(
                "flex gap-4 items-start w-full",
                m.role === "user" ? "justify-end ml-auto" : "justify-start mr-auto"
              )}
            >
              <div className={cn(
                "shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-md border mt-1",
                m.role === "user"
                  ? "bg-linear-to-br from-indigo-500 to-indigo-600 border-indigo-400/30 text-white order-2"
                  : "bg-zinc-800 border-zinc-700/50 text-indigo-400 order-1"
              )}>
                {m.role === "user" ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>
              <div className={cn(
                "rounded-2xl shadow-sm leading-relaxed overflow-hidden relative group/bubble",
                m.role === "user"
                  ? "bg-indigo-600 text-white rounded-tr-sm px-5 py-3.5 max-w-[85%] order-1"
                  : "bg-zinc-900 border border-white/5 text-zinc-100 rounded-tl-sm text-[15px] p-5 sm:p-6 max-w-full sm:max-w-[95%] order-2 flex-1 w-full"
              )}>
                {m.role === "user" && !isLoading && (
                  <button
                    onClick={() => handleEdit(i)}
                    className="absolute top-2 left-2 p-1.5 bg-indigo-500/50 hover:bg-indigo-500 rounded-md opacity-0 group-hover/bubble:opacity-100 transition-opacity z-10 text-white shadow-sm"
                    title="Edit prompt"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                )}

                <div className={cn(
                  "prose prose-invert prose-p:leading-relaxed max-w-none w-full flex-1 wrap-break-word prose-pre:p-0 prose-pre:bg-transparent prose-pre:border-none prose-p:my-3 prose-headings:my-4 prose-headings:font-semibold prose-ul:my-3 prose-li:my-1.5 prose-ol:my-3 leading-7 marker:text-indigo-400 prose-strong:text-indigo-100 prose-a:text-indigo-400 prose-hr:border-white/10 [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
                  m.role === "user" && "text-white prose-p:my-1 prose-headings:my-2"
                )}>
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code(props) {
                        const { children, className, node, ref, ...rest } = props
                        const match = /language-(\w+)/.exec(className || '')
                        return match ? (
                          <div className="my-4 rounded-xl overflow-hidden shadow-2xl bg-zinc-950 border border-white/10">
                            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/80 border-b border-white/5">
                              <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">{match[1]}</span>
                              <div className="flex items-center gap-1.5 border border-white/10 rounded-md px-2 py-1 bg-white/5 cursor-pointer hover:bg-white/10 transition-colors"
                                onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                              >
                                <Copy className="w-3 h-3 text-zinc-400" />
                                <span className="text-[10px] text-zinc-400 uppercase font-semibold">Copy</span>
                              </div>
                            </div>
                            <SyntaxHighlighter
                              {...rest}
                              PreTag="div"
                              children={String(children).replace(/\n$/, '')}
                              language={match[1]}
                              style={vscDarkPlus}
                              className="m-0! bg-[#1E1E1E]! p-4! text-[13px] leading-relaxed custom-scrollbar overflow-x-auto"
                            />
                          </div>
                        ) : (
                          <code {...rest} className={cn(
                            "px-1.5 py-0.5 rounded-md text-[13px] font-mono whitespace-pre-wrap break-all",
                            m.role === "user" ? "bg-white/20 text-indigo-50" : "text-indigo-300 bg-indigo-500/10"
                          )}>
                            {children}
                          </code>
                        )
                      }
                    }}
                  >
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
              className="flex gap-4 items-start w-full justify-start mr-auto"
            >
              <div className="shrink-0 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/50 flex items-center justify-center shadow-md mt-1">
                <Bot className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="px-6 py-5 rounded-2xl bg-zinc-900 border border-white/5 rounded-tl-sm flex items-center gap-1.5 shadow-sm max-w-[85%]">
                <motion.div
                  className="w-2 h-2 rounded-full bg-indigo-500"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-indigo-400"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
                />
                <motion.div
                  className="w-2 h-2 rounded-full bg-indigo-300"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} className="h-4" />
      </main>

      {/* Input Area */}
      <footer className="p-4 sm:p-6 bg-zinc-950/80 border-t border-white/5 relative z-20 w-full backdrop-blur-xl shrink-0">
        <div className="max-w-4xl mx-auto relative group">
          <div className="absolute inset-0 bg-linear-to-r from-indigo-500/20 via-purple-500/20 to-indigo-500/20 rounded-2xl blur-xl opacity-50 transition-opacity duration-500 group-hover:opacity-100 block"></div>
          <div className="relative flex flex-col bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl focus-within:border-indigo-500/50 focus-within:ring-1 focus-within:ring-indigo-500/50 transition-all duration-300 overflow-hidden">
            <textarea
              className="flex-1 bg-transparent border-none text-zinc-100 placeholder-zinc-500 px-5 pt-4 pb-12 focus:outline-none focus:ring-0 text-[15px] resize-none min-h-[60px] max-h-[200px] hide-scrollbar"
              placeholder="Ask StackBot AI..."
              value={input}
              rows={1}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              disabled={isLoading}
            />

            <div className="absolute bottom-3 right-3 flex items-center gap-2">
              <button
                onClick={sendMessage}
                disabled={!input.trim() || isLoading}
                className={cn(
                  "p-2 rounded-xl flex items-center justify-center transition-all duration-300 transform",
                  input.trim() && !isLoading
                    ? "bg-white text-zinc-950 hover:bg-zinc-200 hover:scale-105 active:scale-95 shadow-md shadow-white/10"
                    : "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5"
                )}
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 ml-0.5" />
                )}
              </button>
            </div>
          </div>
          <div className="text-center mt-3 text-xs text-zinc-500 font-medium tracking-wide">
            AI can make mistakes. Verify important information.
          </div>
        </div>
      </footer>
    </div>
  );
}