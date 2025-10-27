import { useState, useRef, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { fetchEventDetails } from '@src/lib/api/apiIndex';
import { getFormattedEvents } from '../helpers/getFormattedEvents';

/**
 * Hook ligero para cargar eventos (formateados) para un carrusel y recuperar
 * las empresas asociadas cuando se selecciona un evento.
 * Sólo expone lo estrictamente necesario para el componente `CompaniesCarousel`.
 *
 * @param {string|number} idCompany - ID de la empresa actual (opcional).
 * @returns {Object} { carouselItems, associatedCompanies, loading, error, listRef, handleItemClick }
 */
export function useAssociatedCompaniesEvents(idCompany) {
  const [carouselItems, setCarouselItems] = useState([]);
  const [eventDetails, setEventDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    async function loadEvents() {
      try {
        const events = await getFormattedEvents(idCompany);
        if (mounted) setCarouselItems(events || []);
      } catch {
        // Silencioso: si falla el formateo no bloqueamos la UI
      }
    }

    // Cargar eventos incluso si no se pasa `idCompany` (p. ej. gestor/admin)
    // getFormattedEvents acepta un parámetro opcional, así que siempre llamamos
    // a loadEvents() y le pasamos `idCompany` si está definido.
    loadEvents();
    return () => {
      mounted = false;
    };
  }, [idCompany]);

  const handleItemClick = useCallback(async (eventId) => {
    setLoading(true);
    setError(null);
    try {
      // Cargar detalles del evento en lugar de las empresas
      const details = await fetchEventDetails(eventId);
      setEventDetails(details || null);
      message.success('Detalle del evento cargado');

      // desplazar la vista hacia el detalle si existe
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      const msg = err?.response?.data?.error?.message || 'Error al obtener los detalles del evento';
      message.error(msg);
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    carouselItems,
  eventDetails,
  setEventDetails,
    loading,
    error,
    listRef,
    handleItemClick,
  };
}
