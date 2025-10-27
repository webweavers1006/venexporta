import ImageUpload from '../components/molecules/upload/MoleculesImageUpload';
import appStore from '../store/appStore';

const eventFormConfig = () => ({
  img_evento: {
    type: 'custom',
    name: 'img_evento',
    component: ImageUpload,
    props: {
      companyId: appStore.getState().idCompany,
      fileType: ['image/jpeg', 'image/png'],
      fileNameType: 'JPEG o PNG',
      fileNumber: 1,
    },
    value: null, // opcional según el schema
  },
  nombre_evento: {
    type: 'input',
    label: 'Nombre del evento',
    name: 'nombre_evento',
    value: '',
  },
  lugar_evento: {
    type: 'input',
    label: 'Lugar del evento',
    name: 'lugar_evento',
    value: '',
  },
  fecha_inicio: {
    type: 'input',
    label: 'Fecha de inicio',
    name: 'fecha_inicio',
    inputType: 'date',
    value: '',
  },
  fecha_final: {
    type: 'input',
    label: 'Fecha final',
    name: 'fecha_final',
    inputType: 'date',
    value: '',
  },
  fecha_inicial_inscripcion: {
    type: 'input',
    label: 'Fecha inicial de inscripción',
    name: 'fecha_inicial_inscripcion',
    inputType: 'date',
    value: '',
  },
  fecha_final_inscripcion: {
    type: 'input',
    label: 'Fecha final de inscripción',
    name: 'fecha_final_inscripcion',
    inputType: 'date',
    value: '',
  },
  mostrar_rueda_negocios: {
    type: 'select',
    label: 'Mostrar rueda de negocios',
    name: 'mostrar_rueda_negocios',
    options: [
      { value: '1', label: 'Sí' },
      { value: '0', label: 'No' },
    ],
    value: '',
  },
  mostrar_citas: {
    type: 'select',
    label: 'Mostrar citas',
    name: 'mostrar_citas',
    options: [
      { value: '1', label: 'Sí' },
      { value: '0', label: 'No' },
    ],
    value: '',
  },
  descripcion_evento: {
    type: 'textarea',
    label: 'Descripción del evento',
    name: 'descripcion_evento',
    value: '',
    fullWidth: true,
    rows: 4,
  },
});

export default eventFormConfig;