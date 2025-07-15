import React from 'react';
import { Button, Modal, message } from 'antd';
import { deleteActivityByCompany } from '@src/lib/api/apiUser';

const handleDelete = async (id, loadActivitiesData) => {
  Modal.confirm({
    title: 'Confirmación',
    content: '¿Está seguro de que desea eliminar esta actividad?',
    okText: 'Sí',
    cancelText: 'No',
    onOk: async () => {
      try {
        await deleteActivityByCompany(id);
        message.success('La actividad se ha eliminado correctamente');
        loadActivitiesData();
      } catch (error) {
        message.error('Error al eliminar la actividad');
      }
    },
  });
};

const getActivitiesColumn = () => ({
  title: 'Actividad Economica',
  dataIndex: 'actividad_economica',
  key: 'actividad',
  sorter: (a, b) => a.actividad_economica.localeCompare(b.actividad_economica),
});

const getSectorColumn = () => ({
  title: 'Sector Productivo',
  dataIndex: 'sector_productivo',
  responsive: ['md'],
  key: 'sector_productivo',
  sorter: (a, b) => a.sector_productivo.localeCompare(b.sector_productivo),
});

const getSubActivtiesColumn = () => ({
  title: 'Sub Sector Productivo',
  dataIndex: 'sub_sector_productivo',
  responsive: ['md'],
  key: 'sub_sector_productivo',
  sorter: (a, b) => a.sub_sector_productivo.localeCompare(b.sub_sector_productivo),
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
  getSubActivtiesColumn(),
  getActionsColumn(loadActivitiesData),
];

export default columns;