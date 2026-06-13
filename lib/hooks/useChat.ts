import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface Message {
  role: "user" | "assistant";
  message: string;
}

export const useChat = (documentId: string) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/documents/${documentId}/chat`);
        setMessages(res.data.messages);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [documentId]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!message.trim() || loading) return;

      setLoading(true);

      setMessages((prev) => [...prev, { role: "user", message: message }]);

      try {
        const response = await axios.post(`/api/documents/${documentId}/chat`, {
          message,
        });

        if (!response) {
          throw new Error("Failed to send message");
        }
        const data = response.data;
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: "assistant", message: data.message },
        ]);
      } catch (error) {
        console.error("Error sending message:", error);
        setMessages((prev) => prev.slice(0, -1)); // undo user message
      } finally {
        setLoading(false);
      }
    },
    [documentId],
  );

  return { messages, loading, sendMessage };
};
