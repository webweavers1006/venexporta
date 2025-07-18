import { useState, useEffect } from 'react';
import { message } from 'antd';
import { fetchProductsByCompany } from '@src/lib/api/apiIndex';

/**
 * Hook personalizado para cargar productos de una compañía.
 * @param {string|number} idCompany - ID de la compañía.
 * @returns {{ productsData: Array, isLoading: boolean, reloadProducts: Function }}
 * @example
 * const { productsData, isLoading, reloadProducts } = useProductsByCompany(idCompany);
 */
export function useProductsByCompany(idCompany) {
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const reloadProducts = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProductsByCompany(idCompany);
      setProductsData(data);
    } catch (error) {
      console.error('Error fetching products data:', error);
      message.error(error?.response?.data?.error?.message || 'Error al cargar productos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (idCompany) reloadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idCompany]);

  return { productsData, isLoading, reloadProducts };
}
