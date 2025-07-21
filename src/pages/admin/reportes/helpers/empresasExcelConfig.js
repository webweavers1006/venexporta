// Configuración y helpers para exportar a Excel desde ReportesDinamicos

// columns extra que pueden aparecer según los filtros
const extraColumns = [
  { header: 'Estado', key: 'estado' },
  { header: 'Municipio', key: 'municipio' },
  { header: 'Parroquia', key: 'parroquia' },
  { header: 'Evento', key: 'nombre_evento' },
  { header: 'Evento', key: 'nombre_evento' },
  { header: 'Actividad Económica', key: 'nombre_actividad_economica' },
  { header: 'Sector Productivo', key: 'nombre_sector_productivo' },
  { header: 'Sub Sector Productivo', key: 'nombre_sub_sector_productivo' },
  { header: 'Fecha Creación', key: 'created_user' },
];

/**
 * Retorna las columnas para exportar empresas, agregando dinámicamente las columnas extra si existen en los datos.
 * @param {Array<Object>} [data] - Array de objetos de empresas (opcional, pero necesario para columnas dinámicas)
 */
export const getEmpresasExcelColumns = (data = []) => {
  const baseColumns = [
    { header: 'Nombre Empresa', key: 'nombre_empresa' },
    { header: 'RIF', key: 'rif' },
    { header: 'Contacto', key: 'contacto_nombre' },
    { header: 'Correo Contacto', key: 'contacto_correo' },
    { header: 'Telefono Contacto', key: 'contacto_telefono' },
    { header: 'País', key: 'pais' },
    
  ];
  // Detectar si hay que agregar columnas extra
  let columns = [...baseColumns];
  if (Array.isArray(data) && data.length > 0) {
    extraColumns.forEach(col => {
      if (data.some(row => row[col.key] !== undefined)) {
        columns.push(col);
      }
    });
  }
  return columns;
};

export const styleEmpresasExcelHeader = (worksheet) => {
  worksheet.getRow(1).eachCell((cell) => {
    cell.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF2C0449' } // morado
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

export const styleEmpresasExcelRows = (worksheet) => {
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

export const autoWidthEmpresasExcelColumns = (worksheet, columns, data) => {
  worksheet.columns.forEach((col) => {
    let maxLength = col.header.length;
    data.forEach((item) => {
      const val = String(item[col.key] ?? "");
      if (val.length > maxLength) maxLength = val.length;
    });
    col.width = maxLength + 2;
  });
};
