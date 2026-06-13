"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ChatZone } from "@/components/chat/ChatZone";
import { ArrowLeft, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";

interface Document {
  id: string;
  name: string;
  createdAt: string;
}

export default function ChatPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);

  useEffect(() => {
    axios
      .get(`/api/documents/${id}`)
      .then((res) => setDocument(res.data.document))
      .catch(console.error);
  }, [id]);

  return (
    <div className="min-h-screen bg-[#212121] text-white flex flex-col">
      {/* Header */}
      <div className="border-b border-white/10 px-4 py-3 flex items-center gap-3 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/")}
          className="text-white/40 hover:text-white hover:bg-white/10 w-8 h-8"
        >
          <ArrowLeft size={17} />
        </Button>
        <div className="w-7 h-7 bg-orange-500/20 rounded-lg flex items-center justify-center">
          <FileText size={14} className="text-orange-400" />
        </div>
        <span className="font-medium text-white truncate">
          {document?.name ?? "Loading..."}
        </span>
      </div>

      {/* Chat */}
      <div className="flex-1 overflow-hidden">
        <ChatZone documentId={id} />
      </div>
    </div>
  );
}
