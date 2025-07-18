import { useEffect, useState } from 'react';
import { fetchCompanyEstadis } from '@src/lib/api/apiIndex';
import { fetchUserEstadis } from '@src/lib/api/apiIndex';
import { transformData } from '@lib/utils';

/**
 * Hook personalizado para cargar datos principales del dashboard.
 * @param {number} selectedPais - ID del país seleccionado.
 * @returns {{ firstApiData: any, secondApiData: any, loading: boolean }}
 */
export function useDashboardData(selectedPais) {
  const [firstApiData, setFirstApiData] = useState(null);
  const [secondApiData, setSecondApiData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const firstData = await fetchCompanyEstadis(selectedPais);
        const transformedFirstData = transformData(firstData, 'empresas_registradas', 'var(--color-safari)');
        setFirstApiData(transformedFirstData);
        const secondData = await fetchUserEstadis();
        const transformedSecondData = transformData(secondData, 'cantidad_usuarios', 'var(--color-chrome)');
        setSecondApiData(transformedSecondData);
      } catch {
        // Error silenciado
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedPais]);

  return { firstApiData, secondApiData, loading };
}

/**
 * Hook personalizado para manejar efectos secundarios del dashboard relacionados con la carga de datos.
 * @param {Object} params
 * @param {Function} params.fetchPaises - Función para obtener países.
 * @param {Function} params.setPaises - Setter para países.
 * @param {Function} params.getCantSubSectorProductivo - API para subsectores.
 * @param {Function} params.getCantEmpresasAnualidad - API para empresas por año.
 * @param {Function} params.getCantEventosAnualidad - API para eventos por año.
 * @param {Function} params.getRankParticipacionEventos - API para ranking de eventos.
 * @param {Function} params.setCantSubSector - Setter para subsectores.
 * @param {Function} params.setCantEmpresasAnualidad - Setter para empresas anualidad.
 * @param {Function} params.setCantEventosAnualidad - Setter para eventos anualidad.
 * @param {Function} params.setEventosByEmpresasRanks - Setter para ranking eventos.
 * @param {number} params.anioEmpresas - Año empresas.
 * @param {number} params.anioEventos - Año eventos.
 */
export function useDashboardEffects({
  fetchPaises,
  setPaises,
  getCantSubSectorProductivo,
  getCantEmpresasAnualidad,
  getCantEventosAnualidad,
  getRankParticipacionEventos,
  setCantSubSector,
  setCantEmpresasAnualidad,
  setCantEventosAnualidad,
  setEventosByEmpresasRanks,
  anioEmpresas,
  anioEventos
}) {
  // Cargar países al montar
  useEffect(() => {
    const loadPaises = async () => {
      try {
        const paisesData = await fetchPaises();
        setPaises(paisesData);
      } catch {
        // Error silenciado
      }
    };
    loadPaises();
  }, [fetchPaises, setPaises]);

  // Cargar datos de subsectores, empresas y eventos por anualidad, y ranking de participación
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [subSector, empresasAnualidad, eventosAnualidad, ranking] = await Promise.all([
          getCantSubSectorProductivo(),
          getCantEmpresasAnualidad(anioEmpresas),
          getCantEventosAnualidad(anioEventos),
          getRankParticipacionEventos()
        ]);
        setCantSubSector(subSector);
        setCantEmpresasAnualidad(empresasAnualidad);
        setCantEventosAnualidad(eventosAnualidad);
        if (ranking && Array.isArray(ranking.eventosByEmpresasRanks)) {
          setEventosByEmpresasRanks(ranking.eventosByEmpresasRanks);
        }
      } catch {
        // Error silenciado
      }
    };
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCantSubSectorProductivo, getCantEmpresasAnualidad, getCantEventosAnualidad, getRankParticipacionEventos, setCantSubSector, setCantEmpresasAnualidad, setCantEventosAnualidad, setEventosByEmpresasRanks, anioEmpresas, anioEventos]);

  // Actualizar eventos por anualidad al cambiar año
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const eventos = await getCantEventosAnualidad(anioEventos);
        setCantEventosAnualidad(eventos);
      } catch {
        // Error silenciado
      }
    };
    fetchEventos();
  }, [getCantEventosAnualidad, setCantEventosAnualidad, anioEventos]);
}
