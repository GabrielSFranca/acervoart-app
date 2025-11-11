export const UFSM_ACERV = "tainacan.ufsm.br/acervo-artistico";
const idCollection = 2174; //const perPage = 10;

function getAuthor(obraItem){

  const tax=obraItem?.metadata?.taxonomia;
    // 1️⃣ forma mais simples — campo padrão no acervo da UFSM
  const autor1=tax?.value_as_string;
  if (autor1 && autor1.trim()) return autor1.trim();

  // 2️⃣ alternativa — array de objetos dentro de metadata.taxonomia.value
  const autor2 = tax?.value?.[0]?.name;
  if (autor2 && autor2.trim()) return autor2.trim();
  
  return 'nao achou';
}

export function normalizeObra(obraItem) {
  const thumb = obraItem.thumbnail;
  return {
    id: obraItem.id,
    titulo: obraItem.title || "noTitlemsg",
    imgSrc: thumb?.medium?.[0] || null,
    artista: getAuthor(obraItem),
    fullDataObra: obraItem,
  };
}

export async function buscarObras(perPage) {
  const BASE_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/collection/${idCollection}/items?perpage=${perPage}&fetch_only=id,title,document,thumbnail,url`;
  try {
    const resposta = await fetch(BASE_URL);
    if (!resposta.ok) throw new Error("Erro HTTP " + resposta.status);
    
    const dados = await resposta.json();
    if (!dados.items) throw new Error("Nenhuma obra encontrada");

    console.log(dados.items.length + 'obras retornadas');
    
    return dados.items.map(normalizeObra);

    //console.log('obras formatadas', JSON.stringify(obrasFormatadas));

  } catch (erro) {
    console.error("Erro ao buscar obras:", erro);
    throw erro;
  }
}



export async function buscaObraPorId(id){
    // const id=obraItem.id;
    const BASE_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/items/${id}`;
    try {
      const resposta = await fetch(BASE_URL);
      if (!resposta.ok) throw new Error("Erro HTTP " + resposta.status);
    
      const dados = await resposta.json();
      //if (!dados.items) throw new Error("Nenhuma obra encontrada");

      //console.log(dados.items.length + 'obras retornadas');
    
      // dados.items.map(normalizeObra);
      return normalizeObra(dados);

    //console.log('obras formatadas', JSON.stringify(obrasFormatadas));

    } catch (erro) {
      console.error("Erro ao buscar obras:", erro);
      throw erro;
  }
}







// const BASE_URL = "https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2";

// export function extractImgUrl(htmlStr) {
//   if (!htmlStr) return null;
//   // Isso é uma Expressão Regular (Regex) que busca pelo padrão src="..."
//   //const regex = /src="([^"]+)"/;
//   // Regex mais robusta que funciona com aspas simples e duplas
//   const regex = /src=["']([^"']+)["']/i;
//   const match = htmlStr.match(regex);

//   if (match) return match[1];

//   return null;
//   //return match ? match[1] : null;
// }
// // EXTRAIR DO HTML COM REGEX SIMPLES
// //  static extractFromHtml(html) {
//     // Procura por src="URL" ou src='URL'
//   //  const regex = /src=["']([^"']+)["']/i;
//   //  const match = html.match(regex);
//   //  return match ? match[1] : null;
//  // }

// export async function obterObras(perpage = 5) {
//   console.log("🔍 Iniciando busca na API...");
//   const urlTainacan = `${BASE_URL}/collection/2174/items?perpage=${perpage}`;
//   //setCarregando(true);
//   const resposta = await fetch(urlTainacan);

//   if (!resposta.ok) { throw new Error(`Erro HTTP: ${resposta.status}`); }
//   const dados = await resposta.json();

//  // const obrasComImg = dados.items.map((obra) => ({
//    // ...obra, // Mantém todos os dados originais da obra
//    // urlimg: extractImgUrl(obra.document_as_html), // E adiciona a URL da imagem extraída
// //  }));

//   return dados.items.map(obra => ({
//     ...obra,
//     urlimg: extractImgUrl(obra.document_as_html)
//   }));
// }

// /*
// export const TAINCAN_BASE = 'https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2';
// export function itemUrl(id) {
//   return `${TAINCAN_BASE}/item/${id}`;
// }
// export function itemsListUrl({ collection = 2174, perpage = 30 } = {}) {
//   return `${TAINCAN_BASE}/collection/${collection}/items?perpage=${perpage}`;
// }
// export function exhibitionsUrl() {
//   // ajuste conforme API real das exposições; é um exemplo
//   return `${TAINCAN_BASE}/collection/EXPOSICOES/items?perpage=50`;
// }
// */
