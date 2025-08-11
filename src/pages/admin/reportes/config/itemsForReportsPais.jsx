// Archivo de configuración de campos para MoleculesItemsForReports en ReportesDinamicos
// Cada objeto representa un campo seleccionable en el reporte dinámico


// Orden actualizado según lo solicitado, pero manteniendo las propiedades originales
export const itemsForReports = [
{
    id: 'nombre_empresa',
    key: 'pais-nombre_empresa',
    label: 'Nombre de la Empresa',
    checked: true,
    description: 'Nombre legal o comercial de la empresa.',
    show: false
  },
  {
    id: 'rif',
    key: 'pais-rif',
    label: 'RIF',
    checked: true,
    description: 'Registro de Información Fiscal de la empresa.',
    show: false
  },
  {
    id: 'contacto_nombre',
    key: 'pais-contacto_nombre',
    label: 'Nombre del Contacto',
    checked: true,
    description: 'Nombre completo del contacto principal de la empresa.',
    show: false
  },
  {
    id: 'contacto_correo',
    key: 'pais-contacto_correo',
    label: 'Correo de Contacto',
    checked: true,
    description: 'Correo electrónico del contacto principal de la empresa.',
    show: false
  },
  {
    id: 'contacto_telefono',
    key: 'pais-contacto_telefono',
    label: 'Teléfono de Contacto',
    checked: true,
    description: 'Teléfono del contacto principal de la empresa.',
    show: false
  },
  {
    id: 'pais',
    key: 'pais-pais',
    label: 'País',
    checked: true,
    description: 'País de la empresa.',
    show: false
  },
  {
    id: 'estado',
    key: 'pais-estado',
    label: 'Estado',
    checked: true,
    description: 'Estado donde opera la empresa.',
    show: true
  },
  {
    id: 'municipio',
    key: 'pais-municipio',
    label: 'Municipio',
    checked: true,
    description: 'Municipio donde opera la empresa.',
    show: true
  },
  {
    id: 'parroquia',
    key: 'pais-parroquia',
    label: 'Parroquia',
    checked: true,
    description: 'Parroquia donde opera la empresa.',
    show: true
  },
  {
    id: 'created_user',
    key: 'pais-created_user',
    label: 'Fecha de Registro de la empresa',
    checked: false,
    description: 'Fecha en la que la empresa fue registrada.',
    show: true
  }
];


export default itemsForReports;
