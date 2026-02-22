// get the yt tumbnail 

export const getYouTubeThumbnail = (url) => {
  if (!url) return "";

  let videoId = "";

  // Handle youtu.be links
  if (url.includes("youtu.be")) {
    videoId = url.split("youtu.be/")[1].split("?")[0];
  }

  // Handle youtube.com/watch?v=
  if (url.includes("youtube.com/watch?v=")) {
    videoId = url.split("v=")[1].split("&")[0];
  }

  // Fallback using the youtubeId field (if used)
  if (!videoId) return "";

  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};



