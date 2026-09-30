"use client";
import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X, Minus, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import Link from "next/link"; // Menggunakan Link Next.js agar perpindahan halaman mulus

type ChatMessage = {
  sender: "bot" | "user";
  text: string;
};

const QUICK_REPLIES = [
  "Info PPDB 2027 📝",
  "Ada jurusan apa aja? 🎯",
  "Biaya SPP & Daftar 💰",
  "Fasilitas & Asrama 🛏️",
  "Peluang kerjanya gimana? 🚀"
];

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { 
      sender: "bot", 
      text: "Halo! Aku R1ELS AI, asisten sekolah SMK Telekomunikasi Tunas Harapan. Kalau mau nanya sesuatu, ketik aja di bawah ya~~" 
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [chatHistory, isLoading, open]);

  const sendMessageToBot = async (userMsg: string) => {
    if (!userMsg.trim() || isLoading) return;
    
    setMessage(""); 
    setChatHistory((prev) => [...prev, { sender: "user", text: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, history: chatHistory }),
      });
      
      const data = await res.json();
      const botReply = data.reply || "Maaf, sistem sedang error.";

      setChatHistory((prev) => [
        ...prev, 
        { sender: "bot", text: botReply }
      ]);

    } catch (error) {
      console.error("Chatbot Fetch Error:", error);
      setChatHistory((prev) => [
        ...prev, 
        { sender: "bot", text: "Ck, koneksinya putus nih! Coba cek internetmu sendiri deh. 😅" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessageToBot(message);
  };

  return (
    <div className="fixed bottom-5 right-5 z-[80] sm:bottom-7 sm:right-7">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-4 w-[calc(100vw-2.5rem)] max-w-[390px] overflow-hidden rounded-[1.75rem] border border-[#7DA0CA]/30 bg-[#021024]/95 text-[#F4F9FF] shadow-2xl shadow-[#021024]/50 backdrop-blur-2xl flex flex-col"
          >
            {/* Header */}
            <div className="relative overflow-hidden border-b border-white/10 px-5 py-4 shrink-0">
              <div className="absolute -right-10 -top-16 size-36 rounded-full bg-[#5483B3]/20 blur-2xl pointer-events-none" />
              <div className="relative flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl border border-[#7DA0CA]/30 bg-[#052659] text-[#C1E8FF]">
                  <Sparkles size={19} />
                </div>
                <div>
                  <p className="font-semibold tracking-tight">R1ELS AI</p>
                  <p className="text-[11px] text-[#C1E8FF]/55">Asisten Virtual Sekolah</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <button 
                    onClick={() => setOpen(false)} 
                    title="Tutup Chat"
                    className="grid size-8 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white"
                  >
                    <Minus size={15} />
                  </button>
                </div>
              </div>
            </div>

            {/* Area Obrolan */}
            <div className="h-[350px] space-y-4 overflow-y-auto px-4 py-5 scroll-smooth custom-scrollbar">
              {chatHistory.map((chat, index) => (
                chat.sender === "bot" ? (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={index} 
                    className="flex gap-3"
                  >
                    <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#5483B3]/20 text-[#C1E8FF]">
                      <Bot size={14} />
                    </div>
                    <div className="max-w-[82%] rounded-2xl rounded-tl-md border border-white/8 bg-white/[.06] px-4 py-3 text-sm leading-relaxed text-white/80
                      prose prose-invert prose-sm 
                      [&>p]:mb-2 last:[&>p]:mb-0 
                      [&>ul]:mb-3 [&>ul]:list-disc [&>ul]:pl-5 
                      [&>ol]:mb-3 [&>ol]:list-decimal [&>ol]:pl-5 
                      [&>strong]:text-[#C1E8FF] [&>strong]:font-semibold"
                    >
                      <ReactMarkdown
                        components={{
                          a: ({ node, href, children, ...props }) => {
                            // Cek apakah link mengarah ke halaman internal (dimulai dengan "/")
                            const isInternal = href && href.startsWith("/");
                            
                            if (isInternal) {
                              return (
                                <Link 
                                  href={href} 
                                  className="text-[#7DA0CA] font-medium underline underline-offset-2 hover:text-[#C1E8FF] transition-colors"
                                >
                                  {children}
                                </Link>
                              );
                            }
                            
                            // Jika link eksternal (https://...), buka di tab baru
                            return (
                              <a 
                                href={href} 
                                {...props} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="text-[#7DA0CA] font-medium underline underline-offset-2 hover:text-[#C1E8FF] transition-colors"
                              >
                                {children}
                              </a>
                            );
                          },
                        }}
                      >
                        {chat.text}
                      </ReactMarkdown>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 10 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    key={index} 
                    className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-[#C1E8FF] px-4 py-3 text-sm font-medium leading-relaxed text-[#021024] break-words"
                  >
                    {chat.text}
                  </motion.div>
                )
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#5483B3]/20 text-[#C1E8FF]">
                    <Loader2 size={14} className="animate-spin" />
                  </div>
                  <div className="max-w-[82%] flex items-center h-10 rounded-2xl rounded-tl-md border border-white/8 bg-white/[.06] px-4 text-sm text-white/40 italic">
                    <span className="flex gap-1">
                      <span className="animate-bounce">.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                      <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                    </span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Quick Replies Bar */}
            <div className="flex gap-2 overflow-x-auto px-4 pb-3 pt-1 scroll-smooth shrink-0 bg-[#021024]
              [&::-webkit-scrollbar]:h-1.5 
              [&::-webkit-scrollbar-track]:bg-transparent 
              [&::-webkit-scrollbar-thumb]:rounded-full 
              [&::-webkit-scrollbar-thumb]:bg-[#7DA0CA]/30 
              hover:[&::-webkit-scrollbar-thumb]:bg-[#7DA0CA]/60"
            >
              {QUICK_REPLIES.map((text, i) => (
                <button
                  key={i}
                  disabled={isLoading}
                  onClick={() => sendMessageToBot(text)}
                  className="whitespace-nowrap rounded-xl border border-[#7DA0CA]/30 bg-[#052659]/50 px-3 py-1.5 text-[11px] font-medium text-[#C1E8FF] transition hover:bg-[#7DA0CA]/30 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {text}
                </button>
              ))}
            </div>

            {/* Form Input */}
            <form onSubmit={handleFormSubmit} className="border-t border-white/10 p-3 shrink-0 bg-[#021024]">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-1.5 focus-within:border-[#C1E8FF]/50 transition-colors">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={isLoading ? "Tunggu sebentar..." : "Ketik nanya apa gitu kek..."}
                  disabled={isLoading}
                  autoComplete="off"
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/30 disabled:opacity-50"
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !message.trim()} 
                  className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#C1E8FF] text-[#021024] transition hover:bg-white disabled:opacity-30 disabled:hover:bg-[#C1E8FF]"
                >
                  <Send size={15} className={isLoading ? "opacity-0" : "opacity-100"} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Action Button (FAB) */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="group relative ml-auto grid size-14 place-items-center rounded-full border border-[#C1E8FF]/45 bg-[#052659] text-[#C1E8FF] shadow-[0_12px_45px_rgba(2,16,36,.45)] transition hover:border-[#C1E8FF]/80 z-50"
      >
        {!open && <span className="absolute inset-0 rounded-full border border-[#7DA0CA]/50 animate-ping [animation-duration:3s]" />}
        
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <X size={24} />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              <Bot size={24} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}