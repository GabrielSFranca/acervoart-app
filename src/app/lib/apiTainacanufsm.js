// /lib/apiTainacanufsm.js
// src/app/lib/apiTainacanufsm.js

const BASE_URL = "https://tainacan.ufsm.br/acervo-artistico/wp-json";

/**
 * Busca a lista de obras e enriquece cada uma com a URL direta da sua imagem,
 * seguindo a abordagem robusta de usar o endpoint de mídia.
 */
export async function obterObras(perpage = 50) {
  const urlTainacan = `${BASE_URL}/tainacan/v2/collection/2174/items?perpage=${perpage}`;

  const resposta = await fetch(urlTainacan, { next: { revalidate: 3600 } });
  if (!resposta.ok) {
    throw new Error(`Erro ao buscar a lista de obras: ${resposta.status}`);
  }
  const dados = await resposta.json();
  const itens = dados.items || [];

  const promessasDeImagens = itens.map(obra => {
    if (!obra.document || obra.document_type !== 'attachment') {
      return Promise.resolve(null);
    }
    const mediaUrl = `${BASE_URL}/wp/v2/media/${obra.document}`;
    // Usamos .then() para tratar erros individuais sem quebrar a busca toda
    return fetch(mediaUrl).then(res => res.ok ? res.json() : null).catch(() => null);
  });

  const detalhesDasImagens = await Promise.all(promessasDeImagens);

  const obrasCompletas = itens.map((obra, index) => {
    return {
      id: obra.id,
      title: obra.title,
      imagemUrl: detalhesDasImagens[index]?.source_url || null,
    };
  });

  // Retornamos apenas as obras que, no final, conseguimos encontrar uma imagem.
  return obrasCompletas.filter(obra => obra.imagemUrl);
}

/**
 * Busca os detalhes de uma única obra pelo seu ID, implementando a mesma
 * lógica robusta para encontrar a imagem.
 */
export async function obterObraPorId(id) {
    const url = `${BASE_URL}/tainacan/v2/items/${id}`;
    const resp = await fetch(url, { next: { revalidate: 3600 } });
    if (!resp.ok) throw new Error("Erro ao buscar detalhes da obra");
    
    const dados = await resp.json();

    let imagemUrl = null;
    // Verifica se a obra tem um documento que é uma imagem anexa
    if (dados.document && dados.document_type === 'attachment') {
        const mediaUrl = `${BASE_URL}/wp/v2/media/${dados.document}`;
        const respMedia = await fetch(mediaUrl);
        if (respMedia.ok) {
            const dadosMedia = await respMedia.json();
            imagemUrl = dadosMedia.source_url;
        }
    }

    return {
        id: dados.id,
        title: dados.title,
        description: dados.description,
        imagemUrl: imagemUrl,
        // Pegando os metadados de forma segura, como sugerido pela orientadora
        artista: dados.metadata?.['5']?.value || 'Não informado',
        ano: dados.metadata?.['14']?.value || 'Não informado',
    };
}


/* const BASE_URL = "https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2";

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
*/
















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
