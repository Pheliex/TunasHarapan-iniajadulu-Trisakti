"use client";

import { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, Sparkles, X, Minus } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: "Halo. Saya R1ELS AI. Kamu bisa bertanya tentang jurusan, fasilitas, kegiatan, atau informasi sekolah." }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMsg = message;
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
      setChatHistory((prev) => [...prev, { sender: "bot", text: data.reply || "Maaf, AI tidak memberikan balasan." }]);
    } catch (error) {
      setChatHistory((prev) => [...prev, { sender: "bot", text: "Maaf, koneksi ke server terputus." }]);
    } finally {
      setIsLoading(false);
    }
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
              <div className="absolute -right-10 -top-16 size-36 rounded-full bg-[#5483B3]/20 blur-2xl" />
              <div className="relative flex items-center gap-3">
                <div className="grid size-11 place-items-center rounded-2xl border border-[#7DA0CA]/30 bg-[#052659] text-[#C1E8FF]">
                  <Sparkles size={19} />
                </div>
                <div>
                  <p className="font-semibold tracking-tight">R1ELS AI</p>
                  <p className="text-[11px] text-[#C1E8FF]/55">Asisten virtual SMK Tunas Harapan</p>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <button onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white">
                    <Minus size={15} />
                  </button>
                  <button onClick={() => setOpen(false)} className="grid size-8 place-items-center rounded-full text-white/45 transition hover:bg-white/10 hover:text-white">
                    <X size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Area Obrolan */}
            <div className="h-[320px] space-y-4 overflow-y-auto px-4 py-5 scroll-smooth">
              {chatHistory.map((chat, index) => (
                chat.sender === "bot" ? (
                  <div key={index} className="flex gap-3">
                    <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#5483B3]/20 text-[#C1E8FF]">
                      <Bot size={14} />
                    </div>
                    {/* CSS Tailwind khusus untuk merapikan list dan paragraf dari Markdown */}
                    <div className="max-w-[82%] rounded-2xl rounded-tl-md border border-white/8 bg-white/[.06] px-4 py-3 text-sm leading-6 text-white/75 [&>p]:mb-2 last:[&>p]:mb-0 [&>ul]:list-disc [&>ul]:ml-5 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:ml-5 [&>ol]:mb-2 [&>strong]:text-white">
                      <ReactMarkdown>{chat.text}</ReactMarkdown>
                    </div>
                  </div>
                ) : (
                  <div key={index} className="ml-auto max-w-[78%] rounded-2xl rounded-tr-md bg-[#C1E8FF] px-4 py-3 text-sm font-medium leading-6 text-[#021024]">
                    {chat.text}
                  </div>
                )
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-[#5483B3]/20 text-[#C1E8FF]">
                    <Sparkles size={14} className="animate-pulse" />
                  </div>
                  <div className="max-w-[82%] rounded-2xl rounded-tl-md border border-white/8 bg-white/[.06] px-4 py-3 text-sm leading-6 text-white/40 italic">
                    Memproses...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Form Input */}
            <form onSubmit={handleSendMessage} className="border-t border-white/10 p-3 shrink-0">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/20 p-2 focus-within:border-[#7DA0CA]/50">
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tulis pertanyaan..."
                  disabled={isLoading}
                  className="min-w-0 flex-1 bg-transparent px-3 text-sm text-white outline-none placeholder:text-white/30 disabled:opacity-50"
                />
                <button type="submit" disabled={isLoading} className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#C1E8FF] text-[#021024] transition hover:bg-white disabled:opacity-50">
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(!open)}
        className="group relative ml-auto grid size-14 place-items-center rounded-full border border-[#C1E8FF]/45 bg-[#052659] text-[#C1E8FF] shadow-[0_12px_45px_rgba(2,16,36,.45)] transition hover:border-[#C1E8FF]/80"
      >
        <span className="absolute inset-0 rounded-full border border-[#7DA0CA]/30 animate-ping [animation-duration:3s]" />
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={21} />
            </motion.span>
          ) : (
            <motion.span key="bot" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <Bot size={21} />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}