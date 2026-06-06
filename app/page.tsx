import { ChatComponent } from "@/components/chat";
import { DocumentUpload } from "@/components/document/DocumentUpload";
import { Upload, UploadCloud } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div>
      <DocumentUpload/>
      <ChatComponent/>
    </div>
  );
}
