// lib/extractImgUrl.js
export function extractImgUrl(htmlStr){
  if(!htmlStr)
    return (null);
  // Isso é uma Expressão Regular (Regex) que busca pelo padrão src="..."
  const regex = /src="([^"]+)"/;
  const match = htmlStr.match(regex);

  if(match)
    return match[1];

  return (null);
  //return match ? match[1] : null;
}