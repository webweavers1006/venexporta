// Helpers relacionados con la generación de valores por defecto de filtros

/**
 * Construye un objeto de valores iniciales (defaultValues) a partir de la configuración de filtros.
 * Cada campo obtiene valor por defecto: cadena vacía.
 *
 * @param {Array<{ fields: Array<{ name: string }> }>} filterConfig
 * @returns {Record<string, string>}
 */
export function buildDefaultValues(filterConfig) {
  return filterConfig.reduce((acc, group) => {
    group.fields.forEach(({ name }) => {
      acc[name] = '';
    });
    return acc;
  }, {});
}
