import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { googleClientId, googleClientSecret } from "@/utils/constants";
import { google } from "googleapis";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        const accessToken = session?.user?.accessToken;
        const refreshToken = session?.user?.refreshToken;
        const oauth2Client = new google.auth.OAuth2(googleClientId, googleClientSecret);

        oauth2Client.setCredentials({
            access_token: accessToken,
            refresh_token: refreshToken,
        });

        const youtube = google.youtube({ version: "v3", auth: oauth2Client });

        const videoId = extractVideoId(url);
        const language = "en"; // e.g., "en" for English
        const srtFilePath = "./tmp/captions.srt"; // Path to your SRT file

        const res = await youtube.captions.insert({
            part: "snippet",
            requestBody: {
                snippet: {
                    videoId: videoId,
                    language: language,
                    name: "English captions",
                    isDraft: false,
                },
            },
            media: {
                body: fs.createReadStream(srtFilePath),
            },
        });

        await fsp.unlink(tempPath);

        return NextResponse.json({ success: true, videoId: res.data.id });
    } catch (err) {
        console.error("Error uploading video:", err);
        return NextResponse.json({ error: "Failed to upload video." }, { status: 500 });
    }

}