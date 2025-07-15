import { useState, useEffect } from 'react';
import AtomsPanel from '@components/atoms/AtomsPanel';
import { Modal, message } from 'antd';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import { getConfigTable } from "../events/config/configMyEventTable";
import { fetchEventosByEmpresas } from '@src/lib/api/apiUser';
import { deleteEventByCompany } from '@src/lib/api/apiUser';
import { Calendar1, SquareX } from 'lucide-react';
import { Button as ButtonShacdn } from "@components/ui/button";
import MoleculesList from "@components/molecules/MoleculesList";

const MyEvents = () => {  
  const idCompany = useStore(appStore, state => state.idCompany);
  const [eventsData, setEventsData] = useState([]);

  const loadEventsData = async () => {
    try {
      const data = await fetchEventosByEmpresas(idCompany);
      setEventsData(data);
    } catch (error) {
      console.error('Error fetching events data:', error);
    }
  };

  useEffect(() => {
    loadEventsData();
  }, [idCompany]);

  const configTable = getConfigTable(eventsData, idCompany, loadEventsData);

  const handleDelete = async (id) => {
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
          message.error(error.response.data.error.message);
        }
      },
    });
  };

  return (
    <>
      <AtomsPanel title={'Mis Eventos'} subtitle={'Información de los eventos registrados'} />
      <div className='mt-4'>
        <MoleculesList
          data={eventsData}
          filters={{ activityOptions: [], subSectorOptions: [], codeValue: '' }}
          onFilterChange={() => {}}
          onActionClick={(actionType, item) => {
            if (actionType === 'delete') handleDelete(item.id);
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
            type: 'delete',
            label: 'Cancelar',
            icon: <SquareX />,
            className: "bg-zinc-300 text-black hover:text-black hover:bg-zinc-400/75",
          }]}
        />
      </div>
      
    </>
  );
};

export default MyEvents;