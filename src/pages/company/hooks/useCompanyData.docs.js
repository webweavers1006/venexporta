/**
 * @fileoverview Hook personalizado para la obtención de datos de compañía, contactos y actividades.
 *
 * @example
 * import { useCompanyData } from './hooks/useCompanyData';
 * const { companyData, contactData, activitiesData, isLoading } = useCompanyData(idUser, idCompany);
 */

/**
 * Hook para obtener y manejar datos de compañía, contactos y actividades.
 * @param {string|number} idUser - ID del usuario.
 * @param {string|number} idCompany - ID de la compañía.
 * @returns {Object} Estado y funciones para recargar los datos.
 * @property {Object|null} companyData - Datos de la compañía.
 * @property {Array} contactData - Lista de contactos.
 * @property {Array} activitiesData - Lista de actividades.
 * @property {boolean} isLoading - Estado de carga.
 * @property {Function} reloadCompany - Recarga los datos de la compañía.
 * @property {Function} reloadContact - Recarga los datos de contacto.
 * @property {Function} reloadActivities - Recarga los datos de actividades.
 */
// ...ver implementación en useCompanyData.js
