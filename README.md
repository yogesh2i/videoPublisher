# MagicRoll Video Publisher

MagicRoll Video Publisher is a Next.js app that automates YouTube video publishing with AI-generated titles, descriptions, and tags. It uses Google OAuth for authentication and uploads videos directly to the user's YouTube channel.

---

## Features

- **Google OAuth2 Authentication** (NextAuth.js)
- **YouTube Data API v3** integration for direct uploads
- **AI-powered metadata generation** (title, description, tags) using Google Gemini
- **Secure, session-based workflow**
- **Test user access control** for Google OAuth consent

---

## Prerequisites

- Node.js 18+
- A Google Cloud project with:
  - OAuth 2.0 credentials (Client ID & Secret)
  - YouTube Data API v3 enabled
  - Gemini API key (for AI metadata)
- Your Google account must be added as a **test user** in the OAuth consent screen.
- You must have a **YouTube channel** created on your Google account to upload videos.

---

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/magicroll-video-publisher.git
   cd magicroll-video-publisher
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Create a `.env.local` file in the root directory (already present in your project):

   ```
   YOUTUBE_API_KEY=your_youtube_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=https://your-domain.com
   GOOGLE_GEN_AI_API_KEY=your_gemini_api_key
   GOOGLE_REDIRECT_URI=https://your-domain.com/api/auth/callback/google
   ```

   > **Note:**  
   > - The `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` must match your Google Cloud OAuth credentials.
   > - The `GOOGLE_GEN_AI_API_KEY` is for Gemini AI metadata generation.
   > - The `NEXTAUTH_URL` and `GOOGLE_REDIRECT_URI` must match your deployed domain or `http://localhost:3000` for local development.

4. **Update Google Cloud Console**
   - Add your domain and `/api/auth/callback/google` as an **Authorized redirect URI**.
   - Add your Google account as a **test user** in the OAuth consent screen.
   - Enable **YouTube Data API v3** and **Gemini API**.

---

## Usage

1. **Start the development server**
   ```bash
   npm run dev
   ```

2. **Open the app**
   - Go to [http://localhost:3000](http://localhost:3000) (or your deployed URL).

3. **Authenticate**
   - Click "Connect Your YouTube Account".
   - If you are not an approved tester, email your Google account to `yogesh12212071@gmail.com` for access.
   - Make sure you have a YouTube channel created on your account.

4. **Upload Workflow**
   - Upload a video file.
   - Let the AI generate metadata (title, description, tags).
   - Review and edit as needed.
   - Publish directly to your YouTube channel.

---

## Important Notes

- **Test User Restriction:**  
  Only approved Google accounts (test users) can use the app due to Google OAuth restrictions.
- **YouTube Channel Required:**  
  You must have a YouTube channel created on your Google account before uploading.
- **Privacy:**  
  Videos are uploaded as `private` by default. You can change this in the code if needed.

---

## Troubleshooting

- **OAuth/Scope Issues:**  
  - Remove the app from [Google Account Permissions](https://myaccount.google.com/permissions) and sign in again if you change scopes.
  - Make sure your account is a test user.
- **Unauthorized/Forbidden Errors:**  
  - Ensure your YouTube channel exists.
  - Check that your access and refresh tokens are present and valid.
- **API Quotas:**  
  - Make sure your Google Cloud project has sufficient quota for YouTube Data API v3.

---

## Contact

For access or support, email: [yogesh12212071@gmail.com](mailto:yogesh12212071@gmail.com)

---