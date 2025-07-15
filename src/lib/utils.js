// Devuelve la fecha actual formateada en español
export function getCurrentDate() {
  const date = new Date();
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('es-ES', options);
}

// Transforma datos para los gráficos
export function transformData(data, label, fill) {
  return [
    {
      browser: label,
      visitors: data[label],
      fill: fill,
    },
  ];
}
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
