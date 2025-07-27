import useCompany from '../hooks/useCompany';
import useActividades from '../hooks/useActividades';

// Hook que devuelve la configuración de filtros para reportes dinámicos (país, actividad, sector y sub-sector productivo)
export const useReportesFilterConfig = (selectedActividad, selectedSector) => {
  const {
    paises,
    setSelectedEstado,
    setSelectedMunicipio,
  } = useCompany();

  const {
    actividades: actividadEconomica,
    sectores: sectorProductivo,
    subSectores: subSectorProductivo,
    setSelectedActividad,
    setSelectedSector,
  } = useActividades(selectedActividad, selectedSector);

  // Opciones para selects en formato { value, label }
  const paisesOptions = paises.map(item => ({ value: item.id.toString(), label: item.pais }));
  const actividadEconomicaOptions = actividadEconomica.map(item => ({ value: item.id.toString(), label: item.actividad_economica }));
  const sectorProductivoOptions = sectorProductivo.map(item => ({ value: item.id.toString(), label: item.sector_productivo }));
  const subSectorProductivoOptions = subSectorProductivo.map(item => ({ value: item.id.toString(), label: item.sub_sector_productivo }));

  const config = [
    {
      title: 'Filtros',
      fields: [
        { name: 'id_pais', type: 'select', label: 'País', placeholder: 'Seleccione país', options: paisesOptions },
        { name: 'id_actividad_economica', type: 'select', label: 'Actividad Económica', placeholder: 'Seleccione actividad', options: actividadEconomicaOptions },
        { name: 'id_sector_productivo', type: 'select', label: 'Sector Productivo', placeholder: 'Seleccione sector', options: sectorProductivoOptions },
        { name: 'id_sub_sector_productivo', type: 'select', label: 'Sub-sector Productivo', placeholder: 'Seleccione sub-sector', options: subSectorProductivoOptions },
      ],
    },
  ];

  return { config, setSelectedEstado, setSelectedMunicipio, setSelectedActividad, setSelectedSector };
};
