// Helper para construir columnas de empresas para PDF
import { getEmpresasExcelColumns } from '../empresasExcelConfig';

export function buildEmpresasColumns(data) {
  const customWidths = { rif: 28, pais: 32 };
  const columnsRaw = getEmpresasExcelColumns(data).filter(col => col.key !== 'created_user');
  const columns = [];
  for (let i = 0; i < columnsRaw.length; i++) {
    const col = columnsRaw[i];
    if (col.key === 'pais') {
      columns.push(col);
      const estadoIdx = columnsRaw.findIndex(c => c.key === 'estado');
      if (estadoIdx > i) {
        columns.push(columnsRaw[estadoIdx]);
        i = estadoIdx;
      }
    } else if (col.key !== 'estado') {
      columns.push(col);
    }
  }
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
