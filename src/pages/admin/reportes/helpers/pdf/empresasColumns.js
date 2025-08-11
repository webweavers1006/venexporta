// Helper para construir columnas de empresas para PDF

/**
 * Construye las columnas para el PDF de empresas, usando columnas dinámicas si se proveen.
 * @param {Array} data - Datos a exportar
 * @param {Array} [columnasSeleccionadas] - Columnas seleccionadas dinámicamente (opcional)
 * @returns {{columnsFinal: Array, customWidths: Object}}
 */
export function buildEmpresasColumns(data, columnasSeleccionadas = []) {
  /**
   * Construye las columnas para el PDF de empresas usando solo columnas dinámicas seleccionadas.
   * @param {Array} data - Datos a exportar
   * @param {Array} columnasSeleccionadas - Columnas seleccionadas dinámicamente (requerido)
   * @returns {{columnsFinal: Array, customWidths: Object}}
   */
  const customWidths = { rif: 28, pais: 32 };
  // Usar solo columnas seleccionadas (checked) desde itemsForReports
  const columns = Array.isArray(columnasSeleccionadas) && columnasSeleccionadas.length > 0
    ? columnasSeleccionadas.map(item => ({
        header: item.label,
        key: item.id
      }))
    : [];
  return {
    columnsFinal: [
      { header: '#', dataKey: '__rowNum__', cellWidth: 12 },
      ...columns.map(col => ({
        header: col.header,
        dataKey: col.key,
        ...(customWidths[col.key] ? { cellWidth: customWidths[col.key] } : {})
      }))
    ],
    customWidths
  };
}
