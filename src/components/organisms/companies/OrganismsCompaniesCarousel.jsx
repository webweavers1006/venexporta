import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { truncate } from "@/lib/companiesGrid";
import { usePaginatedFilter } from "@/hooks/usePaginatedFilter";
import DefaultItemCard from "@/components/atoms/DefaultItemCard";
import SkeletonCard from "@/components/atoms/SkeletonCard";
import Pagination from "@/components/molecules/Pagination";

// Imagen por defecto
const DEFAULT_IMAGE_URL = "https://via.placeholder.com/160x160?text=Sin+Logo";

/**
 * Grid de compañías (reemplazo del carrusel) optimizado para muchos elementos.
 * Diseño desacoplado y escalable.
 *\n
 * PATTERN: Componente híbrido controlado/no-controlado para paginación.
 * - Internamente maneja page si no se pasa prop page.
 * - Si se provee page y onPageChange => modo controlado.
 *
 * Arquitectura:
 * - Lógica de filtrado / paginación extraída a hook: usePaginatedFilter.
 * - Helpers puros (truncate, filterItems, paginate, buildPageList) en '@/lib/companiesGrid'.
 * - Subcomponentes memoizados (DefaultItemCard, SkeletonCard, Pagination) para reducir renders.
 * - Permite inyección de renderItem para total personalización sin forkar el componente.
 *\n
 * Props:
 * @param {Array<{id:string|number, nombre:string, url?:string}>} items Lista de compañías.
 * @param {(id:string|number, item:object)=>void} onItemClick Callback al hacer click.
 * @param {string} title Título principal.
 * @param {string} [subtitle] Subtítulo.
 * @param {number} [pageSize=24] Elementos por página.
 * @param {boolean} [searchable=true] Mostrar input de búsqueda.
 * @param {boolean} [showCount=true] Mostrar conteo (filtrados / total).
 * @param {number} [maxNameLength=48] Truncado del nombre (sólo para DefaultItemCard).
 * @param {() => void} [onViewAll] Callback botón Ver todas.
 * @param {string} [viewAllLabel="Ver todas"] Texto botón.
 * @param {string} [className] Clases extra contenedor.
 * @param {string} [itemClassName] Clases extra para card por defecto.
 * @param {boolean} [loading=false] Mostrar skeletons.
 * @param {number} [skeletonCount=12] Cantidad de skeletons mientras loading.
 * @param {React.ReactNode} [emptyContent] Contenido custom vacío.
 * @param {React.ReactNode} [noResultsContent] Contenido custom sin coincidencias.
 * @param {number} [page] Página (modo controlado).
 * @param {(nextPage:number)=>void} [onPageChange] Notificación cambio de página.
 * @param {(item:object)=>React.ReactNode} [renderItem] Render personalizado (sustituye DefaultItemCard).
 * @param {boolean} [sliderMode=true] Activa modo slider horizontal (si false => grid estático sin transform).
 * @param {boolean} [autoPlay=false] Avanza automáticamente entre páginas en sliderMode.
 * @param {number} [autoPlayInterval=5000] Intervalo en ms para auto-play.
 * @param {number} [swipeThreshold=60] Distancia mínima (px) para considerar un swipe.
 * @param {number} [showPaginationThreshold=pageSize] Mínimo de items para mostrar paginación/dots.
 * @param {string|number} [minItemWidth="180px"] Ancho mínimo deseado para auto-ajuste (CSS size).
 */

