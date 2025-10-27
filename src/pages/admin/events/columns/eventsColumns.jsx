// Definición sencilla de columnas para la tabla de eventos
// Exporta tanto la configuración de cabeceras (labels) como una función
// para normalizar un evento a la forma que usa la tabla.

const PLACEHOLDER = 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';

export const eventsColumns = [
  {
    key: 'url',
    label: 'Imagen',
    // cell renderer: espera que la fila tenga `url`
    cell: (row) => (
      <img src={row.url} alt={row.nombre} className="h-12 w-20 object-cover rounded" />
    ),
  },
  {
    key: 'nombre',
    label: 'Nombre',
    cell: (row) => <div className="font-medium">{row.nombre}</div>,
  },
];

export function normalizeEvent(event) {
  if (!event) return null;
  return {
    id: event.id,
    url: event.url || PLACEHOLDER,
    nombre: event.nombre,
  };
}

export function mapEvents(events = []) {
  return events.map(normalizeEvent).filter(Boolean);
}

export default eventsColumns;
