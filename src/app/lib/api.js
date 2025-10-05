// lib/api.js
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
