// Función adicional: obtener todos los eventos (si la respuesta es diferente a fetchEvents)
export const fetchEventos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/eventos`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.eventoss;
  } catch (error) {
    console.error('Error fetching eventos:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

// Función adicional: obtener eventos por empresa (si la respuesta es diferente a fetchEventsByCompany)
export const fetchEventosByEmpresas = async (empresaId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/eventosByEmpresas/${empresaId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.eventosByEmpresass;
  } catch (error) {
    console.error('Error fetching eventos by empresas:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const fetchEvents = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/eventos`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.eventoss;
  } catch (error) {
    console.error('Error fetching events:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const registerForEvent = async (eventId, companyId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/eventosByEmpresas`, { id_empresa: companyId, id_evento: eventId }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering for event:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchEventsByCompany = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/eventosByEmpresas/${companyId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.eventosByEmpresass;
  } catch (error) {
    console.error('Error fetching events by company:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchEventDetails = async (eventId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/eventos/${eventId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching event details:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const updateEventRequestStatus = async (id, statusId) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/eventosByEmpresas/${id}`, { id_estatus: statusId }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating event request status:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const deleteEventByCompany = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/eventosByEmpresas/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting event by company:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
