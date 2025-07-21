
import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

/**
 * Obtiene reportes dinámicos de empresas según filtros.
 * @param {Object} params - Parámetros de filtro (ej: id_evento, id_role, etc.)
 * @returns {Promise<Object>} Respuesta de la API
 */
export const getReportesDinamicosEmpresas = async (params) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/reportes_dinamicos/empresas`, {
      params,
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.empresas;
  } catch (error) {
    console.error('Error obteniendo reportes dinámicos:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
