// /lib/apiTainacanufsm.js
// src/app/lib/apiTainacanufsm.js

const BASE_URL = "https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2";

export function extractImgUrl(htmlStr) {
  if (!htmlStr) return null;
  // Isso é uma Expressão Regular (Regex) que busca pelo padrão src="..."
  //const regex = /src="([^"]+)"/;
  // Regex mais robusta que funciona com aspas simples e duplas
  const regex = /src=["']([^"']+)["']/i;
  const match = htmlStr.match(regex);

  if (match) return match[1];

  return null;
  //return match ? match[1] : null;
}
// EXTRAIR DO HTML COM REGEX SIMPLES
//  static extractFromHtml(html) {
    // Procura por src="URL" ou src='URL'
  //  const regex = /src=["']([^"']+)["']/i;
  //  const match = html.match(regex);
  //  return match ? match[1] : null;
 // }
 
export async function obterObras(perpage = 5) {
  console.log("🔍 Iniciando busca na API...");
  const urlTainacan = `${BASE_URL}/collection/2174/items?perpage=${perpage}`;
  //setCarregando(true);
  const resposta = await fetch(urlTainacan);

  if (!resposta.ok) { throw new Error(`Erro HTTP: ${resposta.status}`); }
  const dados = await resposta.json();

 // const obrasComImg = dados.items.map((obra) => ({
   // ...obra, // Mantém todos os dados originais da obra
   // urlimg: extractImgUrl(obra.document_as_html), // E adiciona a URL da imagem extraída
//  }));

  return dados.items.map(obra => ({
    ...obra,
    urlimg: extractImgUrl(obra.document_as_html)
  }));
}

















/*
export const TAINCAN_BASE = 'https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2';
export function itemUrl(id) {
  return `${TAINCAN_BASE}/item/${id}`;
}
export function itemsListUrl({ collection = 2174, perpage = 30 } = {}) {
  return `${TAINCAN_BASE}/collection/${collection}/items?perpage=${perpage}`;
}
export function exhibitionsUrl() {
  // ajuste conforme API real das exposições; é um exemplo
  return `${TAINCAN_BASE}/collection/EXPOSICOES/items?perpage=50`;
}
*/
