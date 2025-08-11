// Lazy load de ExcelJS y file-saver
import { getEmpresasExcelColumns, styleEmpresasExcelHeader, styleEmpresasExcelRows, autoWidthEmpresasExcelColumns } from './empresasExcelConfig';


/**
 * Exporta empresas a Excel, permitiendo columnas seleccionadas dinámicamente.
 * @param {Array} data - Datos a exportar
 * @param {Object} filtros - Filtros aplicados (opcional, para futuro uso)
 * @param {Object} config - Configuración de filtros (opcional, para futuro uso)
 * @param {Array} columnasSeleccionadas - Columnas seleccionadas dinámicamente (opcional)
 * @param {string} [title] - Título opcional (aparece arriba y como filename)
 */
export const exportEmpresasToExcel = async (data, filtros = null, config = null, columnasSeleccionadas = null, title) => {
  // Lazy load de dependencias
  const [{ default: ExcelJS }, { saveAs }] = await Promise.all([
    import('exceljs'),
    import('file-saver')
  ]);
  if (!Array.isArray(data) || data.length === 0) return;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Empresas');

  // Si se pasan columnas seleccionadas, construir columnas y filtrar datos
  let columns;
  let filteredData = data;
  if (Array.isArray(columnasSeleccionadas) && columnasSeleccionadas.length > 0) {
    columns = columnasSeleccionadas.map(item => ({
      header: item.label,
      key: item.id
    }));
    // Filtrar los datos para solo incluir las claves seleccionadas
    filteredData = data.map(row => {
      const filteredRow = {};
      columnasSeleccionadas.forEach(item => {
        filteredRow[item.id] = row[item.id];
      });
      return filteredRow;
    });
  } else {
    columns = []
  }
  worksheet.columns = columns;

  let dataStartRow = 1;
  // Si hay título, insertarlo en la primera fila, fusionando celdas
  if (title && typeof title === 'string' && title.trim() !== '') {
    worksheet.insertRow(1, [title]);
    worksheet.mergeCells(1, 1, 1, columns.length);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.font = { bold: true, size: 16, color: { argb: 'FF2C0449' } };
    titleCell.alignment = { vertical: 'middle', horizontal: 'center' };
    dataStartRow = 2;
  }

  // Agregar los datos a partir de la fila correspondiente
  worksheet.addRows(filteredData, 'i');
  // Fila de total
  const totalRow = Array(columns.length).fill("");
  if (columns.length >= 2) {
    totalRow[columns.length - 2] = "TOTAL";
    totalRow[columns.length - 1] = filteredData.length;
  }
  worksheet.addRow(totalRow);

  // Estilos: header y filas
  styleEmpresasExcelHeader(worksheet);
  styleEmpresasExcelRows(worksheet);

  // Ajustar header si hay título (header está en la fila 2)
  if (dataStartRow === 2) {
    worksheet.getRow(2).eachCell((cell) => {
      cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF2C0449' }
      };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
        right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      };
    });
  }

  // Estilo especial a la fila de total (última)
  const totalRowIdx = worksheet.rowCount;
  const totalRowObj = worksheet.getRow(totalRowIdx);
  totalRowObj.eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF787878' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    };
  });

  autoWidthEmpresasExcelColumns(worksheet, columns, filteredData);
  const buffer = await workbook.xlsx.writeBuffer();
  // Nombre de archivo: si hay título, usarlo, si no, por defecto
  let fileName = 'reporte_empresas.xlsx';
  if (title && typeof title === 'string' && title.trim() !== '') {
    fileName = title.trim().replace(/\s+/g, '_').toLowerCase() + '.xlsx';
  }
  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
};
