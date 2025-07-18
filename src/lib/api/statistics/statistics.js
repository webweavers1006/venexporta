export const fetchUserEstadis = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/dash/cant_usuarios`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data from second API:', error.response.data.error.message);
        throw error;
    }
};
import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const fetchUserStatistics = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/dash/cant_usuarios`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user statistics:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
