import { useState, useEffect } from 'react';
import { getCantEmpresasAnualidad } from '@src/lib/api/apiIndex';

export function useEmpresasAnualidad(anio) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    getCantEmpresasAnualidad(anio)
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [anio]);

  return { data, loading, error };
}
