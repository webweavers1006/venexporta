import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';


import { getEmpresasExcelColumns, styleEmpresasExcelHeader, styleEmpresasExcelRows, autoWidthEmpresasExcelColumns } from './empresasExcelConfig';


/**
 * Exporta empresas a Excel, con título opcional y filename personalizado.
 * @param {Array} data - Datos a exportar
 * @param {string} [title] - Título opcional (aparece arriba y como filename)
 */
export const exportEmpresasToExcel = async (data, title) => {
  if (!Array.isArray(data) || data.length === 0) return;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Empresas');
  // Columnas dinámicas
  const columns = getEmpresasExcelColumns(data);
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
  worksheet.addRows(data, 'i');
  // Fila de total
  const totalRow = Array(columns.length).fill("");
  if (columns.length >= 2) {
    totalRow[columns.length - 2] = "TOTAL";
    totalRow[columns.length - 1] = data.length;
  }
  worksheet.addRow(totalRow);

  // Estilos: header y filas
  styleEmpresasExcelHeader(worksheet);
  styleEmpresasExcelRows(worksheet);

  // Ajustar header si hay título (header está en la fila 2)
  if (dataStartRow === 2) {
    // Mover estilos de header a la fila 2
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

  autoWidthEmpresasExcelColumns(worksheet, columns, data);
  const buffer = await workbook.xlsx.writeBuffer();
  // Nombre de archivo: si hay título, usarlo, si no, por defecto
  let fileName = 'reporte_empresas.xlsx';
  if (title && typeof title === 'string' && title.trim() !== '') {
    fileName = title.trim().replace(/\s+/g, '_').toLowerCase() + '.xlsx';
  }
  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), fileName);
};
