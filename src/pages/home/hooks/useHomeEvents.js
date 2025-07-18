/**
 * Hook personalizado para manejar la lógica de eventos y bloques de horario en la Home.
 *
 * @returns {Object} Estado y handlers para eventos y bloques de horario.
 * @property {Array} carouselItems - Lista de eventos formateados para el carrusel.
 * @property {Object} scheduleBlocks - Bloques de horario del evento seleccionado.
 * @property {Function} handleItemClick - Handler para seleccionar un evento y cargar sus bloques.
 * @property {Function} loadEventsData - Función para recargar los eventos manualmente.
 *
 * @example
 * import { useHomeEvents } from '@hooks/useHomeEvents';
 * const { carouselItems, scheduleBlocks, handleItemClick } = useHomeEvents();
 */
import { useEffect, useState, useCallback } from 'react';
import { fetchEventosByEmpresas } from '@src/lib/api/apiIndex';
import {fetchScheduleBlocks} from '@src/lib/api/schedules/schedules';
import appStore from '@store/appStore';
import { useStore } from 'zustand';

export function useHomeEvents() {
  const [carouselItems, setCarouselItems] = useState([]);
  const [scheduleBlocks, setScheduleBlocks] = useState({});
  const idCompany = useStore(appStore, state => state.idCompany);
  const idPais = appStore.getState().idPais;

  const loadEventsData = useCallback(async () => {
    try {
      const data = await fetchEventosByEmpresas(idCompany);
      const formattedEvents = data.map((event) => ({
        id: event.id_evento,
        url: event.img_evento || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png',
        nombre: event.nombre_evento,
        descripcion: event.descripcion_evento || 'Sin descripción',
      }));
      setCarouselItems(formattedEvents);
    } catch (error) {
      // Manejo de error centralizado
      setCarouselItems([]);
      // Puedes agregar un logger aquí
    }
  }, [idCompany]);

  const handleItemClick = useCallback(async (eventId) => {
    try {
      const tipo = idPais === 95 ? 2 : 3;
      const blocks = await fetchScheduleBlocks(eventId, idCompany, tipo);
      setScheduleBlocks(blocks);
    } catch (error) {
      setScheduleBlocks({});
      // Puedes agregar un logger aquí
    }
  }, [idCompany, idPais]);

  useEffect(() => {
    loadEventsData();
  }, [loadEventsData]);

  return {
    carouselItems,
    scheduleBlocks,
    handleItemClick,
    loadEventsData,
  };
}
