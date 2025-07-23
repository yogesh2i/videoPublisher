import { googleClientId, googleClientSecret, nextAuthSecret } from "@/utils/constants";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            checks: 'none',
            authorization: {
                params: {
                    scope: [
                        "openid",
                        "https://www.googleapis.com/auth/userinfo.email",
                        "https://www.googleapis.com/auth/userinfo.profile",
                        "https://www.googleapis.com/auth/youtube.upload",
                        "https://www.googleapis.com/auth/youtube",
                        "https://www.googleapis.com/auth/youtube.readonly",
                        "https://www.googleapis.com/auth/youtubepartner",
                        "https://www.googleapis.com/auth/youtubepartner-channel-audit",
                        "https://www.googleapis.com/auth/youtube.force-ssl",
                        "https://www.googleapis.com/auth/youtube.readonly",

                    ].join(" "),
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        })
    ],
    callbacks: {
        async jwt({ token, account, user }) {
            if (account && account.access_token) {
                token.accessToken = account.access_token;
                token.username = user.name;
                token.refreshToken = account.refresh_token;
                token.expiresAt = account.expires_at * 1000;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.accessToken = token.accessToken;
                session.user.name = token.username || session.user.name;
                session.user.refreshToken = token.refreshToken;
                session.user.expiresAt = token.expiresAt;
            }
            return session;
        }
    },

    session: {
        strategy: 'jwt',
    },

    secret: nextAuthSecret,
} 