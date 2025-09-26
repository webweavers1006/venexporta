import { jsPDF } from 'jspdf';
import { hexToRgb } from '@lib/data/pdf/pdfHelpers';
// import 'jspdf-autotable'; // Disponible si luego se quieren tablas/encabezados

/**
 * Genera y descarga un PDF con los QR visibles dentro de un contenedor.
 * No depende de componentes específicos, sólo de que existan <canvas> o <img> de los QR.
 *
 * @param {HTMLElement|null} listElement - Contenedor que incluye los QR (canvas o img).
 * @param {Array} items - Datos para etiquetar cada QR (mismo orden que los nodos renderizados).
 * @param {Object} options - Parámetros de maquetación.
 * @param {number} [options.margin=10] - Margen en mm.
 * @param {number} [options.gutter=6] - Espacio horizontal entre columnas en mm.
 * @param {number} [options.cols=3] - Columnas por página.
 * @param {number} [options.labelHeight=8] - Alto de la línea de etiqueta bajo el QR.
 * @param {string} [options.title='Códigos QR'] - Título del documento.
 * @param {string|number[]} [options.eventTitleColor="#6f0650"] - Color del título del evento (hex o [r,g,b]).
 * @param {string|number[]} [options.pageFormat='a4'] - Formato de página (ej. 'a4', 'letter' o [ancho,alto] en mm).
 * @param {('portrait'|'landscape')} [options.pageOrientation='portrait'] - Orientación de la página.
 * @returns {boolean} true si se generó y descargó, false en caso contrario.
 */
