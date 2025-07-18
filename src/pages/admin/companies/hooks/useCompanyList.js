import { useState, useEffect, useRef, useCallback } from 'react';
import { message } from 'antd';
import { fetchCompaniestAll } from '@lib/api/apiIndex';

/**
 * Hook personalizado para gestionar la lista y filtrado de empresas.
 * @returns {object} Estado y acciones para la lista de empresas.
 */
export function useCompanyList() {
  const [associatedCompanies, setAssociatedCompanies] = useState([]);
  const [selectedRif, setSelectedRif] = useState("");
  const [selectedEmpresa, setSelectedEmpresa] = useState("");
  const listRef = useRef(null);

  // Cargar empresas al montar
  useEffect(() => {
    const fetchData = async () => {
      try {
        const companies = await fetchCompaniestAll();
        setAssociatedCompanies(companies);
      } catch (error) {
        message.error('Error al cargar las empresas');
      }
    };
    fetchData();
  }, []);

  // Filtrar empresas por RIF y nombre
  const filteredCompanies = associatedCompanies.filter((item) => {
    const matchesRif = selectedRif ? item.rif?.includes(selectedRif) : true;
    const matchesEmpresa = selectedEmpresa ? item.empresa?.toLowerCase().includes(selectedEmpresa.toLowerCase()) : true;
    return matchesRif && matchesEmpresa;
  });

  return {
    listRef,
    filteredCompanies,
    selectedRif,
    setSelectedRif,
    selectedEmpresa,
    setSelectedEmpresa,
  };
}
