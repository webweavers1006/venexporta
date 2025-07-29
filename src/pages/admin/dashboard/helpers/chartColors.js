// Helpers para colores y degradados de gráficos de torta

// Paleta base para actividades económicas
export const ACTIVIDAD_COLORS = [
  '#2563eb', // azul
  '#22c55e', // verde
  '#f59e42', // naranja
  '#eab308', // amarillo
  '#ef4444', // rojo
  '#a21caf', // morado
  '#0ea5e9', // celeste
  '#f43f5e', // rosado
  '#14b8a6', // turquesa
  '#f97316', // naranja oscuro
  '#64748b', // gris
  '#7c3aed', // violeta
  '#b91c1c', // rojo oscuro
  '#059669', // verde oscuro
  '#d97706', // mostaza
];

// Genera una paleta de degradados monocromáticos a partir de un color base
export function generateMonochromePalette(baseColor, count) {
  function shadeColor(color, percent) {
    let R = parseInt(color.substring(1,3),16);
    let G = parseInt(color.substring(3,5),16);
    let B = parseInt(color.substring(5,7),16);
    R = Math.min(255, Math.max(0, Math.floor(R * (1 + percent))));
    G = Math.min(255, Math.max(0, Math.floor(G * (1 + percent))));
    B = Math.min(255, Math.max(0, Math.floor(B * (1 + percent))));
    return `#${R.toString(16).padStart(2,'0')}${G.toString(16).padStart(2,'0')}${B.toString(16).padStart(2,'0')}`;
  }
  return Array.from({length: count}, (_, i) => {
    const percent = -0.2 + (i * (0.7/(count-1 || 1)));
    return shadeColor(baseColor, percent);
  });
}

// Mapea id de actividad a color
export function getActividadColorMap(actividades, colors = ACTIVIDAD_COLORS) {
  if (!Array.isArray(actividades)) return {};
  return actividades.filter(item => !!item.actividad_economica).reduce((acc, item, idx) => {
    acc[item.id_actividad_economica] = colors[idx % colors.length];
    return acc;
  }, {});
}

// Obtiene el color base de la actividad seleccionada
export function getSelectedActividadColor(selectedActividadId, actividadColorMap, fallback = ACTIVIDAD_COLORS[0]) {
  return selectedActividadId && actividadColorMap[selectedActividadId]
    ? actividadColorMap[selectedActividadId]
    : fallback;
}

// Obtiene la paleta de sectores según la actividad seleccionada
export function getSectoresPalette(sectores, selectedActividadId, selectedActividadColor) {
  if (!Array.isArray(sectores)) return [];
  const filtered = sectores.filter(item => item.sector_productivo && (!selectedActividadId || item.id_actividad_economica_sector === selectedActividadId));
  return generateMonochromePalette(selectedActividadColor, filtered.length);
}

// Obtiene la paleta de subsectores según el sector seleccionado
export function getSubSectoresPalette(subSectores, sectores, selectedActividadId, selectedSectorId, sectoresPalette) {
  if (!Array.isArray(subSectores) || !selectedSectorId) return [];
  const filteredSectores = sectores.filter(item => item.sector_productivo && (!selectedActividadId || item.id_actividad_economica_sector === selectedActividadId));
  const idx = filteredSectores.findIndex(item => item.id_sector_productivo === selectedSectorId);
  const baseColor = sectoresPalette[idx] || sectoresPalette[0] || ACTIVIDAD_COLORS[0];
  const filteredSub = subSectores.filter(item => item.sub_sector_productivo && selectedActividadId && item.id_sector_productivo_sub === selectedSectorId);
  return generateMonochromePalette(baseColor, filteredSub.length);
}
