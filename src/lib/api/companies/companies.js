export const fetchCompaniestAll = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/empresas`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.empresass || [];
  } catch (error) {
    console.error('Error fetching companies:', error.response.data.error.message);
    throw error;
  }
};
import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const fetchCompanyData = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/empresas/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching company data:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const updateCompanyData = async (data, id) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/empresas/${id}`, data);
    return response.data;
  } catch (error) {
    throw new Error('Error updating company data');
  }
};

export const fetchCompaniesByEvent = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/eventosByEmpresas/rueda_negocios/${eventId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.eventosByEmpresasRNs || [];
  } catch (error) {
    console.error('Error fetching companies by event:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchCompaniesByEventAll = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/eventosByEmpresas/empresasXeventos/${eventId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.eventosByEmpresass || [];
  } catch (error) {
    console.error('Error fetching companies by event:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchAllCompanies = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/empresas`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.empresass || [];
  } catch (error) {
    console.error('Error fetching companies:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchCompanyEvents = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/empresas/unique/${companyId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data || [];
  } catch (error) {
    console.error('Error fetching company events:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
