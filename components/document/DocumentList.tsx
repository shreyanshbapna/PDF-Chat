"use client";
import { FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments } from "@/lib/hooks/useDocuments";

export const DocumentList = () => {
  const { documents, loading, deleteDocument } = useDocuments();
  const router = useRouter();

  if (loading) {
    return (
      <div className="space-y-1 px-1">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-9 w-full bg-white/5 rounded-lg" />
        ))}
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <p className="text-white/20 text-xs text-center py-6 px-2">
        No documents yet
      </p>
    );
  }

  return (
    <div className="space-y-0.5">
      {documents.map((doc) => (
        <div
          key={doc.id}
          onClick={() => router.push(`/documents/${doc.id}`)}
          className="group flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/10 cursor-pointer transition-all"
        >
          <FileText size={14} className="text-white/40 flex-shrink-0" />
          <span className="text-white/70 text-sm truncate flex-1 group-hover:text-white transition-colors">
            {doc.name}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              deleteDocument(doc.id);
            }}
            className="opacity-0 group-hover:opacity-100 text-white/30 hover:text-red-400 transition-all flex-shrink-0"
          >
            <Trash2 size={13} />
          </button>
        </div>
      ))}
    </div>
  );
};