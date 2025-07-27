// Helper reutilizable para obtener filtros legibles (label y valor) para PDF, Excel, etc.
// Requiere getFiltrosColors como dependencia externa.

/**
 * Obtiene los filtros legibles (label y valor) a partir de filtros y config.
 * @param {Object} filtros
 * @param {Array} config
 * @param {Function} getFiltrosColorsImpl - función para obtener los filtros activos (debe ser importada donde se use)
 * @param {number} maxFiltros
 * @returns {{ filtrosToShow: Array, total: number, max: number }}
 */
export function getReadableFilters(filtros, config, getFiltrosColorsImpl, maxFiltros = 6) {
  const filtrosArr = getFiltrosColorsImpl(filtros, config).map(f => {
    const group = config.find(g => g.fields.some(field => field.name === f.name));
    const field = group ? group.fields.find(field => field.name === f.name) : null;
    if (field && field.type === 'select' && Array.isArray(field.options)) {
      if (Array.isArray(f.value)) {
        const labels = f.value.map(val => {
          const opt = field.options.find(o => o.value === val);
          return opt ? String(opt.label).toUpperCase() : String(val).toUpperCase();
        });
        return { ...f, value: labels.join(', ') };
      } else {
        const opt = field.options.find(o => o.value === f.value);
        return { ...f, value: opt ? String(opt.label).toUpperCase() : String(f.value).toUpperCase() };
      }
    }
    // Para otros tipos, valor en mayúsculas si es string
    return { ...f, value: typeof f.value === 'string' ? f.value.toUpperCase() : f.value };
  });
  return {
    filtrosToShow: filtrosArr.slice(0, maxFiltros),
    total: filtrosArr.length,
    max: maxFiltros
  };
}
