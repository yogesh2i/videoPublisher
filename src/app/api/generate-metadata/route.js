import { NextResponse } from "next/server";
import { GoogleGenAI, createUserContent, createPartFromUri } from "@google/genai";
import { promises as fs } from "fs";
import path from "path";
import { googleGenAiApiKey } from "@/utils/constants";

// Disable Next.js body parser for file uploads
export const config = {
  api: {
    bodyParser: false,
  },
};

async function waitForFileActive(ai, fileName, maxTries = 20, delayMs = 1500) {
  for (let i = 0; i < maxTries; i++) {
    const fileStatus = await ai.files.get({name: fileName});
    if (fileStatus.state === "ACTIVE") return fileStatus;
    await new Promise(res => setTimeout(res, delayMs));
  }
  throw new Error("File did not become ACTIVE in time.");
}

export async function POST(req) {
  try {
    // Parse multipart/form-data
    const formData = await req.formData();
    const file = formData.get("video");
    const context = formData.get("context") || "";

    if (!file) {
      return NextResponse.json({ error: "No video file provided." }, { status: 400 });
    }

    // Save file temporarily to disk (required for some SDKs)
    const buffer = Buffer.from(await file.arrayBuffer());
    const tempPath = path.join(process.cwd(), "tmp", `${Date.now()}-${file.name}`);
    await fs.mkdir(path.dirname(tempPath), { recursive: true });
    await fs.writeFile(tempPath, buffer);

    // Gemini API
    const ai = new GoogleGenAI({ apiKey: googleGenAiApiKey });
    const myfile = await ai.files.upload({
      file: tempPath,
      config: { mimeType: file.type },
    });
       await waitForFileActive(ai, myfile.name);
    let prompt = `Generate YouTube metadata for this video. Return a JSON object with keys: title, description, tags (comma separated). Also include hashtags in the description. and keep tags concise and maximum upto 7 tags. You can use the video file to understand its content. Also more context for video is -`;
    if (context.trim()) {
      prompt += ` Context: ${context.trim()}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: createUserContent([
        createPartFromUri(myfile.uri, myfile.mimeType),
        prompt,
      ]),
    });

    // Try to parse JSON from response
    let json = null;
    try {
      json = JSON.parse(response.text);
    } catch {
      const match = response.text.match(/\{[\s\S]*\}/);
      if (match) json = JSON.parse(match[0]);
    }

    // Clean up temp file
    await fs.unlink(tempPath);

    if (json) {
      return NextResponse.json(json);
    } else {
      return NextResponse.json({ error: "Could not parse metadata from AI response." }, { status: 500 });
    }
  } catch (err) {
    return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
  }
}