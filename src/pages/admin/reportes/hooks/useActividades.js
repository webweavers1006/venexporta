// Hook que carga todas las actividades económicas para reportes

/**
 * Hook personalizado para cargar actividades, sectores y subsectores económicos.
 * @module useActividades
 * @description Encapsula la lógica de carga de actividades, sectores y subsectores para el componente Reportes.
 * @param {string|number} activityId - ID de la actividad económica para filtrar sectores.
 * @param {string|number} sectorId - ID del sector para filtrar subsectores.
 * @returns {{ actividades: Array, sectores: Array, subSectores: Array, loading: boolean, error: string|null, reloadActividades: Function, reloadSectores: Function, reloadSubSectores: Function }}
 * @example
 * const { actividades, sectores, subSectores, loading, error, reloadActividades, reloadSectores, reloadSubSectores } = useActividades(activityId, sectorId);
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchAllActivities, fetchSectors, fetchSubSectors } from '@src/lib/api/apiIndex';
import { message } from 'antd';

const useActividades = (activityId, sectorId) => {
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sectores, setSectores] = useState([]);
  const [subSectores, setSubSectores] = useState([]);

  const loadActividades = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchAllActivities();
      setActividades(data || []);
    } catch (error) {
      console.error('Error fetching all activities:', error);
      setError('Error al cargar actividades');
      message.error('Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadActividades();
  }, [loadActividades]);
  
  // Cargar sectores cuando cambia la actividad seleccionada
  const loadSectores = useCallback(async () => {
    if (!activityId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSectors(activityId);
      setSectores(data || []);
    } catch (err) {
      console.error('Error fetching sectors:', err);
      setError('Error al cargar sectores');
      message.error('Error al cargar sectores');
    } finally {
      setLoading(false);
    }
  }, [activityId]);
  useEffect(() => {
    loadSectores();
  }, [loadSectores]);

  // Cargar subsectores cuando cambia el sector seleccionado
  const loadSubSectores = useCallback(async () => {
    if (!sectorId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchSubSectors(sectorId);
      setSubSectores(data || []);
    } catch (err) {
      console.error('Error fetching subsectors:', err);
      setError('Error al cargar subsectores');
      message.error('Error al cargar subsectores');
    } finally {
      setLoading(false);
    }
  }, [sectorId]);
  useEffect(() => {
    loadSubSectores();
  }, [loadSubSectores]);

  return {
    actividades,
    sectores,
    subSectores,
    loading,
    error,
    reloadActividades: loadActividades,
    reloadSectores: loadSectores,
    reloadSubSectores: loadSubSectores
  };
};

export default useActividades;
