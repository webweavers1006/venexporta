import React from 'react';
import { Button, Modal, message } from 'antd';
import { deleteEventByCompany } from '@src/lib/api/apiIndex';

const handleDelete = async (id, loadEventsData) => {
  Modal.confirm({
    title: 'Confirmación',
    content: '¿Seguro que quiere cancelar su participación del evento?',
    okText: 'Aceptar',
    cancelText: 'No',
    onOk: async () => {
      try {
        await deleteEventByCompany(id);
        message.success('Ha cancelado su participación del evento');
        loadEventsData();
      } catch (error) {
        message.error('Error al salir del evento');
      }
    },
  });
};

const RegisterButton = React.memo(({ handleRegister, idCompany, id }) => (
    <Button
        type="primary"
        className='bg-primary text-white hover:bg-primary-light'
        onClick={() => handleRegister(id, idCompany)}
    >
        Registrarse
    </Button>
));

const getEventNameColumn = () => ({
    title: 'Nombre del Evento',
    dataIndex: 'nombre_evento',
    key: 'nombre_evento',
    filters: [
        { text: 'Evento A', value: 'Evento A' },
        { text: 'Evento B', value: 'Evento B' },
        // Agrega más filtros según sea necesario
    ],
    onFilter: (value, record) => record.nombre_evento.includes(value),
    sorter: (a, b) => a.nombre_evento.localeCompare(b.nombre_evento),
});

const getStartDateColumn = () => ({
    title: 'Fecha de Inicio',
    dataIndex: 'fecha_inicio',
    key: 'fecha_inicio',
    sorter: (a, b) => new Date(a.fecha_inicio) - new Date(b.fecha_inicio),
});

const getNameColumn = () => ({
    title: 'Nombre Empresa',
    dataIndex: 'nombre_empresa',
    key: 'nombre_empresa',
});

const getEndDateColumn = () => ({
    title: 'Fecha Final',
    dataIndex: 'fecha_final',
    key: 'fecha_final',
    sorter: (a, b) => new Date(a.fecha_final) - new Date(b.fecha_final),
});

const getActionsColumn = (handleRegister, idCompany, loadEventsData) => ({
    title: 'Acciones',
    key: 'acciones',
    render: (text, record) => (
        <>
            <Button
                type="primary"
                danger
                onClick={() => handleDelete(record.id, loadEventsData)}
            >
                Cancelar
            </Button>
        </>
    ),
});

const columns = (handleRegister, idCompany, loadEventsData) => [
    getEventNameColumn(),
    getNameColumn(),
    getStartDateColumn(),
    getEndDateColumn(),
    getActionsColumn(handleRegister, idCompany, loadEventsData),
];

export default columns;