"use client";
import { useRef, useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { useDocuments } from "@/lib/hooks/useDocuments";
import { useRouter } from "next/navigation";
    
export const UploadZone = () => {
  const { uploadDocument, loading } = useDocuments();
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFile = async (file: File) => {
    if (!file || file.type !== "application/pdf") return;
    const documentId = await uploadDocument(file);
    if (documentId) router.push(`/documents/${documentId}`);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
      }}
      className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all ${
        dragOver
          ? "border-orange-500 bg-orange-500/5"
          : "border-white/20 hover:border-white/40 bg-white/5"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />

      {loading ? (
        <>
          <Loader2 size={32} className="text-orange-500 animate-spin mb-4" />
          <p className="text-white font-medium">Processing PDF...</p>
          <p className="text-white/40 text-sm mt-1">This may take a moment</p>
        </>
      ) : (
        <>
          <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
            <Upload size={22} className="text-white/60" />
          </div>
          <p className="text-white font-medium mb-1">Drop a PDF here</p>
          <p className="text-white/40 text-sm">or click to browse</p>
        </>
      )}
    </div>
  );
};