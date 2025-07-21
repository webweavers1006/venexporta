import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { getEmpresasExcelColumns, styleEmpresasExcelHeader, styleEmpresasExcelRows, autoWidthEmpresasExcelColumns } from './empresasExcelConfig';

export const exportEmpresasToExcel = async (data) => {
  if (!Array.isArray(data) || data.length === 0) return;
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Empresas');
  // Pasar los datos a getEmpresasExcelColumns para columnas dinámicas
  const columns = getEmpresasExcelColumns(data);
  worksheet.columns = columns;
  worksheet.addRows(data);
  styleEmpresasExcelHeader(worksheet);
  styleEmpresasExcelRows(worksheet);
  autoWidthEmpresasExcelColumns(worksheet, columns, data);
  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'reporte_empresas.xlsx');
};
