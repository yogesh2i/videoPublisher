import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { googleGenAiApiKey } from "@/utils/constants";

export async function POST(req, { params }) {
    const { refine } = await params;
    const { value, context } = await req.json();

    if (!["title", "description", "tags"].includes(refine)) {
        return NextResponse.json({ error: "Invalid refinement type." }, { status: 400 });
    }

    const ai = new GoogleGenAI({ apiKey: googleGenAiApiKey });

    let prompt = "";
    if (refine === "title") {
        prompt = `Refine this YouTube video title to make it more captivating and relevant. Return only the improved title as plain text.`;
    } else if (refine === "description") {
        prompt = `Refine this YouTube video description to make it more engaging and informative. Add relevant hashtags. Return only the improved description as plain text.`;
    } else if (refine === "tags") {
        prompt = `Refine these YouTube video tags to be concise, relevant, and comma-separated (max 7 tags). Return only the improved tags as plain text.`;
    }
    if (context?.trim()) {
        prompt += ` Context: ${context.trim()}`;
    }
    prompt += `\nCurrent ${refine}: ${value}`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    if (!response || !response.text) {
        return NextResponse.json({ error: "Failed to generate refined content." }, { status: 500 });
    }
    return NextResponse.json({ [refine]: response.text.trim() });
}