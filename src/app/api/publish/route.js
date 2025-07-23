import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { google } from "googleapis";
import fs from "fs";
import { promises as fsp } from "fs";
import { googleClientId, googleClientSecret } from "@/utils/constants";
import { saveTempFile } from "@/utils/fileUpload";

export async function POST(req) {
    try {
        // Parse multipart/form-data
        const formData = await req.formData();
        const file = formData.get("video");
        const title = formData.get("title");
        const description = formData.get("description");
        const tags = formData.get("tags");

        if (!file || !title || !description) {
            return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
        }

        // Save file temporarily
        const tempPath = await saveTempFile(file);

        // Get user session and tokens
        const session = await getServerSession(authOptions);
        const accessToken = session?.user?.accessToken;
        const refreshToken = session?.user?.refreshToken;
        if (!accessToken || !refreshToken) {
            await fsp.unlink(tempPath);
            return NextResponse.json({ error: "No access or refresh token found." }, { status: 401 });
        }

        // Set up Google API client with refresh token
        const oauth2Client = new google.auth.OAuth2(googleClientId, googleClientSecret);

        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        const youtube = google.youtube({ version: "v3", auth: oauth2Client });

        // Prepare tags as array
        const tagsArr = tags ? tags.split(",").map(t => t.trim()).filter(Boolean) : [];
        // Upload video
        const res = await youtube.videos.insert({
            part: ["snippet", "status"],
            requestBody: {
                snippet: {
                    title,
                    description,
                    tags: tagsArr,
                },
                status: {
                    privacyStatus: "private",
                },
            },
            media: {
                body: fs.createReadStream(tempPath),
            },
        });

        // Clean up temp file
        await fsp.unlink(tempPath);

        return NextResponse.json({ success: true, videoId: res.data.id });
    } catch (err) {
        return NextResponse.json({ error: err?.message || "Server error" }, { status: 500 });
    }
}
