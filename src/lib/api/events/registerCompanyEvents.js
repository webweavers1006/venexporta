import { Modal, message } from 'antd';
import { registerForEvent } from '../../lib/api/apiUser';

export const registerCompanyEvents = async (id_empresa, id) => {
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
                await registerForEvent(id_empresa, id);
                message.success('Registrado exitosamente en el evento');
            } catch (error) {
                message.error(error);
            }
        },
    });
};