// ---------- Sub–componentes (memo) ----------
const CompaniesGrid = ({
  items = [],
  onItemClick = () => {},
  title = "Empresas",
  subtitle,
  pageSize = 24,
  searchable = true,
  showCount = true,
  maxNameLength = 48,
  onViewAll,
  viewAllLabel = "Ver todas",
  className,
  itemClassName,
  loading = false,
  skeletonCount = 12,
  emptyContent,
  noResultsContent,
  page: controlledPage,
  onPageChange,
  renderItem,
  sliderMode = true,
  autoPlay = false,
  autoPlayInterval = 5000,
  swipeThreshold = 60,
  showPaginationThreshold,
   minItemWidth = "180px",
}) => {
  const {
    query,
    setQuery,
    page,
    changePage,
    pages: pagesToRender,
    filtered,
    currentItems,
    totalPages,
  } = usePaginatedFilter({ items, pageSize, page: controlledPage, onPageChange });

  const paginationVisible = filtered.length > (showPaginationThreshold || pageSize);

  // ---- Auto-play ----
  React.useEffect(() => {
    if (!sliderMode || !autoPlay || totalPages <= 1) return;
    const id = setInterval(() => {
      changePage(page === totalPages ? 1 : page + 1);
    }, autoPlayInterval);
    return () => clearInterval(id);
  }, [autoPlay, autoPlayInterval, sliderMode, page, totalPages, changePage]);

  // ---- Swipe / Drag (touch + mouse) ----
  const startXRef = React.useRef(null);
  const draggingRef = React.useRef(false);

  const onPointerDown = (e) => {
    if (!sliderMode) return;
    startXRef.current = e.clientX || e.touches?.[0]?.clientX;
    draggingRef.current = true;
  };
  const onPointerUp = (e) => {
    if (!sliderMode || !draggingRef.current) return;
    const endX = e.clientX || e.changedTouches?.[0]?.clientX;
    const delta = endX - startXRef.current;
    if (Math.abs(delta) > swipeThreshold) {
      if (delta < 0 && page < totalPages) changePage(page + 1);
      else if (delta > 0 && page > 1) changePage(page - 1);
    }
    draggingRef.current = false;
  };
  const onPointerMove = (e) => {
    // futuro: podríamos mostrar desplazamiento parcial en drag
  };

  // ---- Altura animada contenedor ----
  const activePageRef = React.useRef(null);
  const [pageHeight, setPageHeight] = React.useState(null);
  React.useLayoutEffect(() => {
    if (activePageRef.current) {
      setPageHeight(activePageRef.current.getBoundingClientRect().height);
    }
  }, [page, currentItems.length, sliderMode]);

  return (
    <div className={cn("w-full", className)}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-[220px] flex-1">
          <h2 className="text-xl font-semibold tracking-tight text-zinc-900">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-zinc-600 leading-snug">{subtitle}</p>}
          {showCount && !loading && (
            <p className="mt-1 text-xs text-zinc-500">{filtered.length} de {items.length} resultados</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {searchable && (
            <div className="w-56">
              <Input
                placeholder="Buscar "
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
                className="h-9"
                aria-label="Buscar empresas"
              />
            </div>
          )}
          {onViewAll && items.length > 0 && (
            <button
              type="button"
              onClick={onViewAll}
              className="text-sm font-medium text-primary hover:underline"
            >{viewAllLabel}</button>
          )}
        </div>
      </div>
      {/* Contenido */}
      {loading ? (
        <div className="relative overflow-hidden" style={sliderMode ? { height: pageHeight || 'auto', transition: 'height 300ms ease' } : undefined}>
          <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${typeof minItemWidth === 'number' ? minItemWidth + 'px' : minItemWidth}, 1fr))` }}>
            {Array.from({ length: skeletonCount }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      ) : items.length === 0 ? (
        emptyContent || (
          <div className="rounded-lg border border-dashed p-8 text-center text-sm text-zinc-500 bg-zinc-50">
            No hay empresas registradas todavía.
          </div>
        )
      ) : filtered.length === 0 ? (
        noResultsContent || (
          <div className="rounded-lg border p-8 text-center text-sm text-zinc-500">
            No se encontraron resultados para "{query}".
          </div>
        )
      ) : (
        sliderMode ? (
          <div
            className="relative overflow-hidden select-none"
            onMouseDown={onPointerDown}
            onMouseUp={onPointerUp}
            onMouseMove={onPointerMove}
            onTouchStart={onPointerDown}
            onTouchEnd={onPointerUp}
            onTouchMove={onPointerMove}
            style={{ height: pageHeight || 'auto', transition: 'height 300ms ease' }}
          >
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${(page-1)*100}%)` }}
            >
              {Array.from({ length: totalPages }).map((_, pageIndex) => {
                const start = pageIndex * pageSize;
                const slice = filtered.slice(start, start + pageSize);
                const isActive = pageIndex + 1 === page;
                return (
                  <div
                    key={pageIndex}
                    ref={isActive ? activePageRef : null}
                    className="shrink-0 grow-0 basis-full px-0"
                    style={{ width: '100%' }}
                  >
                    <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${typeof minItemWidth === 'number' ? minItemWidth + 'px' : minItemWidth}, 1fr))` }}>
                      {slice.map(item => (
                        renderItem ? (
                          <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
                        ) : (
                          <DefaultItemCard
                            key={item.id}
                            item={item}
                            onClick={onItemClick}
                            itemClassName={itemClassName}
                            maxNameLength={maxNameLength}
                          />
                        )
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid gap-5" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${typeof minItemWidth === 'number' ? minItemWidth + 'px' : minItemWidth}, 1fr))` }}>
            {currentItems.map(item => (
              renderItem ? (
                <React.Fragment key={item.id}>{renderItem(item)}</React.Fragment>
              ) : (
                <DefaultItemCard
                  key={item.id}
                  item={item}
                  onClick={onItemClick}
                  itemClassName={itemClassName}
                  maxNameLength={maxNameLength}
                />
              )
            ))}
          </div>
        )
      )}
      {/* Paginación */}
      {!loading && paginationVisible && (
        <div>
          <Pagination
            page={page}
            totalPages={totalPages}
            pages={pagesToRender}
            changePage={changePage}
          />
          {sliderMode && (
            <div className="mt-4 flex justify-center gap-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => changePage(i+1)}
                  aria-label={`Ir a página ${i+1}`}
                  className={cn(
                    "h-2.5 w-2.5 rounded-full transition-colors",
                    i+1 === page ? "bg-primary" : "bg-zinc-300 hover:bg-zinc-400"
                  )}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/*
Migración desde el antiguo carrusel:
Antes:
  <CompaniesCarousel items={data} onItemClick={fn} title="Empresas" subtitle="Listado" />

Ahora (mismo import):
  <CompaniesGrid items={data} onItemClick={fn} title="Empresas" subtitle="Listado" />

Props eliminadas: ninguna crítica (se mantienen nombre de props principales)
Props nuevas útiles:
  pageSize          -> Ajusta cuántas tarjetas por página (default 24)
  searchable        -> true/false mostrar input de búsqueda
  showCount         -> Muestra el conteo filtrado/total
  sliderMode        -> Activa animación tipo slider
  autoPlay          -> Avance automático (slider)
  minItemWidth      -> Ancho mínimo para auto-fit responsive

Para paginación externa: pasar page + onPageChange.
*/

// Export legacy compatibility (mantiene imports existentes)
export { CompaniesGrid };
export default CompaniesGrid;
