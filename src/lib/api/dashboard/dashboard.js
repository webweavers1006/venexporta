import axios from 'axios';

import {API_BASE_URL} from '@lib/api/variables';

// 1. Cantidad por sub sector productivo
export const getCantSubSectorProductivo = async () => {
  const controller = new AbortController();
  let response;
  try {
    response = await axios.get(`${API_BASE_URL}/dash/cant_empresas_sector_economico`, {
      signal: controller.signal,
    });
    return response.data;
  } catch (error) {
    console.error('Error al consultar cant_sub_sector_productivo:', error?.response?.data?.error?.message || error.message);
    throw error;
  } finally {
    controller.abort(); // Cierra/cancela la conexión si sigue activa
  }
};

// 2. Cantidad de empresas por anualidad
export const getCantEmpresasAnualidad = async (anio) => {
  const controller = new AbortController();
  let response;
  try {
    response = await axios.get(`${API_BASE_URL}/dash/cant_empresas_anualidad/${anio}`, {
      signal: controller.signal,
    });
    return response.data;
  } catch (error) {
    console.error('Error al consultar cant_empresas_anualidad:', error?.response?.data?.error?.message || error.message);
    throw error;
  } finally {
    controller.abort(); // Cierra/cancela la conexión si sigue activa
  }
};

// 3. Cantidad de eventos por anualidad
export const getCantEventosAnualidad = async (anio) => {
  const controller = new AbortController();
  let response;
  try {
    response = await axios.get(`${API_BASE_URL}/dash/cant_eventos_anualidad/${anio}`, {
      signal: controller.signal,
    });
    return response.data;
  } catch (error) {
    console.error('Error al consultar cant_eventos_anualidad:', error?.response?.data?.error?.message || error.message);
    throw error;
  } finally {
    controller.abort(); // Cierra/cancela la conexión si sigue activa
  }
};

// 4. Ranking de participación en eventos
export const getRankParticipacionEventos = async () => {
  const controller = new AbortController();
  let response;
  try {
    response = await axios.get(`${API_BASE_URL}/dash/rank_participacion_eventos`, {
      signal: controller.signal,
    });
    return response.data;
  } catch (error) {
    console.error('Error al consultar rank_participacion_eventos:', error?.response?.data?.error?.message || error.message);
    throw error;
  } finally {
    controller.abort(); // Cierra/cancela la conexión si sigue activa
  }
};

export const fetchCompanyEstadis = async (pais) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dash/cant_empresas_paises/${pais}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching data from first API:', error.response.data.error.message);
        throw error;
    }
};