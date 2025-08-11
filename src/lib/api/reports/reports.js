
import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

/**
 * Obtiene reportes dinámicos de empresas según filtros.
 * @param {Object} params - Parámetros de filtro (ej: id_evento, id_role, etc.)
 * @returns {Promise<Object>} Respuesta de la API
 */
export const getReportesDinamicosEmpresas = async (params, type) => {
  try {
    // Si type no existe o está vacío, se asigna 'general' por defecto
    const finalType = type === undefined || type === null || type === '' ? 'general' : type;
    const body = {type: finalType };
    const response = await axios.post(
      `${API_BASE_URL}/reportes_dinamicos/empresas`,
      body,
      { headers: { 'Content-Type': 'application/json' },
    params }
    );
    return response.data.empresas;
  } catch (error) {
    console.error('Error obteniendo reportes dinámicos:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
