// Helpers generales para generación de PDFs

/**
 * Convierte un color HEX a objeto RGB.
 * @param {string} hex
 * @returns {{r:number,g:number,b:number}}
 */
export function hexToRgb(hex) {
  hex = hex.replace('#', '');
  if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
  const num = parseInt(hex, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

/**
 * Dibuja la sección de filtros aplicados en el PDF.
 * @param {jsPDF} doc
 * @param {Array} filtrosToShow
 * @param {number} total
 * @param {number} max
 * @param {number} startY
 * @param {function} hexToRgbImpl
 * @returns {number} Y final tras dibujar
 */
export function drawFiltrosSection(doc, filtrosToShow, total, max, startY, hexToRgbImpl) {
  if (!filtrosToShow.length) return startY;
  doc.setFontSize(12);
  doc.setTextColor(44, 4, 73);
  doc.text('Filtros aplicados', 10, startY);
  let y = startY + 8;
  doc.setFontSize(10);
  const boxW = 10, boxH = 7;
  filtrosToShow.forEach(f => {
    const boxX = 12;
    const boxY = y + 1;
    if (f.color) {
      const rgb = hexToRgbImpl(f.color);
      if (rgb) doc.setFillColor(rgb.r, rgb.g, rgb.b);
      else doc.setFillColor(200,200,200);
    } else {
      doc.setFillColor(200,200,200);
    }
    doc.roundedRect(boxX, boxY, boxW, boxH, 2, 2, 'F');
    doc.setTextColor(80, 80, 80);
    const text = `${f.label}: ${f.value}`;
    doc.text(text, boxX + boxW + 4, y + 6);
    y += boxH + 2;
  });
  if (total > max) {
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`...y ${total - max} más`, 12, y + 6);
    y += 9;
  }
  return y + 2;
}
