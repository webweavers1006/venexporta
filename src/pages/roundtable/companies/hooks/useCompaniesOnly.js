/**
 * @fileoverview Hook personalizado para la lógica de CompaniesOnly.
 * @module useCompaniesOnly
 *
 * @description
 * Encapsula la lógica de carga de datos de empresa, productos, eventos, agenda y documentos.
 *
 * @example
 * const {
 *   productsCompany,
 *   companyEvents,
 *   scheduleBlocks,
 *   economicActivities,
 *   subEconomicSectors,
 *   companyDocuments,
 *   reloadScheduleBlocks
 * } = useCompaniesOnly({ id, event });
 */
import { useState, useEffect, useCallback } from 'react';
import {
  fetchProductsByCompany,
  fetchCompanyEvents,
  fetchActivitiesData,
  fetchDocumentosByEmpresa,
} from '@src/lib/api/apiIndex';

import {fetchScheduleBlocks} from '@src/lib/api/schedules/schedules';

/**
 * Hook para cargar y manejar la información de una empresa y su agenda.
 * @param {Object} params
 * @param {string} params.id - ID de la empresa.
 * @param {string} params.event - ID del evento.
 * @returns {Object}
 */
export function useCompaniesOnly({ id, event }) {
  const [productsCompany, setProductsCompany] = useState([]);
  const [companyEvents, setCompanyEvents] = useState([]);
  const [scheduleBlocks, setScheduleBlocks] = useState({});
  const [economicActivities, setEconomicActivities] = useState('');
  const [subEconomicSectors, setSubEconomicSectors] = useState('');
  const [companyDocuments, setCompanyDocuments] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const products = await fetchProductsByCompany(id);
        setProductsCompany(products);

        const events = await fetchCompanyEvents(id);
        setCompanyEvents(events);

        if (event) {
          const blocks = await fetchScheduleBlocks(event, id, 1);
          setScheduleBlocks(blocks);
        }

        const activitiesData = await fetchActivitiesData(id);
        setEconomicActivities(activitiesData.map(a => a.actividad_economica).join(', '));
        setSubEconomicSectors(activitiesData.map(a => a.sub_sector_productivo).join(', '));

        const documentos = await fetchDocumentosByEmpresa(id);
        setCompanyDocuments(documentos);
      } catch (error) {
        // Manejo de errores centralizado
        // eslint-disable-next-line no-console
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [id, event]);

  const reloadScheduleBlocks = useCallback(async () => {
    if (event) {
      const blocks = await fetchScheduleBlocks(event, id, 1);
      setScheduleBlocks(blocks);
    }
  }, [event, id]);

  return {
    productsCompany,
    companyEvents,
    scheduleBlocks,
    economicActivities,
    subEconomicSectors,
    companyDocuments,
    reloadScheduleBlocks,
  };
}
