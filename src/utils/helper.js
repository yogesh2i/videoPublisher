//extract video id only from complete url
export function extractVideoId(youtubeUrl) {
  try {
    const urlObj = new URL(youtubeUrl);
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.slice(1);
    }
    if (urlObj.hostname.includes("youtube.com")) {
      if (urlObj.pathname === "/watch") {
        return urlObj.searchParams.get("v");
      }
      const parts = urlObj.pathname.split("/");
      const id = parts[parts.length - 1];
      if (id.length === 11) return id;
    }
  } catch {
    return "";
  }
  return "";
}

//convert string timeset to total seconds
export function timestampToSeconds(ts) {
  const parts = ts.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 0;
}

//get shared url to iframe compatible url 
export function getEmbedUrl(youtubeUrl, start = 0) {
  try {
    const urlObj = new URL(youtubeUrl);
    let videoId = "";
    if (urlObj.hostname === "youtu.be") {
      videoId = urlObj.pathname.slice(1);
    } else if (urlObj.hostname.includes("youtube.com")) {
      if (urlObj.pathname === "/watch") {
        videoId = urlObj.searchParams.get("v");
      } else {
        const parts = urlObj.pathname.split("/");
        videoId = parts[parts.length - 1];
      }
    }
    const seconds = timestampToSeconds(start);
    return videoId ? `https://www.youtube.com/embed/${videoId}?start=${seconds}` : "";
  } catch {
    return "";
  }
}
