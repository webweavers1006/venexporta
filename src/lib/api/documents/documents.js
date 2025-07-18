// Crear documento en la API (POST a /documentos)
export const createDocumentoEmpresa = async ({ url_documento, id_empresa, id_tipo_archivo }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/documentos`, {
      url_documento,
      id_empresa,
      id_tipo_archivo
    });
    return response.data;
  } catch (error) {
    console.error('Error creando documento:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

// Obtener documentos de una empresa por ID
export const fetchDocumentosByEmpresa = async (id_empresa) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/documentos/${id_empresa}`);
    return response.data.documentoss || [];
  } catch (error) {
    console.error('Error fetching documentos by empresa:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

// Eliminar documento de empresa por ID
export const deleteDocumentoEmpresa = async (id_documento) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/documentos/${id_documento}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting documento empresa:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

// Obtener tipos de archivos
export const fetchTiposArchivo = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tipo_archivo`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data.tipoArchivos || [];
  } catch (error) {
    console.error('Error fetching tipos de archivo:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const createCompanyDocument = async ({ url, companyId, fileTypeId }) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/documentos`, {
      url_documento: url,
      id_empresa: companyId,
      id_tipo_archivo: fileTypeId
    });
    return response.data;
  } catch (error) {
    console.error('Error creating document:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchDocumentsByCompany = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/documentos/${companyId}`);
    return response.data.documentoss || [];
  } catch (error) {
    console.error('Error fetching documents by company:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const deleteCompanyDocument = async (documentId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/documentos/${documentId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting company document:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchFileTypes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/tipo_archivo`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.tipoArchivos || [];
  } catch (error) {
    console.error('Error fetching file types:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
