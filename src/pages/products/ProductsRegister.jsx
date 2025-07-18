

import React from 'react';
import PropTypes from 'prop-types';
import AtomsPanel from '@components/atoms/AtomsPanel';
import ProductForm from '@components/ProductForm';

/**
 * RegisterProducts
 *
 * Página para el registro de productos. Incluye un panel de encabezado y el formulario de productos.
 *
 * @component
 * @example
 * // Uso básico
 * <RegisterProducts />
 *
 * @param {Object} props - Props del componente
 * @param {string} [props.panelTitle='Productos'] - Título del panel
 * @param {string} [props.panelSubtitle='Registro de productos'] - Subtítulo del panel
 * @param {React.ReactNode} [props.children] - Elementos adicionales a renderizar debajo del formulario
 * @returns {JSX.Element}
 */
function RegisterProducts({ panelTitle = 'Productos', panelSubtitle = 'Registro de productos', children }) {
  return (
    <>
      <AtomsPanel
        title={panelTitle}
        subtitle={panelSubtitle}
        aria-label="Panel de registro de productos"
      />
      <div className="flex flex-col gap-6 mt-4" role="region" aria-label="Formulario de registro de productos">
        <ProductForm />
        {children}
      </div>
    </>
  );
}

RegisterProducts.propTypes = {
  /** Título del panel */
  panelTitle: PropTypes.string,
  /** Subtítulo del panel */
  panelSubtitle: PropTypes.string,
  /** Elementos adicionales a renderizar debajo del formulario */
  children: PropTypes.node,
};

export default RegisterProducts;