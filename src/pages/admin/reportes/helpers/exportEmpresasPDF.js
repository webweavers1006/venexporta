import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { getEmpresasExcelColumns } from './empresasExcelConfig';
import banner from '@assets/banner/banner.webp'; // Asegúrate de tener una imagen de banner

export const exportEmpresasToPDF = (data) => {
  if (!Array.isArray(data) || data.length === 0) return;
  // Cambiar orientación a landscape
  const doc = new jsPDF({ orientation: 'landscape', format: [356, 216] });
  // Definir anchos personalizados para rif y pais
  const customWidths = {
    rif: 28, // más angosto
    pais: 32, // más ancho
  };
  // Reordenar columnas para que 'país' esté antes de 'estado' y agregar dinámicas
  // Excluir 'created_user' (Fecha Creación) del PDF
  const columnsRaw = getEmpresasExcelColumns(data).filter(col => col.key !== 'created_user');
  const columns = [];
  for (let i = 0; i < columnsRaw.length; i++) {
    const col = columnsRaw[i];
    if (col.key === 'pais') {
      columns.push(col);
      // Buscar y agregar 'estado' justo después de 'pais' si viene después
      const estadoIdx = columnsRaw.findIndex(c => c.key === 'estado');
      if (estadoIdx > i) {
        columns.push(columnsRaw[estadoIdx]);
        i = estadoIdx; // saltar 'estado' en el siguiente ciclo
      }
    } else if (col.key !== 'estado') {
      columns.push(col);
    }
    // Si 'estado' ya fue agregado después de 'pais', se omite aquí
  }
  // Mapear a formato esperado por autoTable
  const columnsFinal = columns.map(col => ({
    header: col.header,
    dataKey: col.key,
    ...(customWidths[col.key] ? { cellWidth: customWidths[col.key] } : {})
  }));

  // Agregar imagen de encabezado ocupando todo el ancho
  const headerImg = banner;
  const pageWidth = doc.internal.pageSize.getWidth();
  // Altura del banner (ajusta según la proporción de tu imagen)
  const bannerHeight = 40; // Puedes ajustar este valor según tu imagen
  doc.addImage(headerImg, 'PNG', 0, 0, pageWidth, bannerHeight);

  // Mostrar total de empresas en una caja estilizada debajo del banner
  const totalEmpresas = data.length;
  const boxWidth = 65;
  const boxHeight = 14;
  const boxX = (pageWidth - boxWidth) / 2;
  const boxY = bannerHeight + 3;
  // Caja blanca con borde gris claro
  doc.setDrawColor(180, 180, 180);
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(boxX, boxY, boxWidth, boxHeight, 5, 5, 'FD');
  // Centramos verticalmente el texto y el número dentro de la caja
  // Altura de la caja: boxHeight
  // Altura aproximada de las fuentes (en puntos):
  const labelFontSize = 12;
  const numberFontSize = 15;
  // Aproximación: 1pt ≈ 1.33px, pero jsPDF usa pt para setFontSize y px para posiciones
  // Centramos usando la altura de la fuente y la caja
  doc.setFontSize(labelFontSize);
  doc.setTextColor(120, 120, 120);
  // Medimos la altura de la fuente (aprox)
  const labelTextHeight = labelFontSize * 0.35; // jsPDF: 1pt ≈ 0.35 px
  const labelY = boxY + (boxHeight / 2) + (labelTextHeight / 2) - 1;
  doc.text('Total de empresas:', boxX + 8, labelY);
  // Número en color destacado (morado)
  doc.setFontSize(numberFontSize);
  doc.setTextColor(44, 4, 73);
  const numberTextHeight = numberFontSize * 0.35;
  const numberY = boxY + (boxHeight / 2) + (numberTextHeight / 2) - 1;
  doc.text(String(totalEmpresas), boxX + boxWidth - 8, numberY, { align: 'right' });
  autoTable(doc, {
    startY: boxY + boxHeight + 4, // Bajar la tabla para que no tape la caja
    head: [columnsFinal.map(col => col.header)],
    body: data.map(row =>
      columnsFinal.map(col => {
        if (col.dataKey === 'direccion') {
          const val = row[col.dataKey];
          if (val === undefined || val === null || val === '') {
            return 'Sin Dirección';
          }
        }
        return row[col.dataKey] ?? '';
      })
    ),
    columnStyles: {
      rif: { cellWidth: customWidths.rif },
      pais: { cellWidth: customWidths.pais },
    },
    styles: { fontSize: 9, cellPadding: 2, lineWidth: 0, lineColor: [255, 255, 255] },
    headStyles: { fillColor: [44, 4, 73], textColor: 255, fontStyle: 'bold', lineWidth: 0, lineColor: [255, 255, 255] },
    margin: { left: 7, right: 7 },
  });
  doc.save('reporte_empresas.pdf');
};
