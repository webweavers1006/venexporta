import React from 'react';
import { Button } from 'antd';

const RegisterButton = React.memo(({ handleRegister, idCompany, id }) => (
    <Button
        type="primary"
        className='bg-primary text-white hover:bg-primary-light'
        onClick={() => handleRegister(id, idCompany)}
    >
        Registrarse
    </Button>
));

const columns = (handleRegister, idCompany) => [
    {
        title: 'Nombre del Evento',
        dataIndex: 'nombre_evento',
        key: 'nombre_evento',
    },
    {
        title: 'Acciones',
        key: 'acciones',
        render: (_, record) => (
            <Button
                type="primary"
                onClick={() => handleRegister(record.idCompany, record.id)}
            >
                Registrarse
            </Button>
        ),
    },
];

export default columns;