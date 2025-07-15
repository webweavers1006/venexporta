import { useEffect, useState } from 'react';
import { Avatar, List, Button, Modal, message } from 'antd';
import { fetchEventos, registerForEvent } from '@lib/api/apiUser';
import { useNavigate } from 'react-router-dom';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import { lazy } from 'react';
import { Calendar1, SquareCheckBig } from 'lucide-react';
import MoleculesList from "@components/molecules/MoleculesList";

const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));

const Companies = () => {
  const idCompany = useStore(appStore, state => state.idCompany);
  const idPais = useStore(appStore, state => state.idPais);
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
            if (idPais !==95) {
                navigate('/roundtable/companies');
            }else {
                navigate('/myevent/feed');
            }
        },
    });
};

  return (
    <>
        <AtomsPanel title={'Eventos'} subtitle={'Listado de eventos'} />
        <div className='mt-4'>
            <MoleculesList
            data={eventData}
            filters={{ activityOptions: [], subSectorOptions: [], codeValue: '' }}
            onFilterChange={() => {}}
            onActionClick={(actionType, item) => {
            if (actionType === 'register') handleRegister(item.id);
            }}
            renderItemExtra={(item) => (
            <img
                width={272}
                className='mask mask-squircle size-25'
                alt="logo"
                src={item.img_evento}
            />
            )}
            renderItemMeta={(item) => ({
            avatar: (
                <p className='bg-primary p-3 rounded-full'>
                <Calendar1 color="#b2e713" />
                </p>
            ),
            title: <p>{item.nombre_evento}</p>,
            description: (
                <>
                <p>Descripción: {item.descripcion_evento}</p>
                <p>Duración del evento: {item.fecha_inicio} - {item.fecha_final}</p>
                <p>Duración de inscripción: {item.fecha_inicial_inscripcion} - {item.fecha_final_inscripcion}</p>
                </>
            ),
            })}
            actions={[{
            type: 'register',
            label: 'Registrarse',
            icon: <SquareCheckBig />,
            className: "bg-green/50 text-primary hover:bg-green/80",
            }]}
        />
        </div>
        
    </>
  );
};

export default Companies;