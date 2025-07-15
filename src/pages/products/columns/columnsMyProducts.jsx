import { Button } from 'antd';
import { handleDeleteProduct } from '../handlers/handlersMyProducts';

const columns = (loadProductsData) => [
  {
    title: 'Nombre del Producto',
    dataIndex: 'nombre_producto',
    key: 'nombre_producto',
  },
  {
    title: 'Codigo Arancelario',
    dataIndex: 'codigo_arancelario',
    key: 'descripcion',
  },
  {
    title: 'Capitulo',
    dataIndex: 'capitulo',
    responsive: ['md'],
    key: 'descripcion',
  },
  {
    title: 'Capacidad de producción',
    key: 'descripcion',
    responsive: ['md'],
    render: (text, record) => `${record.cap_produccion} ${record.ucp}`,
  },
  {
    title: 'Acciones',
    key: 'acciones',
    render: (text, record) => (
      <Button type="primary" danger onClick={() => handleDeleteProduct(record.id, loadProductsData)}>
        Eliminar
      </Button>
    ),
  },
];

export default columns;
