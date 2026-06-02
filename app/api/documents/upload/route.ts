import {extractTextFromPDF} from "@/lib/pdf";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const arrayBuffer = await file.arrayBuffer();
    const content = await extractTextFromPDF(arrayBuffer);
    

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    return NextResponse.json({ message: "File uploaded successfully" });

}
