export const fetchPaises = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/paises`);
        return response.data.paisess;
    } catch (error) {
        console.error('Error fetching countries:', error.response.data.error.message);
        throw error;
    }
};

export const fetchRequisitos = async (id_user) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/requisitos/${id_user}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching requisitos:', error.response.data.error.message);
        throw error;
    }
};

export const fetchUnidadesMedida = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/unidades_medida`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.unidadesMedidas || [];
    } catch (error) {
        console.error('Error fetching unidades de medida:', error.response.data.error.message);
        throw error;
    }
};

export const fetchRangoTiempo = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/rango_tiempo`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.rangoTiempos || [];
    } catch (error) {
        console.error('Error fetching rango de tiempo:', error.response.data.error.message);
        throw error;
    }
};
import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const fetchCountries = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/paises`);
    return response.data.paisess;
  } catch (error) {
    console.error('Error fetching countries:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchRequirements = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/requisitos/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching requirements:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchUnits = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/unidades_medida`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.unidadesMedidas || [];
  } catch (error) {
    console.error('Error fetching units:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchTimeRanges = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/rango_tiempo`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.rangoTiempos || [];
  } catch (error) {
    console.error('Error fetching time ranges:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
