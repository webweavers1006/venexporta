// Configuración de inputs de filtros para Reportes Dinámicos
import { useEffect } from 'react';
import useCompany from '../hooks/useCompany';
import useEvents from '../hooks/useEvents';
import useActividades from '../hooks/useActividades';
import { subSectors } from '@lib/data/subSector';

/**
 * Hook que devuelve la configuración de filtros para reportes,
 * usando datos cargados por hooks personalizados.
 * @returns {Array} Configuración de secciones y campos de filtro
 */
export const useReportesFilterConfig = (selectedActividad, selectedSector) => {
  // Datos generales de filtros (países, estados, municipios, parroquias, actividades empresariales y propiedad)
  const {
    paises,
    actividadesEmpresariales: tipoActividadEmpresarial,
    propiedades: tipoPropiedad,
    estados,
    municipios,
    parroquias,
    setSelectedEstado,
    setSelectedMunicipio,
  } = useCompany();
  // Carga de todos los eventos
  const { events: eventos } = useEvents();
  // Carga de actividades, sectores y subsectores
  const {
    actividades: actividadEconomica,
    sectores: sectorProductivo,
    subSectores: subSectorProductivo,
    setSelectedActividad,
    setSelectedSector,
  } = useActividades(selectedActividad, selectedSector);

  // Cuando cambia estado o municipio, actualizamos flujos encadenados
  useEffect(() => {
    // Al seleccionar un estado, los municipios se actualizan en useCompany
  }, [estados, setSelectedEstado]);
  useEffect(() => {
    // Al seleccionar un municipio, las parroquias se actualizan en useCompany
  }, [municipios, setSelectedMunicipio]);

  // Opciones de subsectores desde subSector.js
  const subSectorProductivoOptions = subSectors;

  const config = [
    {
      title: 'Filtros',
      fields: [
        { name: 'id_sub_sector_productivo', type: 'select', label: 'Sub-sector Productivo', placeholder: 'Seleccione sub-sector', options: subSectorProductivoOptions },
      ],
    },
  ];

  // Retornar config y setters para uso externo
  return { config, setSelectedEstado, setSelectedMunicipio, setSelectedActividad, setSelectedSector };
};
