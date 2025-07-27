/**
 * Dado un objeto de filtros aplicados y la config de filtros,
 * retorna un array de { label, name, color, value } solo para los filtros activos y con color.
 * @param {Object} filtros - Objeto de filtros aplicados (key: value)
 * @param {Array} config - Configuración de filtros (array de grupos con fields)
 * @returns {Array<{label: string, name: string, color?: string, value: any}>}
 */
export function getFiltrosColors(filtros, config) {
  if (!filtros || !config) return [];
  const result = [];
  for (const group of config) {
    for (const field of group.fields) {
      const value = filtros[field.name];
      if (
        value !== undefined &&
        value !== null &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0)
      ) {
        result.push({
          label: field.label || field.name,
          name: field.name,
          color: field.color,
          value
        });
      }
    }
  }
  return result;
}
