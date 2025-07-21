import { useState, useEffect, useCallback } from 'react';
import { fetchEventos } from '@src/lib/api/apiIndex';
import { message } from 'antd';

/**
 * Hook personalizado para cargar todos los eventos.
 * @module useEvents
 * @description Encapsula la lógica de carga de eventos y manejo de errores.
 * @returns {{ events: Array, loading: boolean, error: string|null, reload: Function }}
 */
const useEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEventos();
      setEvents(data || []);
    } catch {
      setError('Error al cargar eventos');
      message.error('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  return { events, loading, error, reload: loadEvents };
};

export default useEvents;
