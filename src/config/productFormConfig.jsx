import ImageUpload from '../components/molecules/upload/MoleculesImageUpload';
import appStore from '../store/appStore';
import { estados } from '@lib/data/estados';
import { fetchUnidadesMedida } from '../lib/api/apiIndex';

const productFormConfig = (categories = [], unidadesMedida = [], rangoTiempos = []) => ({
  img: {
    type: 'custom',
    name: 'img',
    component: ImageUpload,
    props: {
      companyId: appStore.getState().idCompany,
      fileType: ['image/jpeg', 'image/png'],
      fileNameType: 'JPEG o PNG',
      fileNumber: 1,
    },
    value: null,
  },
  nombre_producto: {
    type: 'input',
    label: 'Nombre del producto',
    name: 'nombre_producto',
    value: '',
  },
  categoria_producto: {
    type: "combobox", // Cambiado a combobox
    label: "Categoría de producto",
    name: "categoria_producto",
    options: [{ value: "add_category", label: "Agrega Categoría" }], // Opciones dinámicas
    value: "",
  },
  id_tipo_unidad_presentacion_producto: {
    type: 'select',
    label: 'Presentación de producto (Unidad)',
    name: 'id_tipo_unidad_presentacion_producto',
    options: unidadesMedida.map((unidad) => ({
      value: unidad.id,
      label: unidad.unidad_de_medida,
    })),
    value: '',
  },
  unidad_producto: {
    type: 'input',
    label: 'Presentación de producto (Cantidad)',
    name: 'unidad_producto',
    value: '',
  },
  id_capacidad_exportacion_producto: {
    type: 'select',
    label: 'Capacidad de exportación (Unidad)',
    name: 'id_capacidad_exportacion_producto',
    options: unidadesMedida.map((unidad) => ({
      value: unidad.id,
      label: unidad.unidad_de_medida,
    })),
    value: '',
  },
  capacidad_exportacion: {
    type: 'input',
    label: 'Capacidad de exportación (Cantidad)',
    name: 'capacidad_exportacion',
    value: '',
  },
  id_rango_tiempo_export: {
    type: 'select',
    label: 'Rango de tiempo de exportación',
    name: 'id_rango_tiempo_export',
    options: rangoTiempos.map((rango) => ({
      value: rango.id,
      label: rango.rango_de_tiempo,
    })),
    value: '',
  },
  id_estado: {
    type: 'select',
    label: 'Estado de produccion',
    name: 'id_estado',
    options: estados.map((estado) => ({ value: estado.id, label: estado.estado })),
    value: '',
  },
  id_municipio: {
    type: 'select',
    label: 'Municipio de produccion',
    name: 'id_municipio',
    options: [],
    value: '',
  },
  id_parroquia: {
    type: 'select',
    label: 'Parroquia de produccion',
    name: 'id_parroquia',
    options: [],
    value: '',
  },
  direccion: {
    type: 'input',
    label: 'Dirección',
    name: 'direccion',
    value: '',
    fullWidth: true,
  },
  id_unidad_cap_produccion: {
    type: 'select',
    label: 'Capacidad de produccion (Unidad)',
    name: 'id_unidad_cap_produccion',
    options: unidadesMedida.map((unidad) => ({
      value: unidad.id,
      label: unidad.unidad_de_medida,
    })),
    value: '',
  },
  cap_produccion: {
    type: 'input',
    label: 'Capacidad de produccion (Cantidad)',
    name: 'cap_produccion',
    value: '',
  }
});

export default productFormConfig;
