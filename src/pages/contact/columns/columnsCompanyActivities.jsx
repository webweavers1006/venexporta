import React from 'react';
import { Button, Modal, message } from 'antd';
import { deleteContact } from '@src/lib/api/apiIndex';

const handleDelete = async (id, loadActivitiesData) => {
  Modal.confirm({
    title: 'Confirmación',
    content: '¿Está seguro de que desea eliminar este contacto?',
    okText: 'Sí',
    cancelText: 'No',
    onOk: async () => {
      try {
        await deleteContact(id);
        message.success('El contacto se ha eliminado correctamente');
        loadActivitiesData();
      } catch (error) {
        message.error('Error al eliminar el contacto');
      }
    },
  });
};

const getActivitiesColumn = () => ({
  title: 'Nombre',
  dataIndex: 'nombre',
  key: 'nombre',
  sorter: (a, b) => a.actividad_economica.localeCompare(b.actividad_economica),
});

const getSectorColumn = () => ({
  title: 'Correo',
  dataIndex: 'correo',
  responsive: ['md'],
  key: 'correo',
  sorter: (a, b) => a.sector_productivo.localeCompare(b.sector_productivo),
});

const getSubActivtiesColumn = () => ({
  title: 'Teléfono',
  dataIndex: 'telefono',
  responsive: ['md'],
  key: 'telefono',
  sorter: (a, b) => a.telefono.localeCompare(b.telefono),
});

const getCargoColumn = () => ({
  title: 'Puesto',
  dataIndex: 'cargo',
  responsive: ['md'],
  key: 'cargo',
  sorter: (a, b) => a.telefono.localeCompare(b.telefono),
});

const getActionsColumn = (loadActivitiesData) => ({
  title: 'Acciones',
  key: 'acciones',
  render: (text, record) => (
    <Button
      type="primary"
      danger
      onClick={() => handleDelete(record.id, loadActivitiesData)}
    >
      Borrar
    </Button>
  ),
});

const columns = (loadActivitiesData) => [
  getActivitiesColumn(),
  getSectorColumn(),
  getCargoColumn(),
  getSubActivtiesColumn(),
  getActionsColumn(loadActivitiesData),
];

export default columns;