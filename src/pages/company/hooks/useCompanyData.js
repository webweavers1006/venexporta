import { useState, useEffect, useCallback } from 'react';
import { fetchCompanyData, fetchContactData, fetchActivitiesData } from '@src/lib/api/apiIndex';

/**
 * Hook personalizado para manejar la obtención de datos de la compañía, contactos y actividades.
 * @param {string|number} idUser - ID del usuario.
 * @param {string|number} idCompany - ID de la compañía.
 * @returns {Object} Estado y funciones para recargar los datos.
 */
export function useCompanyData(idUser, idCompany) {
  const [companyData, setCompanyData] = useState(null);
  const [contactData, setContactData] = useState([]);
  const [activitiesData, setActivitiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCompanyDataAsync = useCallback(async () => {
    if (idUser) {
      try {
        const data = await fetchCompanyData(idUser);
        setCompanyData(data);
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    }
    setIsLoading(false);
  }, [idUser]);

  const fetchContactDataAsync = useCallback(async () => {
    if (idCompany) {
      try {
        const data = await fetchContactData(idCompany);
        setContactData(data);
      } catch (error) {
        console.error('Error fetching contact data:', error);
      }
    }
  }, [idCompany]);

  const fetchActivitiesDataAsync = useCallback(async () => {
    if (idCompany) {
      try {
        const data = await fetchActivitiesData(idCompany);
        setActivitiesData(data);
      } catch (error) {
        console.error('Error fetching activities data:', error);
      }
    }
  }, [idCompany]);

  useEffect(() => {
    fetchCompanyDataAsync();
  }, [fetchCompanyDataAsync]);

  useEffect(() => {
    fetchContactDataAsync();
  }, [fetchContactDataAsync]);

  useEffect(() => {
    fetchActivitiesDataAsync();
  }, [fetchActivitiesDataAsync]);

  return {
    companyData,
    contactData,
    activitiesData,
    isLoading,
    reloadCompany: fetchCompanyDataAsync,
    reloadContact: fetchContactDataAsync,
    reloadActivities: fetchActivitiesDataAsync,
  };
}
