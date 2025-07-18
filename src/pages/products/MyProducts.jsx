
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Table, message } from 'antd';
import AtomsPanel from '@components/atoms/AtomsPanel';
import { useProductsByCompany } from './hooks/useProductsByCompany';

/**
 * Componente para mostrar la lista de productos de una compañía en una tabla.
 * @component
 * @param {object} props
 * @param {string|number} props.idCompany - ID de la compañía cuyos productos se listan.
 * @param {array} props.columns - Columnas para la tabla de productos.
 * @param {string} [props.panelTitle] - Título del panel.
 * @param {string} [props.panelSubtitle] - Subtítulo del panel.
 * @returns {JSX.Element}
 * @example
 * <MyProducts
 *   idCompany={123}
 *   columns={columns}
 *   panelTitle="Mis Productos"
 *   panelSubtitle="Información de los productos registrados"
 * />
 */
function MyProducts({ idCompany, columns, panelTitle = 'Mis Productos', panelSubtitle = 'Información de los productos registrados' }) {
  const { productsData, isLoading, reloadProducts } = useProductsByCompany(idCompany);
  const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;

  useEffect(() => {
    if (isMobile) {
      message.info('Es recomendable poner el teléfono en horizontal para una mejor experiencia.', 1.5);
    }
  }, [isMobile]);

  return (
    <>
      <AtomsPanel title={panelTitle} subtitle={panelSubtitle} />
      <div className="flex flex-col gap-6 mt-4 bg-white rounded-lg p-4">
        <Table
          columns={columns}
          dataSource={productsData}
          loading={isLoading}
          pagination={{
            defaultPageSize: isMobile ? 5 : 7,
            pageSizeOptions: ['5', '7', '10', '20', '30'],
          }}
          rowKey="id"
          role="table"
          aria-label="Tabla de productos registrados"
        />
      </div>
    </>
  );
}

MyProducts.propTypes = {
  /** ID de la compañía cuyos productos se listan */
  idCompany: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  /** Columnas para la tabla de productos */
  columns: PropTypes.array.isRequired,
  /** Título del panel */
  panelTitle: PropTypes.string,
  /** Subtítulo del panel */
  panelSubtitle: PropTypes.string,
};

export default MyProducts;
