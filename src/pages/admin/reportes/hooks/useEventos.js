/**
 * Hook personalizado para cargar eventos asociados a una compañía.
 * @module useEventos
 * @description Encapsula la lógica de carga de eventos y manejo de errores para el componente Reportes.
 * @param {string|number} idCompany - ID de la compañía para filtrar los eventos.
 * @returns {{ eventos: Array, loading: boolean, error: string|null, reload: Function }}
 * @example
 * const { eventos, loading, error, reload } = useEventos(idCompany);
 */
import { useEffect, useState, useCallback } from 'react';
import { fetchEventos } from '@src/lib/api/apiIndex';
import { message } from 'antd';

const useEventos = (idCompany) => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEventos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEventos(idCompany);
      setEventos(data);
    } catch (err) {
      setError('Error al cargar eventos');
      message.error('Error al cargar eventos');
    } finally {
      setLoading(false);
    }
  }, [idCompany]);

  useEffect(() => {
    if (idCompany) loadEventos();
  }, [idCompany, loadEventos]);

  return { eventos, loading, error, reload: loadEventos };
};

export default useEventos;
