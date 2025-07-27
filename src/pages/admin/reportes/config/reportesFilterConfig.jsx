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

  // Paleta de colores para los fields (no repetir)
  const colorPalette = [
    '#34a853', // verde
    '#4285f4', // azul
    '#fbbc05', // amarillo
    '#ea4335', // rojo
    '#a142f4', // morado
    '#00bcd4', // cyan
    '#ff9800', // naranja
    '#8bc34a', // lima
    '#e91e63', // rosa
    '#607d8b', // gris
    '#795548', // marrón
    '#9c27b0', // púrpura
    '#3f51b5', // azul oscuro
    '#009688', // teal
    '#cddc39', // amarillo lima
    '#ff5722', // naranja oscuro
    '#673ab7', // púrpura oscuro
    '#2196f3', // azul claro
    '#4caf50', // verde medio
    '#f44336', // rojo fuerte
  ];

  // Asignar color único a cada field (opcional)
  let colorIndex = 0;
  function assignColors(config) {
    return config.map(group => ({
      ...group,
      fields: group.fields.map(field => {
        // Solo asignar color si hay colores disponibles
        const color = colorPalette[colorIndex % colorPalette.length];
        const fieldWithColor = { ...field, color };
        colorIndex++;
        return fieldWithColor;
      })
    }));
  }

  const config = assignColors([
    {
      title: 'Filtros de empresa',
      fields: [
        { name: 'rif', type: 'text', label: 'RIF', placeholder: 'RIF', pattern: '^[A-Za-z0-9]+$', errorMessage: 'Solo letras y números' },
        { name: 'nombre_empresa', type: 'text', label: 'Nombre Empresa', placeholder: 'Nombre de la empresa', pattern: '^[A-Za-z0-9 ]+$', errorMessage: 'Solo letras y números y espacios' },
        { name: 'id_tipo_actividad_empresarial', type: 'select', label: 'Tipo Actividad Empresarial', placeholder: 'Seleccione tipo', options: tipoActividadOptions },
        { name: 'id_tipo_propiedad', type: 'select', label: 'Tipo de Propiedad', placeholder: 'Seleccione propiedad', options: tipoPropiedadOptions },
        { name: 'id_pais', type: 'select', label: 'País', placeholder: 'Seleccione país', options: paisesOptions },
        { name: 'id_estado', type: 'select', label: 'Estado', placeholder: 'Seleccione estado', options: estadosOptions },
        { name: 'id_municipio', type: 'select', label: 'Municipio', placeholder: 'Seleccione municipio', options: municipiosOptions },
        { name: 'id_parroquia', type: 'select', label: 'Parroquia', placeholder: 'Seleccione parroquia', options: parroquiasOptions },
        /* { name: 'created_user_from', type: 'date', label: 'Fecha Creación Desde', placeholder: 'Desde' },
        { name: 'created_user_to', type: 'date', label: 'Fecha Creación Hasta', placeholder: 'Hasta' }, */
      ],
    },
    {
      title: 'Filtros de eventos',
      fields: [
        { name: 'id_evento', type: 'select', label: 'Evento', placeholder: 'Seleccione evento', options: eventosOptions },
        /* { name: 'id_tipo_participacion', type: 'select', label: 'Tipo de Participación', placeholder: 'Seleccione participación', options: tipoParticipacion }, */
      ],
    },
    {
      title: 'Filtros de actividades',
      fields: [
        { name: 'id_actividad_economica', type: 'select', label: 'Actividad Económica', placeholder: 'Seleccione actividad', options: actividadEconomicaOptions },
        { name: 'id_sector_productivo', type: 'select', label: 'Sector Productivo', placeholder: 'Seleccione sector', options: sectorProductivoOptions },
        { name: 'id_sub_sector_productivo', type: 'select', label: 'Sub-sector Productivo', placeholder: 'Seleccione sub-sector', options: subSectorProductivoOptions },
      ],
    },
    {
      title: 'Filtros de producto',
      fields: [
        { name: 'codigo_arancelario', type: 'text', label: 'Código Arancelario', placeholder: 'Código', pattern: '^[0-9.]+$', errorMessage: 'Solo números y puntos' },
      ],
    },
    /*   {
      title: 'Filtros de usuarios',
      fields: [
        { name: 'id_role', type: 'select', label: 'Rol', placeholder: 'Seleccione rol', options: roles },
      ],
    }, */
  ]);

  // Retornar config y setters para uso externo
  return { config, setSelectedEstado, setSelectedMunicipio, setSelectedActividad, setSelectedSector };
};
