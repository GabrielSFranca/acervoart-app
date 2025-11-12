const TAINACAN_BASE='https://tainacan.ufsm.br/acervo-artistico/wp-json/tainacan/v2';

function itemUrl(id){
    return `${TAINACAN_BASE}/item/${id}`;
}

function collectionItemsUrl(collection = 2174, perpage = 30, page = 1) {
  return `${TAINCAN_BASE}/collection/${collection}/items?perpage=${perpage}&page=${page}`;
}


function normalizeAuthor(item) {
  // quick-access fields based on your JSON structure
  const meta = item.metadata || {};
  // example from your dump: metadata.taxonomia.value[0].name or metadata.taxonomia.value_as_string
  if (meta.taxonomia) {
    try {
      const t = meta.taxonomia;
      if (Array.isArray(t.value) && t.value.length) {
        const v0 = t.value[0];
        if (v0 && typeof v0 === 'object' && v0.name) return v0.name;
      }
      if (t.value_as_string) return t.value_as_string;
    } catch (e) {}
  }
  // fallback: common fields
  if (item.author_name) return item.author_name;
  if (item.authors && Array.isArray(item.authors) && item.authors.length) {
    const a0 = item.authors[0];
    if (typeof a0 === 'string') return a0;
    if (a0 && a0.name) return a0.name;
  }
  return null;
}


function normalizeDate(item){
    return item.creation_date;
}

function fetchImg(html){
    
}


async function itemToMinimal(item){
    const titulo=item.title;
    const artist=normalizeAuthor(item);
    const dataCriacao=normalizeDate(item);


}