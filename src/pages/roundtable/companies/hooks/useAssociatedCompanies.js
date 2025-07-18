import { useState, useRef, useCallback, useEffect } from 'react';
import { message } from 'antd';
import { fetchCompaniesByEvent } from '@src/lib/api/apiIndex';
import { getFormattedEvents } from '../helpers/getFormattedEvents';

/**
 * Hook personalizado para manejar la lógica de empresas asociadas a un evento en la rueda de negocios.
 * @returns {Object} Estado y funciones para manejar empresas asociadas y filtros.
 */
/**
 * Hook personalizado para manejar la lógica de empresas asociadas y eventos de la rueda de negocios.
 * @param {string|number} idCompany - ID de la empresa actual.
 * @returns {Object} Estado y funciones para manejar empresas asociadas, eventos y filtros.
 */
export function useAssociatedCompanies(idCompany) {
  const [carouselItems, setCarouselItems] = useState([]);
  const [associatedCompanies, setAssociatedCompanies] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [selectedSubSector, setSelectedSubSector] = useState(null);
  const [selectedCode, setSelectedCode] = useState('');
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [error, setError] = useState(null);
  const listRef = useRef(null);

  // Cargar eventos del carrusel al montar o cambiar idCompany
  useEffect(() => {
    async function loadEvents() {
      try {
        const events = await getFormattedEvents(idCompany);
        setCarouselItems(events);
      } catch (e) {
        // Manejo de error opcional
      }
    }
    if (idCompany) loadEvents();
  }, [idCompany]);

  /**
   * Maneja el click en un evento para cargar las empresas asociadas.
   * @param {string|number} eventId - ID del evento seleccionado.
   */
  const handleItemClick = useCallback(async (eventId) => {
    try {
      const companies = await fetchCompaniesByEvent(eventId);
      message.success(`Se cargaron ${companies.length} empresas de la rueda de negocio`);
      setAssociatedCompanies(companies);
      setTimeout(() => {
        if (listRef.current) {
          listRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
      setError(null);
    } catch (error) {
      message.error(error?.response?.data?.error?.message || 'Error al obtener las empresas del evento');
      setError(error?.response?.data?.error?.message || 'Error al obtener las empresas del evento');
    }
  }, []);

  /**
   * Filtra las empresas asociadas según los filtros seleccionados.
   */
  const filteredCompanies = associatedCompanies.filter((item) => {
    const matchesActivity = selectedActivity ? item.actividades.includes(selectedActivity) : true;
    const matchesSubSector = selectedSubSector ? item.sub_sectores.includes(selectedSubSector) : true;
    const matchesChapter = selectedChapter ? item.capitulos?.includes(selectedChapter) : true;
    const matchesCode = selectedCode 
      ? item.codigos?.filter(code => code !== null).some(code => code.includes(selectedCode)) 
      : true;
    return matchesActivity && matchesSubSector && matchesChapter && matchesCode;
  });

  return {
    carouselItems,
    associatedCompanies,
    setAssociatedCompanies,
    selectedActivity,
    setSelectedActivity,
    selectedSubSector,
    setSelectedSubSector,
    selectedCode,
    setSelectedCode,
    selectedChapter,
    setSelectedChapter,
    error,
    setError,
    listRef,
    handleItemClick,
    filteredCompanies,
  };
}
