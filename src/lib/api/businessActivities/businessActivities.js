export const fetchActividadesEmpresariales = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/actividadesEmpresariales`);
    return response.data.actividadesEmpresarialess || [];
  } catch (error) {
    console.error('Error fetching actividades empresariales:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const fetchBusinessActivities = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/actividadesEmpresariales`);
    return response.data.actividadesEmpresarialess || [];
  } catch (error) {
    console.error('Error fetching business activities:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
