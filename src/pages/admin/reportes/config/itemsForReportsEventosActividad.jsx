// Archivo de configuración de campos para MoleculesItemsForReports en ReportesDinamicos
// Cada objeto representa un campo seleccionable en el reporte dinámico


// Orden actualizado según lo solicitado, pero manteniendo las propiedades originales
export const itemsForReports = [
  {
    id: 'nombre_empresa',
    key: 'evento-nombre_empresa',
    label: 'Nombre de la Empresa',
    checked: true,
    description: 'Nombre legal o comercial de la empresa.',
    show: false
  },
  {
    id: 'rif',
    key: 'evento-rif',
    label: 'RIF',
    checked: true,
    description: 'Registro de Información Fiscal de la empresa.',
    show: false
  },
  {
    id: 'contacto_nombre',
    key: 'evento-contacto_nombre',
    label: 'Nombre del Contacto',
    checked: true,
    description: 'Nombre completo del contacto principal de la empresa.',
    show: false
  },
  {
    id: 'contacto_correo',
    key: 'evento-contacto_correo',
    label: 'Correo de Contacto',
    checked: true,
    description: 'Correo electrónico del contacto principal de la empresa.',
    show: false
  },
  {
    id: 'contacto_telefono',
    key: 'evento-contacto_telefono',
    label: 'Teléfono de Contacto',
    checked: true,
    description: 'Teléfono del contacto principal de la empresa.',
    show: false
  },
  {
    id: 'pais',
    key: 'evento-pais',
    label: 'País',
    checked: true,
    description: 'País de la empresa.',
    show: false
  },
  {
    id: 'nombre_evento',
    key: 'evento-nombre_evento',
    label: 'Nombre del Evento',
    checked: true,
    description: 'Nombre del evento en el que participa la empresa.',
    show: true
  },
  {
    id: 'nombre_actividad_economica',
    key: 'evento-nombre_actividad_economica',
    label: 'Actividad Económica',
    checked: true,
    description: 'Nombre de la actividad económica principal.',
    show: true
  },
  {
    id: 'nombre_sector_productivo',
    key: 'evento-nombre_sector_productivo',
    label: 'Sector Productivo',
    checked: true,
    description: 'Nombre del sector productivo al que pertenece la empresa.',
    show: true
  },
  {
    id: 'nombre_sub_sector_productivo',
    key: 'evento-nombre_sub_sector_productivo',
    label: 'Subsector Productivo',
    checked: true,
    description: 'Nombre del subsector productivo.',
    show: true
  },
  {
    id: 'created_user',
    key: 'evento-created_user',
    label: 'Fecha de Registro de la empresa',
    checked: false,
    description: 'Fecha en la que la empresa fue registrada.',
    show: true
  }
];


export default itemsForReports;
