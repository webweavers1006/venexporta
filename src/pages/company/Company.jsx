
import React from 'react';
import PropTypes from 'prop-types';
import { useStore } from 'zustand';
import useAuthStore from '@store/authStore';
import appStore from '@store/appStore';
import { getConfigTable as getContactConfigTable } from '../contact/config/configTable';
import { getConfigTable } from './config/configTable';
import CompanyInfo from '@components/organisms/company/OrganismsCompanyInfo';
import { useCompanyData } from './hooks/useCompanyData';

/**
 * Componente principal para mostrar la información de la compañía, contactos y actividades.
 * Utiliza hooks personalizados para la obtención de datos y es fácilmente reutilizable.
 *
 * @component
 * @example
 * // Uso típico dentro de una ruta protegida
 * <Company />
 *
 * @returns {JSX.Element}
 */
const Company = () => {
  // Obtención de IDs desde los stores globales
  const idUser = useStore(useAuthStore, (state) => state.idUser);
  const idCompany = useStore(appStore, (state) => state.idCompany);

  // Hook personalizado para la lógica de datos
  const {
    companyData,
    contactData,
    activitiesData,
    isLoading,
    reloadCompany,
    reloadContact,
    reloadActivities,
  } = useCompanyData(idUser, idCompany);

  // Configuración de tablas
  const configTable = getConfigTable(activitiesData, reloadActivities);
  const configTableContact = getContactConfigTable(contactData, reloadContact);

  /**
   * Maneja la actualización de la información de la compañía.
   */
  const handleUpdate = () => {
    reloadCompany();
  };

  if (isLoading) {
    return (
      <div role="status" aria-live="polite" aria-busy="true" style={{ padding: '2rem', textAlign: 'center' }}>
        <span>Cargando información de la compañía...</span>
      </div>
    );
  }

  return (
    <section aria-label="Información de la compañía" tabIndex={0}>
      <CompanyInfo
        companyData={companyData}
        configTableContact={configTableContact}
        configTable={configTable}
        onUpdate={handleUpdate}
      />
    </section>
  );
};

Company.propTypes = {
  // Este componente no recibe props directas, pero se deja preparado para extensión futura.
};

export default Company;