import * as React from 'react';
import { filterItems, paginate, buildPageList } from '@src/lib/companiesGrid';

/**
 * Hook reutilizable para filtrado + paginación híbrida (controlado / no-controlado)
 * @param {Object} params
 * @param {Array} params.items Lista completa
 * @param {number} params.pageSize Tamaño de página
 * @param {number} [params.page] Página controlada (opcional)
 * @param {(page:number)=>void} [params.onPageChange] Setter controlado (opcional)
 */
export function usePaginatedFilter({ items, pageSize, page, onPageChange }) {
  const isControlled = typeof page === 'number' && typeof onPageChange === 'function';
  const [internalPage, setInternalPage] = React.useState(1);
  const [query, setQuery] = React.useState('');

  // reset page when query changes (only uncontrolled)
  React.useEffect(() => { if (!isControlled) setInternalPage(1); }, [query, isControlled]);

  const activePage = isControlled ? page : internalPage;
  const filtered = React.useMemo(() => filterItems(items, query), [items, query]);
  const { total, totalPages, slice } = React.useMemo(
    () => paginate(filtered, activePage, pageSize),
    [filtered, activePage, pageSize]
  );
  const pages = React.useMemo(() => buildPageList(activePage, totalPages), [activePage, totalPages]);

  const changePage = React.useCallback((next) => {
    const bounded = Math.min(totalPages, Math.max(1, next));
    if (isControlled) onPageChange(bounded); else setInternalPage(bounded);
  }, [isControlled, onPageChange, totalPages]);

  return {
    query,
    setQuery,
    page: activePage,
    changePage,
    pages,
    filtered,
    currentItems: slice,
    total,
    totalPages,
    isControlled
  };
}
