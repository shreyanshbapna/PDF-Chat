"use client";
export const DocumentUpload = () => {
    
    const Uploadhandle = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            
            const res = await fetch("/api/documents/upload", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            document.getElementById("message-input")?.setAttribute("data-document-id", data.documentId);
        }
    }
    return (
        <div>
            <h1>Document Upload</h1>
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center cursor-pointer">
                <input type='file' accept='.pdf' onChange={Uploadhandle}/>
            </div>
            
        </div>
    );
}