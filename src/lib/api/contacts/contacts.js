import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const fetchContactData = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/contactos/${companyId}`);
    return response.data.contactoss;
  } catch (error) {
    console.error('Error fetching contact data:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const postStepContact = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/contactos`, [data]);
    return response.data;
  } catch (error) {
    console.error('Error posting contact:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const deleteContact = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/contactos/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting contact:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
