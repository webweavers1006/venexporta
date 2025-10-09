import { useState, useEffect, useCallback } from 'react';
import { fetchRequestedAppointments } from '@lib/api/apiIndex';

/**
 * Hook para obtener las citas solicitadas de una empresa combinando los tipos 1 y 2 en paralelo.
 * @param {string|number} idCompany - ID de la empresa.
 * @returns {object} { appointments, loading, error, refetch }
 */
export function useSchedules(idCompany) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Ejecuta ambas consultas en paralelo: tipos 1 y 2 para el mismo idCompany
      const [data1, data2] = await Promise.all([
        fetchRequestedAppointments(idCompany, 1),
        fetchRequestedAppointments(idCompany, 2),
      ]);
      // Combina los resultados en un solo arreglo
      const combined = [...(Array.isArray(data1) ? data1 : []), ...(Array.isArray(data2) ? data2 : [])];
      setAppointments(combined);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [idCompany]);

  useEffect(() => {
    if (idCompany) {
      fetchData();
    }
  }, [fetchData, idCompany]);

  return { appointments, loading, error, refetch: fetchData };
}
