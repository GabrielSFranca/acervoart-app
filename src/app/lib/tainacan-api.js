// src/app/lib/tainacan-api.js
export const UFSM_ACERV = "tainacan.ufsm.br/acervo-artistico";
const collection = 2174;
// const segundos=60, horasDia=24;

function normalizObr(itemObr) {
  const thumb = itemObr.thumbnail;
  return {
    id: itemObr.id,
    titulo: itemObr.title || 'notitle',
    imgSrc: thumb?.full?.[0] 
            || thumb?.medium?.[0] 
            || null,
    // artista: getArtist(obraItem),
    fullDataObra: itemObr,
  };
}

export async function getObras(perPage, page = 1) {
  const BASE_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/collection/${collection}/items?perpage=${perPage}&paged=${page}&fetch_only=id,title,thumbnail,metadata`;
  
  try {
    // fetch (url, options);
    const resposta = await fetch(BASE_URL, {
      cache: "force-cache",
      next: { revalidate: 60 * 60 *24 },
    });

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
    const resposta = await fetch(THUMB_URL, {
      cache: "force-cache",
      next: { revalidate: 60 * 60 *24 },
    });

    if (!resposta.ok) throw new Error("erro http" + resposta.status);

    const itemObra = await resposta.json();

    imagemThumb = itemObra.thumbnail?.full?.[0] || 
                  itemObra.thumbnail?.medium?.[0] || 
                  null;
  } catch (err) {
    console.error("erro ao buscar obra", err);
    //throw err
  }

  const META_BASE_URL = `https://${UFSM_ACERV}/wp-json/tainacan/v2/items/${id}`;
  try {
    const res = await fetch(META_BASE_URL, {
      cache: "force-cache",
      next: { revalidate: 60 * 60 *24 },
    });

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



