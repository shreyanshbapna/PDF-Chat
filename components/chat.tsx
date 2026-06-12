"use client";
import axios from "axios";
export const ChatComponent = () => {

    return (
        <div className="border-2 border-gray-300 rounded-md p-4">
            <input type="text" placeholder="Type your message..." id="message-input" />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2" onClick={async () => {
                
                const messageInput = document.getElementById("message-input") as HTMLInputElement;
                const documentId = messageInput.getAttribute("data-document-id");
                console.log("Document ID:", documentId);
                if (!documentId) return;

                await axios.post(`/api/documents/${documentId}/chat`, {
                    message: messageInput.value,
                });
                messageInput.value = "";
            }}>
                Send
            </button>
        </div>
    );
}