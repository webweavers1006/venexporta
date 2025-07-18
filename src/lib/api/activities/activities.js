import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const fetchActivitiesData = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/actividadesEconomicasByEmpresas/1/${companyId}`);
    return response.data.actividadesEconomicasByEmpresass;
  } catch (error) {
    console.error('Error fetching activities data:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchAllActivities = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/actividades_economicas`);
    return response.data.actividadesEconomicass;
  } catch (error) {
    console.error('Error fetching all activities:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchSectors = async (activityId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sectores_productivos/${activityId}`);
    return response.data.sectoresProductivoss;
  } catch (error) {
    console.error('Error fetching sectors:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchSubSectors = async (sectorId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/sub_sectores_productivos/${sectorId}`);
    return response.data.subSectoresProductivoss;
  } catch (error) {
    console.error('Error fetching subsectors:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const postStepActivity = async (data) => {
  const response = await axios.post(`${API_BASE_URL}/actividadesEconomicasByEmpresas`, data);
  return response.data;
};

export const deleteActivityByCompany = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/actividadesEconomicasByEmpresas/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting activity by company:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
