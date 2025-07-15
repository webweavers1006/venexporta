// importaciones lazy dentro de las funciones
import { saveAs } from "file-saver";
import { getExcelColumns, styleExcelHeader, styleExcelRows, autoWidthExcelColumns } from "./excelExportConfig";

/**
 * Hook para exportar un área de un gráfico como imagen PNG o Excel.
 * @param {Object} params
 * @param {React.RefObject} exportRef - Ref del área a exportar como imagen.
 * @param {string} id - Identificador base para el archivo exportado.
 * @param {string} title - Título para la hoja de Excel.
 * @param {Array} data - Data a exportar en Excel.
 * @param {string} labelKey - Clave del label en la data.
 * @param {string} valueKey - Clave del valor en la data.
 * @returns {{ handleDownload: Function, handleExportExcel: Function, showExportTitle: Function }}
 */
export function useChartExport({ exportRef, id, title, data, labelKey, valueKey }) {
  // Mostrar/ocultar el título solo para exportación
  function showExportTitle(show) {
    const els = document.getElementsByClassName('only-export-title');
    for (const el of els) {
      el.style.display = show ? 'block' : 'none';
    }
  }

  // Exportar imagen PNG
  const handleDownload = async () => {
    if (!exportRef.current) return;
    showExportTitle(true);
    const { default: html2canvas } = await import("html2canvas-pro");
    const canvas = await html2canvas(exportRef.current, {
      backgroundColor: '#fff',
      useCORS: true
    });
    showExportTitle(false);
    const link = document.createElement("a");
    link.download = `${id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  // Exportar Excel
  const handleExportExcel = async () => {
    const { default: ExcelJS } = await import("exceljs");
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(title);
    worksheet.columns = getExcelColumns(labelKey, valueKey);
    data.forEach((item) => {
      worksheet.addRow({ [labelKey]: item[labelKey], [valueKey]: item[valueKey] });
    });
    styleExcelHeader(worksheet);
    styleExcelRows(worksheet);
    autoWidthExcelColumns(worksheet, worksheet.columns, data);
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `${id}.xlsx`);
  };

  return { handleDownload, handleExportExcel, showExportTitle };
}
