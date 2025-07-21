// Hook que carga los filtros para reportes, empezando por los países

/**
 * Hook personalizado para cargar filtros para reportes.
 * Trae todos los países disponibles.
 * @module useFilters
 * @description Encapsula la lógica de carga de países y manejo de errores.
 * @returns {{ paises: Array, actividadesEmpresariales: Array, propiedades: Array, estados: Array, municipios: Array, parroquias: Array, loading: boolean, error: string|null, reload: Function, setSelectedEstado: Function, setSelectedMunicipio: Function }}
 * @example
 * const { paises, loading, error, reload } = useFilters();
 */
import { useState, useEffect, useCallback } from 'react';
import { fetchPaises, fetchActividadesEmpresariales } from '@src/lib/api/apiIndex';
import { propiedad } from '@src/lib/data/propiedad';
import { estados } from '@src/lib/data/estados';
import { extraerMunicipios } from '@src/lib/data/municipios';
import { extraerParroquias } from '@src/lib/data/parroquias';
import { message } from 'antd';

const useCompany = () => {
  const [paises, setPaises] = useState([]);
  const [actividadesEmpresariales, setActividadesEmpresariales] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [estadosList, setEstadosList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // Estado seleccionado y municipios filtrados
  const [selectedEstado, setSelectedEstado] = useState(null);
  const [municipios, setMunicipios] = useState([]);
  // Municipio seleccionado y lista de parroquias
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [parroquias, setParroquias] = useState([]);

  const loadPaises = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Carga países y actividades empresariales en paralelo
      const [paisesData, actividadesData] = await Promise.all([
        fetchPaises(),
        fetchActividadesEmpresariales()
      ]);
      setPaises(paisesData || []);
      setActividadesEmpresariales(actividadesData || []);
      // Carga lista de propiedad y estados estáticos
      setPropiedades(propiedad || []);
      setEstadosList(estados || []);
    } catch (error) {
      console.error('Error fetching countries:', error);
      setError('Error al cargar países');
      message.error('Error al cargar países');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPaises();
  }, [loadPaises]);

  // Actualiza municipios al cambiar el estado seleccionado
  useEffect(() => {
    if (selectedEstado) {
      setMunicipios(extraerMunicipios(selectedEstado));
    } else {
      setMunicipios([]);
    }
  }, [selectedEstado]);

  // Actualiza parroquias al cambiar el municipio seleccionado
  useEffect(() => {
    if (selectedMunicipio) {
      setParroquias(extraerParroquias(selectedMunicipio));
    } else {
      setParroquias([]);
    }
  }, [selectedMunicipio]);

  return {
    paises,
    actividadesEmpresariales,
    propiedades,
    estados: estadosList,
    municipios,
    parroquias,
    loading,
    error,
    reload: loadPaises,
    setSelectedEstado,
    setSelectedMunicipio
  };
};

export default useCompany;