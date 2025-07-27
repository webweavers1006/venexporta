import useCompany from '../hooks/useCompany';
import { subSectors } from '@lib/data/subSector';

// Hook que devuelve la configuración de filtros para reportes dinámicos (país y sub-sector productivo)
export const useReportesFilterConfig = () => {
  const {
    paises,
    setSelectedEstado,
    setSelectedMunicipio,
  } = useCompany();


  // Opciones de subsectores y país
  const subSectorProductivoOptions = subSectors;
  const paisesOptions = paises.map(item => ({ value: item.id.toString(), label: item.pais }));

  const config = [
    {
      title: 'Filtros',
      fields: [
        { name: 'id_pais', type: 'select', label: 'País', placeholder: 'Seleccione país', options: paisesOptions },
        { name: 'id_sub_sector_productivo', type: 'select', label: 'Sub-sector Productivo', placeholder: 'Seleccione sub-sector', options: subSectorProductivoOptions },
      ],
    },
  ];

  return { config, setSelectedEstado, setSelectedMunicipio };
};
