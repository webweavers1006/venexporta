import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const loginUser = async (user, pass) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/user/authentication`, { user, pass });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
