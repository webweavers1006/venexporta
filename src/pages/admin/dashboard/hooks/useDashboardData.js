import { useEffect, useState } from 'react';
import { fetchCompanyEstadis } from '@src/lib/api/dashboard/dashboard';
import { fetchUserEstadis } from '@src/lib/api/apiUser';
import { transformData } from '@lib/utils';

/**
 * Hook personalizado para cargar datos principales del dashboard.
 * @param {number} selectedPais - ID del país seleccionado.
 * @returns {{ firstApiData: any, secondApiData: any, loading: boolean }}
 */
export function useDashboardData(selectedPais) {
  const [firstApiData, setFirstApiData] = useState(null);
  const [secondApiData, setSecondApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firstData = await fetchCompanyEstadis(selectedPais);
        const transformedFirstData = transformData(firstData, 'empresas_registradas', 'var(--color-safari)');
        setFirstApiData(transformedFirstData);
        const secondData = await fetchUserEstadis();
        const transformedSecondData = transformData(secondData, 'cantidad_usuarios', 'var(--color-chrome)');
        setSecondApiData(transformedSecondData);
      } catch {
        // Error silenciado
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPais]);

  return { firstApiData, secondApiData, loading };
}
