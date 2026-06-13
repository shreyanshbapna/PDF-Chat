import axios from "axios";
import { useCallback, useEffect, useState } from "react";

interface Document {
  id: string;
  name: string;
  createdAt: string;
}

export const useDocuments = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

 useEffect(() => {
  const fetch = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/documents");
      setDocuments(res.data.documents || []);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };
  fetch();
}, []);

  const uploadDocument = useCallback(
    async (
      file: File
    ): Promise<string | null> => {
      const selectedFile = file;
      if (!selectedFile) return null;

      setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        const res = await axios.post("/api/documents/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const data = await res.data;
        setDocuments((prev) => [
          ...prev,
          {
            id: data.documentId,
            name: selectedFile.name,
            createdAt: new Date().toISOString(),
          },
        ]);
        return data.documentId;
      } catch (error) {
        console.error("Error uploading document:", error);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const deleteDocument = useCallback(async (documentId: string) => {
    setLoading(true);
    try {
      await axios.delete(`/api/documents/${documentId}`);
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { documents, uploadDocument, deleteDocument, loading };
};
