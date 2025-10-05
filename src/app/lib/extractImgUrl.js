// lib/extractImgUrl.js
export function extractImgUrl(htmlStr) {
  if (!htmlStr) return null;
  // Regex simples que captura o primeiro src="..."
  const regex = /src="([^"]+)"/;
  const match = htmlStr.match(regex);
  return match ? match[1] : null;
}
