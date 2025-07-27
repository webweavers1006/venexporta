// Configuración y estilos por defecto para PDFs
export const PDF_DEFAULTS = {
  page: { orientation: 'landscape', format: [356, 216] },
  table: {
    fontSize: 9,
    cellPadding: 2,
    lineWidth: 0,
    lineColor: [255,255,255]
  },
  head: {
    fillColor: [44, 4, 73],
    textColor: 255,
    fontStyle: 'bold',
    lineWidth: 0,
    lineColor: [255,255,255]
  },
  margin: { left: 7, right: 7 },
  totalBox: {
    width: 65,
    height: 14,
    radius: 5,
    labelFontSize: 12,
    numberFontSize: 15,
    labelColor: [120,120,120],
    numberColor: [44,4,73],
  },
  filtrosMax: 6,
};
