import { useEffect } from 'react';
import useCompany from '../hooks/useCompany';


// Hook que devuelve la configuración de filtros para reportes dinámicos
export const useReportesFilterConfig = () => {
  // Hooks personalizados para obtener datos de filtros

  const {
    paises,
    estados,
    municipios,
    parroquias,
    setSelectedEstado,
    setSelectedMunicipio,
  } = useCompany();



  // Actualización de flujos encadenados al cambiar estado o municipio
  useEffect(() => {}, [estados, setSelectedEstado]);
  useEffect(() => {}, [municipios, setSelectedMunicipio]);

  // Opciones para selects en formato { value, label }
  const paisesOptions = paises.map(item => ({ value: item.id.toString(), label: item.pais }));
  const estadosOptions = estados.map(item => ({ value: item.id.toString(), label: item.estado }));
  const municipiosOptions = municipios.map(item => ({ value: item.id.toString(), label: item.municipio }));
  const parroquiasOptions = parroquias.map(item => ({ value: item.id.toString(), label: item.parroquia }));

  // Configuración de filtros principales
  const config = [
    {
      title: 'Filtros',
      fields: [
        { name: 'id_pais', type: 'select', label: 'País', placeholder: 'Seleccione país', options: paisesOptions },
        { name: 'id_estado', type: 'select', label: 'Estado', placeholder: 'Seleccione estado', options: estadosOptions },
        { name: 'id_municipio', type: 'select', label: 'Municipio', placeholder: 'Seleccione municipio', options: municipiosOptions },
        { name: 'id_parroquia', type: 'select', label: 'Parroquia', placeholder: 'Seleccione parroquia', options: parroquiasOptions },
      ],
    },
  ];

  // Retornar configuración y setters para uso externo
  return { config, setSelectedEstado, setSelectedMunicipio };
};
