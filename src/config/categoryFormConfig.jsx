const categoryFormConfig = (activities = [], sectors = [], subSectors = []) => ({
  nombre: {
    type: 'input',
    label: 'Nombre',
    name: 'nombre',
    placeholder: 'Ingrese el nombre',
    value: '',
    fullWidth: false, // No ocupa el 100% del ancho
  },
  codigo_arancelario: {
    type: 'input',
    label: 'Código Arancelario',
    name: 'codigo_arancelario',
    placeholder: 'Ingrese el código arancelario',
    value: '',
    fullWidth: false,
  },
  id_actividad_economica: {
    type: 'select',
    label: 'Actividad Económica',
    name: 'id_actividad_economica',
    options: activities.map((activity) => ({
      value: activity.id,
      label: activity.actividad_economica,
    })),
    placeholder: 'Seleccione una actividad económica',
    value: '',
    fullWidth: false,
  },
  id_sector_productivo: {
    type: 'select',
    label: 'Sector Productivo',
    name: 'id_sector_productivo',
    options: sectors.map((sector) => ({
      value: sector.id,
      label: sector.sector_productivo,
    })),
    placeholder: 'Seleccione un sector productivo',
    value: '',
    fullWidth: false,
  },
  id_sub_sector_productivo: {
    type: 'select',
    label: 'Sub-Sector Productivo',
    name: 'id_sub_sector_productivo',
    options: subSectors.map((subSector) => ({
      value: subSector.id,
      label: subSector.sub_sector_productivo,
    })),
    placeholder: 'Seleccione un sub-sector productivo',
    value: '',
    fullWidth: true, // Ocupa el 100% del ancho
  },
});

export default categoryFormConfig;
