import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';


import { PDF_DEFAULTS } from '@src/lib/data/pdf/pdfDefaults';
import { hexToRgb, drawFiltrosSection } from '@src/lib/data/pdf/pdfHelpers';
import { getReadableFilters } from '@src/lib/data/pdf/readableFilters';
import { buildEmpresasColumns } from './pdf/empresasColumns';
import { getFiltrosColors } from '../helpers/getFiltrosColors';

/**
 * Exporta datos tabulares a PDF de forma flexible y reutilizable.
 * @param {Object[]} data - Array de objetos a exportar.
 * @param {Object} options - Opciones de configuración.
 * @param {Array} options.columns - Columnas a mostrar [{header, dataKey, cellWidth?}].
 * @param {string|undefined} options.banner - Imagen (base64 o import) para el encabezado.
 * @param {string} [options.filename] - Nombre del archivo PDF.
 * @param {string} [options.totalLabel] - Texto para la caja de total.
 * @param {function} [options.getTotal] - Función para obtener el total (por defecto data.length).
 * @param {function} [options.formatCell] - Función para formatear celdas (row, col, idx) => valor.
 * @param {Object} [options.columnStyles] - Estilos de columnas para autoTable.
 * @param {Object} [options.tableStyles] - Estilos generales de autoTable.
 * @param {Object} [options.headStyles] - Estilos de cabecera de autoTable.
 * @param {Object} [options.margin] - Márgenes de autoTable.
 * @param {function} [options.getTotalRow] - Función para la fila de totales personalizada.
 * @param {Object} [options.filtros] - Objeto de filtros aplicados (opcional).
 * @param {string} [options.title] - Título para el PDF (aparece en la página y en el filename si no se especifica otro).
 */



export function exportTableToPDF(data, options = {}) {
  if (!Array.isArray(data) || data.length === 0) return;
  const {
    columns = [],
    banner,
    filename,
    totalLabel = 'Total de registros:',
    getTotal = d => d.length,
    formatCell,
    columnStyles = {},
    tableStyles = PDF_DEFAULTS.table,
    headStyles = PDF_DEFAULTS.head,
    margin = PDF_DEFAULTS.margin,
    getTotalRow,
    filtros = null,
    config = null,
    title = '',
  } = options;

  const doc = new jsPDF(PDF_DEFAULTS.page);
  const pageWidth = doc.internal.pageSize.getWidth();
  // Banner opcional
  let bannerHeight = 0;
  if (banner) {
    bannerHeight = 40;
    doc.addImage(banner, 'PNG', 0, 0, pageWidth, bannerHeight);
  }

  // Título visual (después del banner) solo si se pasa explícitamente
  // Se aumenta el espacio entre el banner y el título
  let titleY = bannerHeight + 20;
  if (title && typeof title === 'string' && title.trim() !== '') {
    doc.setFontSize(18);
    doc.setTextColor(44, 4, 73);
    doc.text(title, pageWidth / 2, titleY, { align: 'center' });
    titleY += 14;
  }

  // Filtros aplicados
  let filtrosY = titleY;
  if (filtros && config) {
    const { filtrosToShow, total, max } = getReadableFilters(filtros, config, getFiltrosColors, PDF_DEFAULTS.filtrosMax);
    filtrosY = drawFiltrosSection(doc, filtrosToShow, total, max, filtrosY, hexToRgb);
  }

  // (Caja de total eliminada por requerimiento)
  const total = typeof getTotal === 'function' ? getTotal(data) : data.length;
  const boxHeight = 0;
  const boxY = filtrosY;

  // Construcción de body
  const body = data.map((row, idx) =>
    columns.map(col => {
      if (typeof formatCell === 'function') return formatCell(row, col, idx);
      if (col.dataKey === '__rowNum__') return idx + 1;
      return row[col.dataKey] ?? '';
    })
  );
  // Fila de total
  let totalRow = [];
  if (typeof getTotalRow === 'function') {
    totalRow = getTotalRow({ columns, data, total });
  } else {
    for (let i = 0; i < columns.length; i++) {
      if (i === columns.length - 2) totalRow.push('TOTAL');
      else if (i === columns.length - 1) totalRow.push(total);
      else totalRow.push('');
    }
  }
  body.push(totalRow);

  autoTable(doc, {
    startY: boxY + 4,
    head: [columns.map(col => col.header)],
    body,
    columnStyles,
    styles: tableStyles,
    headStyles,
    margin,
    didParseCell: function (dataCell) {
      // Solo para la última fila (totales)
      if (
        dataCell.section === 'body' &&
        dataCell.row.index === body.length - 1
      ) {
        // Columna de 'TOTAL' (penúltima)
        if (dataCell.column.index === columns.length - 2) {
          dataCell.cell.styles.fillColor = [120, 120, 120]; // gris más claro
          dataCell.cell.styles.fontStyle = 'bold';
          dataCell.cell.styles.textColor = [255,255,255];
        }
        // Columna de total numérico (última)
        if (dataCell.column.index === columns.length - 1) {
          dataCell.cell.styles.fillColor = [150, 150, 150]; // gris medio
          dataCell.cell.styles.fontStyle = 'bold';
          dataCell.cell.styles.textColor = [255,255,255];
        }
      }
    },
  });
  // Título del documento (metadatos PDF) solo si se pasa explícitamente
  if (title && typeof title === 'string' && title.trim() !== '') {
    doc.setProperties({ title });
  }
  // Si no se pasa filename, usar el título para el nombre del archivo, si no, 'reporte_empresas.pdf'
  let fileToSave = filename;
  if (!fileToSave) {
    if (title && typeof title === 'string' && title.trim() !== '') {
      fileToSave = `${title.replace(/\s+/g, '_').toLowerCase()}.pdf`;
    } else {
      fileToSave = 'reporte_empresas.pdf';
    }
  }
  doc.save(fileToSave);
}


import banner from '@assets/banner/bannerGreen.webp';

export const exportEmpresasToPDF = (data, filtros = null, config = null, title) => {
  const { columnsFinal, customWidths } = buildEmpresasColumns(data);
  return exportTableToPDF(data, {
    columns: columnsFinal,
    banner,
    // filename se genera a partir del título si no se pasa explícito
    totalLabel: 'Total de empresas:',
    columnStyles: {
      rif: { cellWidth: customWidths.rif },
      pais: { cellWidth: customWidths.pais },
      __rowNum__: { cellWidth: 12, halign: 'center' },
    },
    formatCell: (row, col, idx) => {
      if (col.dataKey === '__rowNum__') return idx + 1;
      if (col.dataKey === 'direccion') {
        const val = row[col.dataKey];
        if (val === undefined || val === null || val === '') return 'Sin Dirección';
      }
      return row[col.dataKey] ?? '';
    },
    filtros,
    config,
    title,
  });
};
