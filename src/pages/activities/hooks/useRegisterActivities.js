import { useState, useEffect } from 'react';
import { fetchActivitiesData, fetchAllActivities, fetchSectors, fetchSubSectors } from '@src/lib/api/apiIndex';
import appStore from '@store/appStore';
import { useStore } from 'zustand';

/**
 * Hook personalizado para gestionar el estado y la lógica de actividades económicas.
 * @param {Function} getConfigTable - Función para obtener la configuración de la tabla.
 * @returns {Object} Estado y funciones relacionadas con actividades económicas.
 */
export function useRegisterActivities(getConfigTable) {
  const idCompany = useStore(appStore, state => state.idCompany);
  const [activitiesData, setActivitiesData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [subSectors, setSubSectors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadActivitiesData = async () => {
    try {
      const data = await fetchActivitiesData(idCompany);
      setActivitiesData(data);
    } catch (error) {
      console.error('Error fetching activities data:', error);
    }
  };

  useEffect(() => {
    loadActivitiesData();
  }, [idCompany]);

  useEffect(() => {
    const loadAllActivities = async () => {
      try {
        const data = await fetchAllActivities();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };
    loadAllActivities();
  }, []);

  const handleActivityChange = async (idActividadEconomica) => {
    if (idActividadEconomica) {
      try {
        const data = await fetchSectors(idActividadEconomica);
        setSubSectors([]);
        setSectors(data);
      } catch (error) {
        console.error('Error fetching sectors:', error);
      }
    }
  };

  const handleSectorChange = async (idSectorProductivo) => {
    if (idSectorProductivo) {
      try {
        const data = await fetchSubSectors(idSectorProductivo);
        setSubSectors(data);
      } catch (error) {
        console.error('Error fetching subsectors:', error);
      }
    }
  };

  const resetSelects = () => {
    setSectors([]);
    setSubSectors([]);
  };

  const configTable = getConfigTable(activitiesData, loadActivitiesData);

  return {
    idCompany,
    activitiesData,
    activities,
    sectors,
    subSectors,
    isLoading,
    setIsLoading,
    loadActivitiesData,
    handleActivityChange,
    handleSectorChange,
    resetSelects,
    configTable,
  };
}