export async function generateQrPdf(listElement, items = [], options = {}) {
  try {
    if (!listElement) return false;

    const nodes = listElement.querySelectorAll('canvas, img, svg');
    let qrNodes = Array.from(nodes);
    // Permitir exportar un subconjunto por índice visual
    const selectedIndexes = Array.isArray(options.selectedIndexes) ? options.selectedIndexes.filter(n => Number.isInteger(n) && n >= 0) : null;
    if (selectedIndexes && selectedIndexes.length > 0) {
      qrNodes = selectedIndexes.map(i => qrNodes[i]).filter(Boolean);
      // Reordenar items al mismo subconjunto/orden
      items = selectedIndexes.map(i => items[i]).filter(Boolean);
    }
    if (!qrNodes.length) return false;

    const {
      margin = 15, // mm
      labelHeight = 10, // mm
      headerImageSrc, // ruta/URL de imagen para el encabezado
      headerImageDataUrl, // alternativa directa como dataURL
      headerMaxHeight = 25, // mm
      headerSpacing = 6, // mm debajo del encabezado
      title, // no se usa si hay imagen, queda por si se necesita
  // Control del tamaño del QR
  qrScale = 0.6, // factor para reducir el tamaño respecto al área disponible
  qrSide, // tamaño fijo del lado del QR en mm (opcional)
  qrMaxSide, // tope máximo del lado del QR en mm (opcional)
  minQrSide = 40, // tamaño mínimo del lado del QR en mm
  // Sección de evento (imagen + título)
  eventTitle, // string centrado bajo el banner
  eventImageSrc, // ruta/URL de imagen del evento
  eventImageDataUrl, // alternativa directa como dataURL
  eventImageMaxWidth = 40, // mm
  eventImageMaxHeight = 40, // mm
  eventImageCornerRadius = 6, // mm
  eventImageSpacing = 4, // mm entre imagen y título
  eventSectionSpacing = 6, // mm entre banner y la sección del evento
  eventTitleFontSize = 16, // pt
  eventImageMasked = false, // si true aplica máscara (squircle); por defecto sin redondeo
  eventTitleColor = '#6f0650', // color del título del evento
  pageFormat = 'a4',
  pageOrientation = 'portrait',
    } = options;

    // Nota: todas las medidas del layout están en mm, por eso mantenemos unit: 'mm'
    const doc = new jsPDF({ orientation: pageOrientation, unit: 'mm', format: pageFormat });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Cargar encabezado si se proporcionó
    let headerData = null;
    if (headerImageDataUrl) {
      headerData = { dataUrl: headerImageDataUrl, width: 0, height: 0 };
    } else if (headerImageSrc) {
      headerData = await loadImageAsDataURL(headerImageSrc);
    }

    // Cargar imagen del evento si se proporcionó
    let eventImgData = null;
    if (eventImageDataUrl) {
      eventImgData = { dataUrl: eventImageDataUrl, width: 0, height: 0 };
    } else if (eventImageSrc) {
      eventImgData = await loadImageAsDataURL(eventImageSrc);
    }

    const getDataUrlFromNode = async (el) => {
      const tag = el.tagName?.toLowerCase();
      try {
        if (tag === 'canvas') return el.toDataURL('image/png');
        if (tag === 'img') {
          if (el.src?.startsWith('data:')) return el.src;
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = el.naturalWidth || el.width || 256;
          tempCanvas.height = el.naturalHeight || el.height || 256;
          const ctx = tempCanvas.getContext('2d');
          if (ctx) ctx.drawImage(el, 0, 0, tempCanvas.width, tempCanvas.height);
          return tempCanvas.toDataURL('image/png');
        }
        if (tag === 'svg') {
          // Serializar SVG y rasterizarlo a PNG mediante un canvas temporal
          const serializer = new XMLSerializer();
          const svgString = serializer.serializeToString(el);
          const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          try {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            const dims = getSvgDimensions(el);
            await new Promise((resolve, reject) => {
              img.onload = resolve;
              img.onerror = reject;
              img.src = url;
            });
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = dims.width;
            tempCanvas.height = dims.height;
            const ctx = tempCanvas.getContext('2d');
            if (ctx) ctx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
            const data = tempCanvas.toDataURL('image/png');
            URL.revokeObjectURL(url);
            return data;
          } catch {
            URL.revokeObjectURL(url);
            return null;
          }
        }
      } catch {
        // Ignorar errores (CORS/canvas tainted)
      }
      return null;
    };

    for (let index = 0; index < qrNodes.length; index++) {
      const node = qrNodes[index];
      if (index > 0) doc.addPage();

      // Comenzar en top para permitir banner full-bleed
      let yCursor = 0;

      // Dibujar encabezado si existe
      if (headerData?.dataUrl) {
        try {
          // Ancho 100% sin márgenes, arriba del todo
          let drawWidth = pageWidth;
          let drawHeight = headerMaxHeight;
          if (headerData.width && headerData.height) {
            const ratio = headerData.height / headerData.width;
            drawHeight = Math.min(headerMaxHeight, drawWidth * ratio);
          }
          const x = 0;
          const y = 0;
          doc.addImage(headerData.dataUrl, 'PNG', x, y, drawWidth, drawHeight);
          yCursor += drawHeight + headerSpacing;
          // Sección del evento: título centrado (color y bold) y luego imagen centrada con máscara
          yCursor += eventSectionSpacing;
          if (eventTitle) {
            try { doc.setFontSize(eventTitleFontSize); } catch { /* ignore */ }
            try {
              let rgb = null;
              if (Array.isArray(eventTitleColor) && eventTitleColor.length >= 3) {
                rgb = { r: +eventTitleColor[0] || 0, g: +eventTitleColor[1] || 0, b: +eventTitleColor[2] || 0 };
              } else if (typeof eventTitleColor === 'string') {
                rgb = hexToRgb(eventTitleColor);
              }
              doc.setTextColor(rgb?.r ?? 111, rgb?.g ?? 6, rgb?.b ?? 80);
            } catch { /* ignore */ }
            try { doc.setFont(undefined, 'bold'); } catch { /* ignore */ }
            doc.text(String(eventTitle), pageWidth / 2, yCursor + 5, { align: 'center' });
            // Reset a valores por defecto para no afectar el resto del documento
            try { doc.setFont(undefined, 'normal'); } catch { /* ignore */ }
            try { doc.setTextColor(0, 0, 0); } catch { /* ignore */ }
            yCursor += 10; // espacio bajo título
          }
          if (eventImgData?.dataUrl) {
            const maxW = Math.min(eventImageMaxWidth, pageWidth - 2 * margin);
            let w = maxW, h = eventImageMaxHeight;
            if (eventImgData.width && eventImgData.height) {
              const ratio = eventImgData.height / eventImgData.width;
              h = Math.min(eventImageMaxHeight, w * ratio);
            }
            const imgX = (pageWidth - w) / 2;
            const imgY = yCursor + eventImageSpacing;
            try {
              if (eventImageMasked) {
                // Aplicar máscara tipo squircle vía canvas
                const outWpx = eventImgData.width || Math.round(w * 8);
                const outHpx = eventImgData.height || Math.round(h * 8);
                const pxPerMm = outWpx / Math.max(1, w);
                const radiusPx = Math.max(0, Math.round(eventImageCornerRadius * pxPerMm));
                const maskedData = await maskImageAsSquircle(eventImgData.dataUrl, outWpx, outHpx, { radiusPx });
                doc.addImage(maskedData || eventImgData.dataUrl, 'PNG', imgX, imgY, w, h);
              } else {
                // Sin máscara (sin redondeado)
                doc.addImage(eventImgData.dataUrl, 'PNG', imgX, imgY, w, h);
              }
            } catch {
              // Fallback directo
              doc.addImage(eventImgData.dataUrl, 'PNG', imgX, imgY, w, h);
            }
            yCursor = imgY + h;
          }
        } catch {
          // si falla, continuar sin encabezado
        }
      } else if (title) {
        doc.setFontSize(14);
        yCursor = margin;
        doc.text(String(title), margin, yCursor + 4);
        yCursor += 10;
      } else {
        // Sin encabezado ni título, empezar después del margen superior
        yCursor = margin;
      }

      // Área disponible para QR y etiqueta
      const availableHeight = pageHeight - yCursor - margin;
      const availableWidth = pageWidth - 2 * margin;
      const maxFittableSide = Math.min(availableWidth, Math.max(minQrSide, availableHeight - labelHeight - 4));
      let finalQrSide = maxFittableSide;
      if (typeof qrSide === 'number' && qrSide > 0) {
        finalQrSide = Math.min(maxFittableSide, qrSide);
      } else {
        finalQrSide = Math.max(minQrSide, maxFittableSide * (qrScale > 0 && qrScale <= 1 ? qrScale : 1));
        if (typeof qrMaxSide === 'number' && qrMaxSide > 0) {
          finalQrSide = Math.min(finalQrSide, qrMaxSide);
        }
      }
      const qrX = margin + (availableWidth - finalQrSide) / 2;
      const qrY = yCursor + (availableHeight - (finalQrSide + labelHeight)) / 2; // centro visual

  const dataUrl = await getDataUrlFromNode(node);
  if (dataUrl) {
        try {
      doc.addImage(dataUrl, 'PNG', qrX, qrY, finalQrSide, finalQrSide);
        } catch {
          // continuar con el siguiente
        }
      }

      // Etiqueta (si existe)
  const item = items[index];
      const label = item?.label || item?.name || item?.razon_social || item?.title || '';
      if (label) {
        doc.setFontSize(12);
        const textX = pageWidth / 2;
        const textY = qrY + finalQrSide + 8;
        doc.text(String(label), textX, textY, { align: 'center', maxWidth: availableWidth });
      }
  }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    doc.save(`codigos-qr-${timestamp}.pdf`);
    return true;
  } catch {
    return false;
  }
}

