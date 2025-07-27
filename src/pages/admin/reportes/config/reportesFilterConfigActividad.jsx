import useCompany from '../hooks/useCompany';
import useEvents from '../hooks/useEvents';
import useActividades from '../hooks/useActividades';

// Hook que devuelve la configuración de filtros para reportes dinámicos (país, evento, actividad, sector y sub-sector productivo)
export const useReportesFilterConfig = (selectedActividad, selectedSector) => {
  const {
    paises,
    setSelectedEstado,
    setSelectedMunicipio,
  } = useCompany();
  const { events: eventos } = useEvents();
  const {
    actividades: actividadEconomica,
    sectores: sectorProductivo,
    subSectores: subSectorProductivo,
    setSelectedActividad,
    setSelectedSector,
  } = useActividades(selectedActividad, selectedSector);

  // Opciones para selects en formato { value, label }
  const paisesOptions = paises.map(item => ({ value: item.id.toString(), label: item.pais }));
  const eventosOptions = eventos.map(item => ({ value: item.id.toString(), label: item.nombre_evento }));
  const actividadEconomicaOptions = actividadEconomica.map(item => ({ value: item.id.toString(), label: item.actividad_economica }));
  const sectorProductivoOptions = sectorProductivo.map(item => ({ value: item.id.toString(), label: item.sector_productivo }));
  const subSectorProductivoOptions = subSectorProductivo.map(item => ({ value: item.id.toString(), label: item.sub_sector_productivo }));

  const config = [
    {
      title: 'Filtros',
      fields: [
        { name: 'id_pais', type: 'select', label: 'País', placeholder: 'Seleccione país', options: paisesOptions },
        { name: 'id_evento', type: 'select', label: 'Evento', placeholder: 'Seleccione evento', options: eventosOptions },
        { name: 'id_actividad_economica', type: 'select', label: 'Actividad Económica', placeholder: 'Seleccione actividad', options: actividadEconomicaOptions },
        { name: 'id_sector_productivo', type: 'select', label: 'Sector Productivo', placeholder: 'Seleccione sector', options: sectorProductivoOptions },
        { name: 'id_sub_sector_productivo', type: 'select', label: 'Sub-sector Productivo', placeholder: 'Seleccione sub-sector', options: subSectorProductivoOptions },
      ],
    },
  ];

  return { config, setSelectedEstado, setSelectedMunicipio, setSelectedActividad, setSelectedSector };
};
