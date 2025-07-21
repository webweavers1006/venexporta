import { useState, useEffect, useCallback } from 'react';
import { message } from 'antd';
import { fetchContactData, postStepContact, fetchPaises } from '@src/lib/api/apiIndex';

const useContacts = (idCompany) => {
  const [activitiesData, setActivitiesData] = useState([]);
  const [paises, setPaises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadActivitiesData = useCallback(async () => {
    try {
      const data = await fetchContactData(idCompany);
      setActivitiesData(data);
    } catch (error) {
      console.error('Error fetching activities data:', error);
      message.error('Error al cargar contactos');
    }
  }, [idCompany]);

  useEffect(() => {
    if (idCompany) loadActivitiesData();
  }, [idCompany, loadActivitiesData]);
  // Load list of countries and codes
  useEffect(() => {
    const loadPaises = async () => {
      try {
        const data = await fetchPaises();
        setPaises(data);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };
    loadPaises();
  }, []);

  const addContact = useCallback(async (data) => {
    setIsLoading(true);
    try {
      // Combine area code and phone before sending, omit idPais
      const { codigoArea, telefono: tel, ...rest } = data;
      // Ensure idPais is not sent
      delete rest.idPais;
      const payload = {
        ...rest,
        id_empresa: idCompany,
        telefono: `+${codigoArea}${tel}`
      };
      const response = await postStepContact(payload);
      if (response) {
        message.success('Contacto Exitoso');
        loadActivitiesData();
        return true;
      } else {
        message.error('Error al enviar el contacto');
        return false;
      }
    } catch (error) {
      console.error('Error submitting contact:', error);
      const errorMessage = error?.response?.data?.error?.message || 'Error al enviar el contacto';
      message.error(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [idCompany, loadActivitiesData]);

  return { activitiesData, isLoading, loadActivitiesData, addContact, paises };
};

export default useContacts;
