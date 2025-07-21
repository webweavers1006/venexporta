// Configuración de inputs de filtros para Reportes Dinámicos
import { useEffect } from 'react';
import useCompany from '../hooks/useCompany';
import useEvents from '../hooks/useEvents';
import useActividades from '../hooks/useActividades';

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

  // Preparar opciones en formato { value, label }
  const tipoActividadOptions = tipoActividadEmpresarial.map(item => ({ value: item.id.toString(), label: item.tipo_actividad_empresarial }));
  const tipoPropiedadOptions = tipoPropiedad.map(item => ({ value: item.id.toString(), label: item.tipo_propiedad }));
  const paisesOptions = paises.map(item => ({ value: item.id.toString(), label: item.pais }));
  const estadosOptions = estados.map(item => ({ value: item.id.toString(), label: item.estado }));
  const municipiosOptions = municipios.map(item => ({ value: item.id.toString(), label: item.municipio }));
  const parroquiasOptions = parroquias.map(item => ({ value: item.id.toString(), label: item.parroquia }));
  const eventosOptions = eventos.map(item => ({ value: item.id.toString(), label: item.nombre_evento }));
  const actividadEconomicaOptions = actividadEconomica.map(item => ({ value: item.id.toString(), label: item.actividad_economica }));
  const sectorProductivoOptions = sectorProductivo.map(item => ({ value: item.id.toString(), label: item.sector_productivo }));
  const subSectorProductivoOptions = subSectorProductivo.map(item => ({ value: item.id.toString(), label: item.sub_sector_productivo }));

  const config = [
    {
      title: 'Filtros',
      fields: [
        { name: 'id_evento', type: 'select', label: 'Evento', placeholder: 'Seleccione evento', options: eventosOptions },
        { name: 'id_actividad_economica', type: 'select', label: 'Actividad Económica', placeholder: 'Seleccione actividad', options: actividadEconomicaOptions },
        { name: 'id_sector_productivo', type: 'select', label: 'Sector Productivo', placeholder: 'Seleccione sector', options: sectorProductivoOptions },
        { name: 'id_sub_sector_productivo', type: 'select', label: 'Sub-sector Productivo', placeholder: 'Seleccione sub-sector', options: subSectorProductivoOptions },
      ],
    },
  ];

  // Retornar config y setters para uso externo
  return { config, setSelectedEstado, setSelectedMunicipio, setSelectedActividad, setSelectedSector };
};
