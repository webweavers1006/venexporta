// src/lib/data/estatusColors.js

// Paleta de colores para los estatus
const colorPalette = [
  { bg: 'bg-[#b6ffd0]', text: 'text-[#222]' }, // verde
  { bg: 'bg-[#ffcccc]', text: 'text-[#b91c1c]' }, // rojo
  { bg: 'bg-[#dbeafe]', text: 'text-[#2563eb]' }, // azul
  { bg: 'bg-gray-300', text: 'text-gray-700' }, // gris
  { bg: 'bg-yellow-100', text: 'text-yellow-800' }, // amarillo
  { bg: 'bg-purple-100', text: 'text-purple-800' }, // morado
  { bg: 'bg-pink-100', text: 'text-pink-800' }, // rosa
  { bg: 'bg-orange-100', text: 'text-orange-800' }, // naranja
];

// Función para mapear estatus a colores
export function getEstatusColors(estatusArray) {
  const estatusColors = {};
  estatusArray.forEach((estatus, idx) => {
    estatusColors[estatus] = colorPalette[idx % colorPalette.length];
  });
  return estatusColors;
}
