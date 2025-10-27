import { fetchEvents } from '@src/lib/api/apiIndex';

/**
 * Obtiene y formatea los eventos asociados a una empresa para el carrusel.
 * @param {string|number} idCompany - ID de la empresa.
 * @returns {Promise<Array>} Lista de eventos formateados.
 */
export async function getFormattedEvents(idCompany) {
  const data = await fetchEvents(idCompany);
  return data.map((event) => ({
    id: event.id,
    url: event.img_evento || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
    nombre: event.nombre_evento,
    descripcion: event.descripcion_evento || 'Sin descripción',
  }));
}
