"use client";
import { useChat } from "@/lib/hooks/useChat";
import { Button } from "@/components/ui/button";
import { Send, Bot, User, FileText } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  documentId: string;
}

export const ChatZone = ({ documentId }: Props) => {
  const { messages, loading, sendMessage } = useChat(documentId);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput("");
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <FileText size={22} className="text-orange-400" />
            </div>
            <p className="text-white/40 text-sm">
              Ask anything about this document
            </p>
          </div>
        ) : (
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-1">
                    <Bot size={14} className="text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-white/10 text-white rounded-br-sm"
                      : "bg-[#2f2f2f] text-white/90 rounded-bl-sm"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <div
                      className="prose prose-invert prose-sm max-w-none
                      prose-p:my-1.5 prose-p:leading-relaxed
                      prose-headings:text-white prose-headings:font-semibold prose-headings:mt-3 prose-headings:mb-1
                      prose-h3:text-base prose-h2:text-base
                      prose-strong:text-white prose-strong:font-semibold
                      prose-ul:my-1.5 prose-ul:pl-4 prose-li:my-0.5
                      prose-ol:my-1.5 prose-ol:pl-4
                      prose-table:text-xs prose-table:w-full
                      prose-th:text-white/70 prose-th:font-medium prose-th:py-1.5 prose-th:px-2 prose-th:border prose-th:border-white/10
                      prose-td:py-1.5 prose-td:px-2 prose-td:border prose-td:border-white/10
                      prose-code:text-orange-300 prose-code:bg-white/10 prose-code:px-1 prose-code:rounded
                      prose-hr:border-white/10
                    "
                    >
                      <ReactMarkdown>{msg.message}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.message
                  )}
                </div>

                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0 mt-1">
                    <User size={14} className="text-white/60" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-[#2f2f2f] rounded-2xl rounded-bl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 bg-white/40 rounded-full animate-bounce [animation-delay:300ms]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input — always pinned to bottom */}
      <div className="flex-shrink-0 border-t border-white/10 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center gap-2 bg-[#2f2f2f] rounded-2xl px-4 py-3 border border-white/10 focus-within:border-white/25 transition-colors">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask about this document..."
              className="flex-1 bg-transparent text-white placeholder-white/30 text-sm outline-none"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              size="icon"
              className="w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-xl flex-shrink-0 disabled:opacity-30"
            >
              <Send size={14} />
            </Button>
          </div>
          <p className="text-white/20 text-xs text-center mt-2">
            Press Enter to send
          </p>
        </div>
      </div>
    </div>
  );
};
