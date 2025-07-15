// chartPieHelpers.js
// Helpers para MoleculesChartPie: coloreado, orden y total

/**
 * Asigna colores a los datos si no tienen uno definido.
 * @param {Array} data - Datos originales.
 * @param {Array} colors - Paleta de colores.
 * @returns {Array} Datos con color asignado.
 */
export function assignColors(data, colors) {
  return data.map((item, idx) => ({
    ...item,
    fill: item.fill || colors[idx % colors.length],
  }));
}

/**
 * Ordena los datos de mayor a menor según valueKey.
 * @param {Array} data - Datos a ordenar.
 * @param {string} valueKey - Clave del valor numérico.
 * @returns {Array} Datos ordenados.
 */
export function sortDataDesc(data, valueKey) {
  return [...data].sort((a, b) => (b[valueKey] || 0) - (a[valueKey] || 0));
}

/**
 * Calcula el total sumando valueKey de todos los elementos.
 * @param {Array} data - Datos.
 * @param {string} valueKey - Clave del valor numérico.
 * @returns {number} Total.
 */
export function getTotal(data, valueKey) {
  return data.reduce((acc, item) => acc + (item[valueKey] || 0), 0);
}
