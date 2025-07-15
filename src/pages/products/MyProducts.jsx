import { useState, useEffect } from 'react';
import { Table, message } from 'antd';
import AtomsPanel from '@components/atoms/AtomsPanel';
import columns from './columns/columnsMyProducts';
import { fetchProductsByCompany } from '@src/lib/api/apiUser';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import MoleculesTable from '@components/molecules/tables/MoleculesTable';

const MyProducts = () => {
  const idCompany = useStore(appStore, (state) => state.idCompany);
  const [productsData, setProductsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = window.innerWidth <= 768; // Detectar si es un teléfono móvil

  const loadProductsData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchProductsByCompany(idCompany);
      setProductsData(data);
    } catch (error) {
      console.error('Error fetching products data:', error);
      message.error(error.response.data.error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProductsData();
  }, [idCompany]);

  useEffect(() => {
    if (isMobile) {
      message.info('Es recomendable poner el teléfono en horizontal para una mejor experiencia.', 1.5);
    }
  }, []);

  return (
    <>
      <AtomsPanel title={'Mis Productos'} subtitle={'Información de los productos registrados'} />
      <div className="flex flex-col gap-6 mt-4 bg-white rounded-lg p-4">
        <Table
          columns={columns(loadProductsData)}
          dataSource={productsData}
          loading={isLoading}
          pagination={{
            defaultPageSize: isMobile ? 5 : 7,
            pageSizeOptions: ['5', '7', '10', '20', '30'],
          }}
          rowKey="id"
        />
      </div>
    </>
  );
};

export default MyProducts;
