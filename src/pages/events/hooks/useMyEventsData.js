import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import { fetchEventosByEmpresas } from '@src/lib/api/apiIndex';

/**
 * Hook personalizado para gestionar la obtención y actualización de los eventos de una empresa.
 * @param {string|number} idCompany - ID de la empresa para filtrar los eventos.
 * @returns {{ eventsData: Array, reloadEvents: Function, loading: boolean, error: any }}
 * @example
 * const { eventsData, reloadEvents, loading, error } = useMyEventsData(idCompany);
 */
export default function useMyEventsData(idCompany) {
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadEventsData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchEventosByEmpresas(idCompany);
      setEventsData(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [idCompany]);

  useEffect(() => {
    if (idCompany) {
      loadEventsData();
    }
  }, [idCompany, loadEventsData]);

  return { eventsData, reloadEvents: loadEventsData, loading, error };
}

useMyEventsData.propTypes = {
  idCompany: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]).isRequired
};
