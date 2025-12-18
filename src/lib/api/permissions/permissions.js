import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const fetchPermissions = async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/permissions`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.permissions || [];
  } catch (error) {
    console.error('Error fetching permissions:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};