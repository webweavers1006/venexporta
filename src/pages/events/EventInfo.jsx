import { useEffect, useState } from 'react';
import { Avatar, List, Button, Modal, message } from 'antd';
import { fetchEventos, registerForEvent } from '@lib/api/apiUser';
import { useNavigate } from 'react-router-dom';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import { Link } from 'react-router';
import { lazy } from 'react';
import { Calendar1 } from 'lucide-react';

const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));

const EventInfo = () => {
  const idCompany = useStore(appStore, state => state.idCompany);
  const setCurrentSection = appStore((state) => state.setCurrentSection);
  const [eventData, setEventData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventos = await fetchEventos();
        setEventData(eventos);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleRegister = async (id) => {
    console.log(idCompany, id);
    Modal.confirm({
        title: 'Confirmación',
        content: '¿Desea registrarse en este evento?',
        okText: 'Aceptar',
        cancelText: 'No',
        okButtonProps: {
            style: { backgroundColor: '#2D044A', borderColor: '#2D044A' },
        },
        onOk: async () => {
            try {
                await registerForEvent(id, idCompany);
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
            navigate('/myevent/feed');
        },
    });
};

  return (
    <>
        <AtomsPanel title={'Evento'} subtitle={'Información del evento'} />
    </>
  );
};

export default EventInfo;