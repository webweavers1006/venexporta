import axios from 'axios';

import {API_BASE_URL} from '@lib/api/variables';

export const fetchCitasByEvento = async (id_evento) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/citas/lista/${id_evento}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.citass || [];
  } catch (error) {
    console.error('Error fetching citas by evento:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchScheduleBlocks = async (eventId, companyId, tipo) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/bloques_horarios/${eventId}/${companyId}/${tipo}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const bloquesHorarios = response.data.bloquesHorarioss || [];

    // Agrupar bloques por fecha
    const groupedByDate = bloquesHorarios.reduce((acc, bloque) => {
      const date = bloque.fecha_hora.split(' ')[0]; // Obtener solo la fecha (YYYY-MM-DD)
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(bloque);
      return acc;
    }, {});

    return groupedByDate; // Retornar los bloques agrupados por fecha
  } catch (error) {
    console.error('Error fetching schedule blocks:', error.response.data.error.message);
    throw error;
  }
};

export const scheduleAppointment = async (id_evento, id_empresa_solicitante, id_empresa_receptora, fecha_solicitada) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/citas`, {
      id_evento,
      id_empresa_solicitante,
      id_empresa_receptora,
      fecha_solicitada,
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error scheduling appointment:', error.response.data.error.message);
    throw error;
  }
};

export const deleteAppointment = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/citas/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting appointment:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const updateAppointmentStatus = async (id, id_estatus , id_empresa_receptora, id_empresa_solicitante, fecha_solicitada ) => {
  console.log(id_estatus, id_empresa_solicitante, id_empresa_receptora);
  try {
    const response = await axios.put(`${API_BASE_URL}/citas/${id}`, { id_estatus, id_empresa_receptora, id_empresa_solicitante, fecha_solicitada  }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el estado de la cita:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchRequestedAppointments = async (idCompany, typeAppointment) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/citas/solicitadas/${typeAppointment}/${idCompany}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data.citass || [];
    } catch (error) {
        console.error('Error fetching requested appointments:', error.response.data.error.message);
        throw error;
    }
};