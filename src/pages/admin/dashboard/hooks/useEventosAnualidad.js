import { useState, useEffect } from 'react';
import { getCantEventosAnualidad } from '@src/lib/api/apiIndex';

export function useEventosAnualidad(anio) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCantEventosAnualidad(anio)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [anio]);

  return { data, loading, error };
}
