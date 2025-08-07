import { NextResponse } from "next/server";
import { googleClientId, googleClientSecret, googleGenAiApiKey } from "@/utils/constants";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { google } from "googleapis";
import { extractVideoId } from "@/utils/helper";

/**
 * POST /api/analyze
 * Analyzes a YouTube video and suggests up to 5 short segments likely to go viral.
 * 
 * Request body:
 *   { url: string } // YouTube video URL
 * 
 * Response:
 *   { segments: Array<{ start: string, end: string, description: string }> }
 */

export async function POST(req) {
    try {
        // Parse request body
        const { url } = await req.json();
        if (!url) {
            return NextResponse.json({ error: "Missing YouTube video URL." }, { status: 400 });
        }

        // Authenticate user session
        const session = await getServerSession(authOptions);
        if (!session?.user?.accessToken) {
            return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
        }

        // Set up OAuth2 client for YouTube Data API
        const oauth2Client = new google.auth.OAuth2(googleClientId, googleClientSecret);
        oauth2Client.setCredentials({
            access_token: session.user.accessToken,
            refresh_token: session.user.refreshToken,
        });
        const youtube = google.youtube({ version: "v3", auth: oauth2Client });

        // Initialize metadata and transcript
        const metadata = { title: "", description: "", tags: [] };
        let transcript = "";

        // Fetch video metadata
        const videoId = extractVideoId(url);
        if (!videoId) {
            return NextResponse.json({ error: "Invalid YouTube URL." }, { status: 400 });
        }

        try {
            // Get video details
            const videoResponse = await youtube.videos.list({
                part: "snippet",
                id: videoId,
            });
            const video = videoResponse?.data?.items?.[0];
            if (!video) {
                return NextResponse.json({ error: "Video not found." }, { status: 404 });
            }
            metadata.title = video.snippet?.title || "";
            metadata.description = video.snippet?.description || "";
            metadata.tags = video.snippet?.tags || [];

            // Try to fetch captions (transcript)
            const captions = await youtube.captions.list({
                part: "id,snippet",
                videoId,
            });
            const captionId = captions?.data?.items?.[0]?.id;
            if (captionId) {
                // Download captions in SRT format
                const captionResponse = await youtube.captions.download(
                    { id: captionId, tfmt: "srt" },
                    { responseType: "text" }
                );
                transcript = captionResponse.data;
            }
        } catch (youtubeError) {
            // Log and continue without transcript if captions fail
            console.error("YouTube API error:", youtubeError);
        }

        // Prepare prompt for AI model
        const prompt = `
      Given this YouTube video, identify up to 5 short (less than 90 seconds) segments that are likely to go viral as short-form content.
      Analyze the video to identify engaging moments (based on: speech intensity, keyword frequency, pause patterns, emotional cues, etc.).
      Use the video title, description, and tags to understand the content. Here is the metadata:
      Title: ${metadata.title},
      Description: ${metadata.description},
      Tags: ${metadata.tags.join(", ")},
      You can use transcript also if available here - ${transcript}
      Return an array of JSON objects in this format:
      [
        { "start": "00:45", "end": "01:10", "description": "Exciting moment" },
        ...
      ]
    `;

        // Call Google Generative AI (Gemini) to analyze the video
        const genAI = new GoogleGenerativeAI(googleGenAiApiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const result = await model.generateContent([
            prompt,
            { fileData: { fileUri: url } },
        ]);

        // Parse AI response for segments
        let segments = [];
        try {
            segments = JSON.parse(result.response.text());
        } catch {
            // Fallback: extract JSON array from text if not pure JSON
            const match = result.response.text().match(/\[.*\]/s);
            if (match) segments = JSON.parse(match[0]);
        }

        return NextResponse.json({ segments });
    } catch (err) {
        // Log error for debugging
        console.error("Analyze API error:", err);
        return NextResponse.json(
            { error: "Server error. We will be back soon." },
            { status: 500 }
        );
    }
}