function getSvgDimensions(svgEl) {
  try {
    const vb = svgEl.viewBox && svgEl.viewBox.baseVal;
    if (vb) {
      return { width: Math.max(1, vb.width || 256), height: Math.max(1, vb.height || 256) };
    }
    const w = svgEl.width && (svgEl.width.baseVal?.value || parseFloat(svgEl.getAttribute('width')));
    const h = svgEl.height && (svgEl.height.baseVal?.value || parseFloat(svgEl.getAttribute('height')));
    if (w && h) return { width: Math.max(1, w), height: Math.max(1, h) };
  } catch { /* ignore */ }
  return { width: 256, height: 256 };
}

async function loadImageAsDataURL(src) {
  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
  const p = new Promise((resolve) => {
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve(null);
          ctx.drawImage(img, 0, 0);
          const dataUrl = canvas.toDataURL('image/png');
          resolve({ dataUrl, width: canvas.width, height: canvas.height });
  } catch {
          resolve(null);
        }
      };
      img.onerror = () => resolve(null);
    });
    img.src = src;
    return await p;
  } catch {
    return null;
  }
}

// Helpers para máscara squircle en imagen
async function maskImageAsSquircle(dataUrl, outW, outH, opts = {}) {
  try {
    const img = await loadImageElement(dataUrl);
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(outW || img.naturalWidth || img.width || 400));
    canvas.height = Math.max(1, Math.floor(outH || img.naturalHeight || img.height || 200));
    const ctx = canvas.getContext('2d');
    if (!ctx) return dataUrl;
    const r = Math.max(8, Math.min(Math.min(canvas.width, canvas.height) / 2, opts.radiusPx || 24));
    drawSuperRoundedRect(ctx, 0, 0, canvas.width, canvas.height, r);
    ctx.clip();
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/png');
  } catch {
    return dataUrl;
  }
}

function drawSuperRoundedRect(ctx, x, y, w, h, r) {
  const k = 0.5522847498;
  const rx = Math.min(r, w / 2), ry = Math.min(r, h / 2);
  const cx = rx * k, cy = ry * k;
  ctx.beginPath();
  ctx.moveTo(x + rx, y);
  ctx.lineTo(x + w - rx, y);
  ctx.bezierCurveTo(x + w - rx + cx, y, x + w, y + ry - cy, x + w, y + ry);
  ctx.lineTo(x + w, y + h - ry);
  ctx.bezierCurveTo(x + w, y + h - ry + cy, x + w - rx + cx, y + h, x + w - rx, y + h);
  ctx.lineTo(x + rx, y + h);
  ctx.bezierCurveTo(x + rx - cx, y + h, x, y + h - ry + cy, x, y + h - ry);
  ctx.lineTo(x, y + ry);
  ctx.bezierCurveTo(x, y + ry - cy, x + rx - cx, y, x + rx, y);
  ctx.closePath();
}

function loadImageElement(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
