// Helpers puros para CompaniesGrid (pueden testearse de forma aislada)

/** Trunca un string agregando puntos suspensivos si excede max */
export function truncate(str = "", max = 48) {
  return str.length > max ? str.slice(0, max) + "…" : str;
}

/** Filtra items por nombre (case insensitive) */
export function filterItems(items, query) {
  if (!query || !query.trim()) return items;
  const q = query.toLowerCase();
  return items.filter(it => (it?.nombre || "").toLowerCase().includes(q));
}

/** Devuelve info de paginación y el slice correspondiente */
export function paginate(items, page, pageSize) {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(totalPages, Math.max(1, page));
  const start = (safePage - 1) * pageSize;
  return {
    total,
    totalPages,
    page: safePage,
    slice: items.slice(start, start + pageSize)
  };
}

/** Construye lista de páginas con elipses */
export function buildPageList(current, totalPages) {
  const pages = [];
  if (totalPages <= 7) {
    for (let i=1; i<=totalPages; i++) pages.push(i);
    return pages;
  }
  const add = (n) => { if (!pages.includes(n)) pages.push(n); };
  add(1);
  [current-1, current, current+1].forEach(p => { if (p>1 && p<totalPages) add(p); });
  add(totalPages);
  pages.sort((a,b)=>a-b);
  const out = [];
  for (let i=0;i<pages.length;i++) {
    out.push(pages[i]);
    if (i < pages.length-1 && pages[i+1]-pages[i] > 1) out.push('…');
  }
  return out;
}
