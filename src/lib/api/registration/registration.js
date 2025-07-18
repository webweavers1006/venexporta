import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const postStepIdentification = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/user/EmpresaUserCreate`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error posting identification step:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const postStepSignature = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/empresas`, data);
    return response.data;
  } catch (error) {
    console.error('Error posting signature step:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
