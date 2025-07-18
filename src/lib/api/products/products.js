import axios from 'axios';
import { API_BASE_URL } from '@lib/api/variables';

export const fetchProductCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/productos`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.productoss || [];
  } catch (error) {
    console.error('Error fetching product categories:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const postCategory = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/productos`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering category:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const postProduct = async (data, uploadImage) => {
  try {
    if (data.img && data.img !== 'no hay imagen cargada') {
      const uploadedImage = await uploadImage(data.img);
      if (uploadedImage && uploadedImage.data && uploadedImage.data.display_url) {
        data.img = uploadedImage.data.display_url;
      } else {
        throw new Error('Error uploading image');
      }
    }
    const response = await axios.post(`${API_BASE_URL}/productosByEmpresas`, data, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error registering product:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchProductsByCompany = async (companyId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/productosByEmpresas/${companyId}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.productosByEmpresass || [];
  } catch (error) {
    console.error('Error fetching products by company:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const fetchProductDetails = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/productos/detalles`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data.productosDetalless || [];
  } catch (error) {
    console.error('Error fetching product details:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};

export const deleteProductById = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/productosByEmpresas/${id}`, {
      headers: { 'Content-Type': 'application/json' },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product by ID:', error.response?.data?.error?.message || error.message);
    throw error;
  }
};
