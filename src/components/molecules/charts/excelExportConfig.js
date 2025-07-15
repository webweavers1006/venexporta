// Configuración y helpers para exportar a Excel desde MoleculesChartPie

export const getExcelColumns = (labelKey, valueKey) => ([
  { header: 'Subsector', key: labelKey },
  { header: 'Total', key: valueKey },
]);

export const styleExcelHeader = (worksheet) => {
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF364153' }
    };
    cell.alignment = { vertical: 'middle', horizontal: 'center' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      left: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      bottom: { style: 'thin', color: { argb: 'FFCCCCCC' } },
      right: { style: 'thin', color: { argb: 'FFCCCCCC' } },
    };
  });
};

export const styleExcelRows = (worksheet) => {
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return;
    row.eachCell((cell) => {
      cell.font = { size: 11 };
      cell.alignment = { vertical: 'middle', horizontal: 'center' };
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFEEEEEE' } },
        left: { style: 'thin', color: { argb: 'FFEEEEEE' } },
        bottom: { style: 'thin', color: { argb: 'FFEEEEEE' } },
        right: { style: 'thin', color: { argb: 'FFEEEEEE' } },
      };
    });
  });
};

export const autoWidthExcelColumns = (worksheet, columns, data) => {
  worksheet.columns.forEach((col) => {
    let maxLength = col.header.length;
    data.forEach((item) => {
      const val = String(item[col.key] ?? "");
      if (val.length > maxLength) maxLength = val.length;
    });
    col.width = maxLength + 2;
  });
};
