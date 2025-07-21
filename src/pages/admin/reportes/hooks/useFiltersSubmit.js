import { useCallback } from 'react';
import { getReportesDinamicosEmpresas } from '@lib/api/reports/reports';

/**
 * Hook para manejar el submit de filtros de reportes.
 * Separa la lógica de envío y permite reutilización.
 * @param {Function} onSuccess - Callback a ejecutar con los datos procesados.
 * @returns {Function} handleFiltersSubmit
 */
export function useFiltersSubmit(onSuccess) {
  // Puedes agregar aquí lógica de transformación, validación extra, etc.
  const handleFiltersSubmit = useCallback(async (data) => {
    // Filtra los elementos vacíos (null, undefined, '', [])
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([, value]) =>
          value !== undefined &&
          value !== null &&
          !(typeof value === 'string' && value.trim() === '') &&
          !(Array.isArray(value) && value.length === 0)
      )
    );
    try {
      const response = await getReportesDinamicosEmpresas(filteredData);
      if (onSuccess) onSuccess(response);
    } catch (error) {
      console.error('Error al obtener reportes dinámicos:', error);
      if (onSuccess) onSuccess(null, error);
    }
  }, [onSuccess]);

  return handleFiltersSubmit;
}
