import React from 'react';
import { Modal, message } from 'antd';
import { useNavigate } from 'react-router';
import { registerForEvent } from '@lib/api/apiIndex';
import ResultComponent from '@components/molecules/result/MoleculesResult';

export const handleRegister = async (idCompany, id, navigate) => {

    Modal.confirm({
        title: 'Confirmación',
        content: '¿Desea registrarse en este evento?',
        okText: 'Aceptar',
        cancelText: 'No',
        okButtonProps: {
            style: { backgroundColor: '#2D044A', borderColor: '#2D044A' }, // Cambia el color aquí
        },
        onOk: async () => {
            try {
                await registerForEvent(idCompany, id);
                message.success('Registrado exitosamente en el evento');
                showFullScreenModal(navigate);
            } catch (error) {
                message.error(error.response.data.error.message);
            }
        },
    });
};

const showFullScreenModal = (navigate) => {
    const config = {
        status: 'success',
        title: '¡Registro Exitoso!',
        subtitle: 'Gracias por confirmar tu interés en participar, en los próximos días se les notificará a través de la aplicación información de la siguiente etapa de la ruta para la feria!',
        links: [],
    };

    Modal.success({
        title: config.title,
        content: (
            <div>
                <p>{config.subtitle}</p>
            </div>
        ),
        okText: 'Cerrar',
        onOk: () => {
            navigate('/myevent/feed'); // Redirigir a la ruta 'myevent/feed'
        },
    });
};