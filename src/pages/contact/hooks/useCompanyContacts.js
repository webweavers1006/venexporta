import { useState, useEffect, useCallback } from 'react';
import { fetchContactData } from '@src/lib/api/apiIndex';
import appStore from '@store/appStore';
import { useStore } from 'zustand';

/**
 * Hook personalizado para manejar la lógica de contactos de empresa.
 * @returns {{ activitiesData: Array, isLoading: boolean, loadActivitiesData: Function, idCompany: string }}
 */
export function useCompanyContacts() {
  const idCompany = useStore(appStore, state => state.idCompany);
  const [activitiesData, setActivitiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadActivitiesData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchContactData(idCompany);
      setActivitiesData(data);
    } catch (error) {
      // Manejo de error puede ser extendido
      setActivitiesData([]);
    } finally {
      setIsLoading(false);
    }
  }, [idCompany]);

  useEffect(() => {
    loadActivitiesData();
  }, [loadActivitiesData]);

  return { activitiesData, isLoading, loadActivitiesData, idCompany };
}
