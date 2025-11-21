// src/app/lib/tainacan-api.js
export const UFSM_ACERV = "tainacan.ufsm.br/acervo-artistico";
const collection = 2174;

function normalizObr(itemObr) {
  const thumb = obraItem.thumbnail;
  return {
    id: itemObr.id,
    titulo: itemObr.title || 'notitle',
    imgSrc: thumb?.medium?.[0] || null,
    // artista: getArtist(obraItem),
    fullDataObra: itemObr,
  };
}

export async function getObras(perPage, page = 1) {
  const BASE_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/collection/${collection}/items?perpage=${perPage}&paged=${page}&fetch_only=id,title,thumbnail,metadata`;
  
  try {
    const resposta = await fetch(BASE_URL);
    if (!resposta.ok) throw new Error("Erro HTTP " + resposta.status);

    const dados = await resposta.json();
    if (!dados.items) throw new Error("Nenhuma obra encontrada");

    console.log(dados.items.length + "obras retornadas");

    return dados.items.map(normalizObr);

    //console.log('obras formatadas', JSON.stringify(obrasFormatadas));
  } catch (erro) {
    console.error("Erro ao buscar obras:", erro);
    throw erro;
  }
}

export async function buscaObraPorId(id) {
  const THUMB_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/items/${id}?fetch_only=id,thumbnail`;
  let imagemThumb = null;
  try {
    const resposta = await fetch(THUMB_URL);

    if (!resposta.ok) throw new Error("erro http" + resposta.status);

    const itemObra = await resposta.json();
    // imagemThumb = itemObra.thumbnail?.medium?.[0] || null;
    imagemThumb = itemObra.thumbnail?.full?.[0] || 
                  itemObra.thumbnail?.medium?.[0] || 
                  null;
    // obraItem.thumbnail.medium?.[0] || obraItem.thumbnail.full?.[0]
  } catch (err) {
    console.error("erro ao buscar obra", err);
    //throw err
  }

  const META_BASE_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/items/${id}`;
  try {
    const res = await fetch(META_BASE_URL);

    if (!res.ok) throw new Error("erro http" + res.status);
    const item = await res.json();

    const metadados = item?.metadata;
    if (!metadados) return null;

    const getArtista = () => {
      const tax = metadados.taxonomia;
      // 1️⃣ forma mais simples — campo padrão no acervo da UFSM
      const autor1 = tax?.value_as_string;
      if (autor1 && autor1.trim()) return autor1.trim();

      // 2️⃣ alternativa — array de objetos dentro de metadata.taxonomia.value
      const autor2 = tax?.value?.[0]?.name;
      if (autor2 && autor2.trim()) return autor2.trim();
      return "noartist";
    };

    const getMetadados = (key) => {
      if (!metadados || !metadados[key]) {
        return "null";
      }
      // A API pode retornar 'value_as_string' ou 'value' direto
      return metadados[key].value_as_string || metadados[key].value || "null";
    };

    return {
      id: item.id,
      titulo: item.title || "notitle",
      imgSrc: imagemThumb,
      artista: getArtista(),
      datAno: getMetadados("data-da-obra-2"),
      tec: getMetadados("tecnica-3"),
      material: getMetadados("material"),
      dimensoes: getMetadados("dimensoes-com-emolduramento"),
      sup: getMetadados("suporte"),
      loc: getMetadados("localizacao"),
      serie: getMetadados("serie-2"),
      tema: getMetadados("tematica"),
      mold: getMetadados("moldura"),
      // Descrição (geralmente fora do metadata)
      // desc: obraItem.description || "no_description",
      url: item.url,
    };

  } catch (err) {
    console.error("erro ao buscar obra", err);
  }
}



// export const UFSM_ACERV = "tainacan.ufsm.br/acervo-artistico";
// const idCollection = 2174; //const perPage = 10;

// function getArtista(obraItem) {
//   const tax = obraItem?.metadata?.taxonomia;
//   // 1️⃣ forma mais simples — campo padrão no acervo da UFSM
//   const autor1 = tax?.value_as_string;
//   if (autor1 && autor1.trim()) return autor1.trim();

//   // 2️⃣ alternativa — array de objetos dentro de metadata.taxonomia.value
//   const autor2 = tax?.value?.[0]?.name;
//   if (autor2 && autor2.trim()) return autor2.trim();
//   return "Desconhecido";
// }

// // new
// // function getArtist(obraItem) {
// //   // 1. Tenta buscar em taxonomias (comum em museus)
// //   if (obraItem.metadata && obraItem.metadata.taxonomia) {
// //     // Às vezes é um array de objetos, às vezes string direta dependendo da config
// //     const tax = obraItem.metadata.taxonomia;
// //     if (Array.isArray(tax.value) && tax.value.length > 0) {
// //       return tax.value.map(t => t.name).join(", ");
// //     }
// //     if (tax.value_as_string) return tax.value_as_string;
// //   }
// //   // 2. Se não achar, procure um metadado específico se houver ID no MAPA
// //   // return getMetaValue('artista');
// //   return "Artista Desconhecido";
// // }

// function getMeta(obra, key) {
//   // obra full data?
//   return (
//     obra?.fullDataObra?.metadata?.[key]?.value_as_string ||
//     obra?.fullDataObra?.metadata?.[key]?.value ||
//     ""
//   );
// }

// export function normalizeObra(obraItem) {
//   const thumb = obraItem.thumbnail;
//   return {
//     id: obraItem.id,
//     titulo: obraItem.title || "noTitlemsg",
//     imgSrc: thumb?.medium?.[0] || null,
//     // artista: getArtist(obraItem),
//     fullDataObra: obraItem,
//   };
// }

// function normalizeDetailObr(obraItem) {
//   if (!obraItem) return null;

//   const thumb = obraItem.thumbnail;
//   // const thumb=obraItem.thumbnail;
//   // let imagem=null;
//   // if(thumb){
//   //   imagem = thumb.full?.[0] || thumb.medium?.[0] || null;
//   // }

//   // const getImagem = () => {
//   //   let imgSrc = null;
//   //   const thumb = obraItem.thumbnail;
//   //   if (!thumb) {
//   //     return null;
//   //   } else {
//   //     imgSrc = thumb?.full?.[0] || thumb?.medium?.[0] || null;
//   //   }
//   //   return imgSrc;
//   //   // const thumb=obraItem.thumbnail
//   //   // let imgSrc=null
//   // }

//   const getMetadados = (key) => {
//     const meta = obraItem.metadata;

//     if (!meta || !meta[key]) {
//       return "null";
//     }
//     // A API pode retornar 'value_as_string' ou 'value' direto
//     return meta[key].value_as_string || meta[key].value || "null";
//   };

//   return {
//     id: obraItem.id,
//     titulo: obraItem.title || 'notitmsg',
//     imgSrc: thumb?.full?.[0] || null,
//     artista: getArtista(obraItem),
//     dataAno: getMetadados('data-da-obra-2'),
//     tec: getMetadados('tecnica-3'),
//     material: getMetadados('material'),
//     dimensoes: getMetadados('dimensoes-com-emolduramento'),
//     sup: getMetadados('suporte'),
//     loc: getMetadados('localizacao'),
//     serie: getMetadados('serie-2'),
//     tema: getMetadados('tematica'),
//     mold: getMetadados('moldura'), 
//     // Descrição (geralmente fora do metadata)
//     desc: obraItem.description || 'no_description',
//     url: obraItem.url,
//   };
// }

// // const META_KEYS = {
// //   DATA: "data-da-obra-2",
// //   TECNICA: "tecnica-3",
// //   DIMENSOES: "dimensoes-com-emolduramento",
// //   LOCALIZACAO: "localizacao",
// //   AUTOR: "taxonomia", // O autor vem dentro desta taxonomia
// //   MATERIAL: "material",
// //   SUPORTE: "suporte",
// // };

// export function normalizaObraDetalhe(obraItem) {

//   const thumb = obraItem.thumbnail;
//   return {
//     id: obraItem.id,
//     titulo: obraItem.title || "noTitlemsg",
//     imgSrc: thumb?.full?.[0] || null,
//     artista: getArtist(obraItem),
//     ano: getMeta(obraItem, "data-da-obra-2"),
//     dimensoes: getMeta(obraItem, "dimensoes-com-emolduramento"),
//     tecnica: getMeta(obraItem, "tecnica-3"),
//     material: getMeta(obraItem, "material"),
//     suport: getMeta(obraItem, "suporte"),
//     serie: getMeta(obraItem, "serie-2"),
//     tema: getMeta(obraItem, "tematica"),
//     mold: getMeta(obraItem, "moldura"),
//     loc: getMeta(obraItem, "localizacao"),
//     georef: getMeta(obraItem, "georeferenciamento"),
//     crdft: getMeta(obraItem, "creditos-da-fotografia"),
//     criadorRegistro: getMeta(obraItem, "autora-do-registro-2"),
//     desc: obraItem.description || "sem desc",
//     url: obraItem.url,
//     fullDataObra: obraItem,
//   };
// }

// export async function buscarObras(perPage, page = 1) {
//   const BASE_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/collection/${idCollection}/items?perpage=${perPage}&paged=${page}&fetch_only=id,title,thumbnail,metadata`;
//   try {
//     const resposta = await fetch(BASE_URL);
//     if (!resposta.ok) throw new Error("Erro HTTP " + resposta.status);

//     const dados = await resposta.json();
//     if (!dados.items) throw new Error("Nenhuma obra encontrada");

//     console.log(dados.items.length + "obras retornadas");

//     return dados.items.map(normalizeObra);

//     //console.log('obras formatadas', JSON.stringify(obrasFormatadas));
//   } catch (erro) {
//     console.error("Erro ao buscar obras:", erro);
//     throw erro;
//   }
// }

// export async function buscaObraPorId(id) {
//   //const BASE_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/items/${id}?fetch_only=id,title,thumbnail,metadata,description,url,document_as_html`;

//   // nova url
//   // Removemos 'fetch_only' para garantir que venha tudo. 
//   // O volume de dados de uma única obra é pequeno, não impacta performance.
//   const TAINACAN_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/items/${id}`;

//   try {
//     const resposta = await fetch(TAINACAN_URL, { cache: "no-store" }); // evita cache velho
//     if (!resposta.ok) throw new Error("Erro HTTP " + resposta.status);

//     const dados = await resposta.json();

//     // return normalizaObraDetalhe(dados);
//     return normalizeDetailObr(dados);
//   } catch (erro) {
//     console.error("Erro ao buscar obras:", erro);
//     throw erro;
//   }
// }

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





// export const UFSM_ACERV = "tainacan.ufsm.br/acervo-artistico";
// const API_BASE = "https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2";
// const COLLECTION_ID = 2174;

// /**
//  * Mapeamento dos Slugs de Metadados (Baseado no api-tainacan.json)
//  * Estas chaves são as que a API realmente retorna.
//  */
// const META_KEYS = {
//   DATA: 'data-da-obra-2',
//   TECNICA: 'tecnica-3',
//   DIMENSOES: 'dimensoes-com-emolduramento',
//   LOCALIZACAO: 'localizacao',
//   AUTOR: 'taxonomia', // O autor vem dentro desta taxonomia
//   MATERIAL: 'material',
//   SUPORTE: 'suporte'
// };

// /**
//  * Busca uma obra específica pelo ID (Sem filtros para garantir dados completos)
//  */
// export async function buscaObraPorId(id) {
//   try {
//     // Removemos 'fetch_only' para garantir que venha tudo.
//     // O volume de dados de uma única obra é pequeno, não impacta performance.
//     const url = `${API_BASE}/items/${id}`;
//     console.log("📡 Buscando detalhes da obra:", url);

//     const res = await fetch(url, { cache: 'no-store' }); // no-store evita cache velho

//     if (!res.ok) {
//       console.error(`Erro HTTP ${res.status} ao buscar obra ${id}`);
//       return null;
//     }

//     const dados = await res.json();
//     return normalizaObraDetalhe(dados);

//   } catch (error) {
//     console.error("❌ Erro fatal na requisição:", error);
//     return null;
//   }
// }

// /**
//  * Busca lista de obras (Para a galeria)
//  */
// export async function buscarObras(perPage = 20, page = 1) {
//   try {
//     // Aqui usamos fetch_only para economizar banda na listagem, mas incluímos 'metadata'
//     const campos = 'id,title,thumbnail,metadata,document_as_html';
//     const url = `${API_BASE}/collection/${COLLECTION_ID}/items?perpage=${perPage}&paged=${page}&fetch_only=${campos}`;

//     const res = await fetch(url);
//     if (!res.ok) throw new Error(`Erro HTTP ${res.status}`);

//     const json = await res.json();
//     // O Tainacan retorna { items: [...] } ou apenas [...] dependendo do endpoint
//     const items = json.items || json;

//     if (!Array.isArray(items)) return [];

//     return items.map(normalizaObraDetalhe);

//   } catch (error) {
//     console.error("Erro ao listar obras:", error);
//     return [];
//   }
// }

// /**
//  * Normaliza o objeto da API para o formato simples da aplicação
//  */
// export function normalizaObraDetalhe(obraItem) {
//   if (!obraItem) return null;

//   // 1. Tratamento de Imagem
//   let img = null;
//   // Tenta thumbnail médio ou grande
//   if (obraItem.thumbnail) {
//     img = obraItem.thumbnail.medium_large?.[0] || obraItem.thumbnail.medium?.[0] || obraItem.thumbnail.full?.[0];
//   }
//   // Se falhar, tenta extrair do HTML (fallback robusto)
//   if (!img && obraItem.document_as_html) {
//     img = extractImgUrl(obraItem.document_as_html);
//   }

//   // 2. Extração segura de metadados
//   const getMeta = (key) => {
//     if (!obraItem.metadata || !obraItem.metadata[key]) return "";
//     // A API pode retornar 'value_as_string' ou 'value' direto
//     return obraItem.metadata[key].value_as_string || obraItem.metadata[key].value || "";
//   };

//   // 3. Tratamento especial para Autor (Taxonomia)
//   const getAutor = () => {
//     const tax = obraItem.metadata?.[META_KEYS.AUTOR];
//     if (!tax) return "Autor Desconhecido";

//     // Se já vier como string formatada
//     if (tax.value_as_string) return tax.value_as_string;

//     // Se vier como array de objetos (comum em taxonomias)
//     if (Array.isArray(tax.value)) {
//       return tax.value.map(t => t.name).join(", ");
//     }

//     return "Autor Desconhecido";
//   };

//   return {
//     id: obraItem.id,
//     titulo: obraItem.title || "Sem Título",
//     imgSrc: img, // Se null, o componente de UI deve mostrar o placeholder

//     // Campos normalizados
//     artista: getAutor(),
//     dataAno: getMeta(META_KEYS.DATA),
//     tecnica: getMeta(META_KEYS.TECNICA),
//     dimensoes: getMeta(META_KEYS.DIMENSOES),
//     material: getMeta(META_KEYS.MATERIAL),
//     sup: getMeta(META_KEYS.SUPORTE),
//     localizacao: getMeta(META_KEYS.LOCALIZACAO),

//     // Descrição (geralmente fora do metadata)
//     desc: obraItem.description || ""
//   };
// }

// // Helper regex para extrair imagem
// function extractImgUrl(html) {
//   if (!html) return null;
//   const regex = /src=["']([^"']+)["']/i;
//   const match = html.match(regex);
//   return match ? match[1] : null;
// }

// // Export alias
// export const normalizeObra = normalizaObraDetalhe;

// export const UFSM_ACERV = "tainacan.ufsm.br/acervo-artistico";
// // URL base para a API v2 (Coleção 2174 é o Acervo Artístico principal)
// const API_BASE = "https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2";

// // Mapeamento dos IDs descobertos no arquivo api-tainacan.json
// const metadados = {
//   artist: 2192,
//   dimens: 2203,
//   ano: 2208,
//   tec: 2198,
// };

// /**
//  * Busca uma obra específica pelo ID (Usado na página de detalhes)
//  */
// export async function buscaObraPorId(id) {
//   try {
//     // Busca o item específico. Isso retorna o objeto completo com metadados
//     const res = await fetch(`${API_BASE}/items/${id}`);

//     if (!res.ok) {
//       console.error(`Erro ao buscar obra ${id}: ${res.status}`);
//       return null;
//     }

//     const dados = await res.json();
//     return normalizaObraDetalhe(dados);

//   } catch (error) {
//     console.error("Erro na requisição Tainacan:", error);
//     return null;
//   }
// }

// /**
//  * Normaliza o objeto cru da API para o formato simples usado no Page.js
//  */
// export function normalizaObraDetalhe(obraItem) {
//   if (!obraItem) return null;

//   // 1. Tratamento da Imagem
//   // Tenta pegar a imagem média, grande, ou extrair do HTML se não houver thumbnail
//   let img = "/placeholder-image.jpg"; // Imagem padrão

//   if (obraItem.thumbnail) {
//       img = obraItem.thumbnail.large?.[0] || obraItem.thumbnail.medium?.[0] || img;
//   } else if (obraItem.document_as_html) {
//       img = extractImgUrl(obraItem.document_as_html) || img;
//   }

//   // 2. Função auxiliar para pegar valor do metadado pelo ID
//   const getMetaValue = (id) => {
//     if (obraItem.metadata && obraItem.metadata[id]) {
//       // O Tainacan pode retornar 'value_as_string' (formatado) ou 'value' (cru)
//       return obraItem.metadata[id].value_as_string || obraItem.metadata[id].value || "Não informado";
//     }
//     return "";
//   };

//   return {
//     id: obraItem.id,
//     titulo: obraItem.title || "Sem Título",
//     imgSrc: img,

//     // --- AQUI ESTAVA O PROBLEMA: Agora usamos os IDs corretos ---
//     artista: getMetaValue(metadados.artist) || "Artista Desconhecido",
//     dimensoes: getMetaValue(metadados.dimens),
//     ano: getMetaValue(metadados.ano),
//     tecnica: getMetaValue(metadados.tec),

//     // A descrição geralmente fica na raiz do objeto, não nos metadados numéricos
//     desc: obraItem.description || obraItem.content || "Sem descrição disponível.",

//     // Mantemos o objeto original caso precise debugar
//     fullDataObra: obraItem,
//   };
// }

// /**
//  * Extrai URL de imagem de string HTML (fallback)
//  */
// function extractImgUrl(html) {
//   if (!html) return null;
//   const regex = /src=["']([^"']+)["']/i;
//   const match = html.match(regex);
//   return match ? match[1] : null;
// }

// // Mantido para compatibilidade se você usar em listagens
// export function normalizeObra(obraItem) {
//   return normalizaObraDetalhe(obraItem);
// }

// src/app/lib/tainacan-api.js

// export const UFSM_ACERV = "tainacan.ufsm.br/acervo-artistico";
// // Base da API v2
// const API_BASE = "https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2";

// /**
//  * IDs dos Metadados do Tainacan (CRUCIAL: Verifique no console do navegador os IDs corretos)
//  * O Tainacan retorna metadata: { "45": { value: "1990" }, ... }
//  * Você precisa descobrir qual número corresponde a qual campo.
//  */
// const MAPA_METADADOS = {
//   // Exemplo: Se no console aparecer "56": { name: "Dimensões", value: "30x40" }
//   // Então altere abaixo para dimensoes: 56
//   dimensoes: '12334',
//   ano: '2187',
//   tecnica: '4827',
//   localizacao: '2285'
// };

// /**
//  * Busca uma obra específica pelo ID (Usado na página de detalhes)
//  */
// export async function buscaObraPorId(id) {
//   try {
//     // O endpoint /items/{id} retorna todos os metadados completos
//     const res = await fetch(`${API_BASE}/items/${id}`);

//     if (!res.ok) {
//       // Se falhar, tenta buscar como post do WP (fallback)
//       console.error(`Erro ao buscar obra ${id}: ${res.status}`);
//       return null;
//     }

//     const dados = await res.json();
//     return normalizaObraDetalhe(dados);

//   } catch (error) {
//     console.error("Erro na requisição Tainacan:", error);
//     return null;
//   }
// }

// /**
//  * Normaliza o objeto cru da API para o formato simples usado no Page.js
//  */
// export function normalizaObraDetalhe(obraItem) {
//   if (!obraItem) return null;

//   // --- ÁREA DE DEPURAÇÃO ---
//   // Abra o console do navegador (F12) ao entrar na página da obra.
//   // Procure por este log para descobrir os IDs reais dos metadados.
//   console.log(`🔍 Metadados da Obra ${obraItem.title?.rendered}:`, obraItem.metadata);
//   // -------------------------

//   const imgSrc=obraItem.document_as_html ? obraItem.thumbnail?.medium[0] : obraItem.thumbnail?.full[0];

//   const img = obraItem.thumbnail?.full?.[0] || obraItem.thumbnail?.medium?.[0];
// //   // Tenta pegar a imagem média ou grande, ou null
// //   const img = obraItem.document_as_html
// //     ? extractImgUrl(obraItem.document_as_html) // Tenta extrair do HTML se thumbnail for falha
// //     : (obraItem.thumbnail?.medium?.[0] || obraItem.thumbnail?.full?.[0]);

//   // Helper para buscar metadado por ID configurado ou tentar achar por nome (slug)
//   const getMetaValue = (keyMap) => {
//     const id = MAPA_METADADOS[keyMap];
//     if (obraItem.metadata && obraItem.metadata[id]) {
//       return obraItem.metadata[id].value_as_string || obraItem.metadata[id].value;
//     }
//     return "Não informado";
//   };

//   return {
//     id: obraItem.id,
//     titulo: obraItem.title || "Sem Título",
//     imgSrc: imgSrc || "notimag", // Adicione uma imagem padrão em public se quiser

//     // Tenta pegar o artista da taxonomia ou metadado
//     artista: getArtist(obraItem),

//     // Mapeamento dos campos específicos
//     dimensoes: getMetaValue('dimensoes'),
//     ano: getMetaValue('ano'),

//     // Descrição geralmente fica no 'content' ou 'description' raiz do WP/Tainacan
//     desc: obraItem.content?.rendered || obraItem.description || "Sem descrição",

//     fullDataObra: obraItem, // Mantém o original se precisar debugar mais
//   };
// }

// // --- Funções Auxiliares ---

// function getArtist(obraItem) {
//   // 1. Tenta buscar em taxonomias (comum em museus)
//   if (obraItem.metadata && obraItem.metadata.taxonomia) {
//     // Às vezes é um array de objetos, às vezes string direta dependendo da config
//     const tax = obraItem.metadata.taxonomia;
//     if (Array.isArray(tax.value) && tax.value.length > 0) {
//       return tax.value.map(t => t.name).join(", ");
//     }
//     if (tax.value_as_string) return tax.value_as_string;
//   }
//   // 2. Se não achar, procure um metadado específico se houver ID no MAPA
//   // return getMetaValue('artista');
//   return "Artista Desconhecido";
// }

// function extractImgUrl(html) {
//   if (!html) return null;
//   const regex = /src=["']([^"']+)["']/i;
//   const match = html.match(regex);
//   return match ? match[1] : null;
// }

// // Função de lista (mantida para compatibilidade se usada em outras páginas)
// export function normalizeObra(obraItem) {
//   return normalizaObraDetalhe(obraItem);
// }
