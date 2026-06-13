"use client";
import { UploadZone } from "@/components/document/UploadZone";
import { DocumentList } from "@/components/document/DocumentList";
import { FileText, Plus } from "lucide-react";
import { useState } from "react";

export const Dashboard = () => {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="flex h-screen bg-[#212121] text-white overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-[#171717] flex flex-col border-r border-white/5">
        {/* Logo */}
        <div className="px-4 py-4 flex items-center gap-2.5">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText size={14} className="text-white" />
          </div>
          <span className="font-semibold text-white text-sm">PDF Chat</span>
        </div>

        {/* New Upload Button */}
        <div className="px-3 mb-4">
          <button
            onClick={() => setShowUpload(true)}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white text-sm transition-all"
          >
            <Plus size={15} />
            Upload PDF
          </button>
        </div>

        {/* Document List Label */}
        <div className="px-4 mb-2">
          <span className="text-white/30 text-xs font-medium uppercase tracking-wider">
            Documents
          </span>
        </div>

        {/* Documents */}
        <div className="flex-1 overflow-y-auto px-2">
          <DocumentList />
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-8">
        {showUpload ? (
          <div className="w-full max-w-xl">
            <button
              onClick={() => setShowUpload(false)}
              className="text-white/30 hover:text-white text-sm mb-6 transition-colors"
            >
              ← Back
            </button>
            <UploadZone />
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <FileText size={28} className="text-orange-400" />
            </div>
            <h1 className="text-2xl font-semibold text-white mb-2">
              Chat with your PDFs
            </h1>
            <p className="text-white/40 text-sm mb-8">
              Upload a document from the sidebar or start a new one
            </p>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-sm font-medium transition-colors mx-auto"
            >
              <Plus size={16} />
              Upload PDF
            </button>
          </div>
        )}
      </div>
    </div>
  );
};