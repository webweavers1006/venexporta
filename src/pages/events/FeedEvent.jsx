
import React, { useEffect, useState, lazy } from 'react';
import PropTypes from 'prop-types';
import { Modal, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Calendar1, SquareCheckBig } from 'lucide-react';
import MoleculesList from '@components/molecules/MoleculesList';
import { fetchEventos, registerForEvent } from '@lib/api/apiIndex';
import appStore from '@store/appStore';
import { useStore } from 'zustand';

import useFeedEvent from './hooks/useFeedEvent';

const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));

/**
 * Componente FeedEvent
 * @component
 * @description Muestra el listado de eventos disponibles y permite el registro de la empresa en un evento.
 * @example
 * <FeedEvent />
 */

const FeedEvent = () => {
  const idCompany = useStore(appStore, state => state.idCompany);
  const idPais = useStore(appStore, state => state.idPais);
  const navigate = useNavigate();
  const { eventData, fetchAndSetEventos, handleRegister } = useFeedEvent({ idCompany, idPais, navigate });

  useEffect(() => {
    fetchAndSetEventos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              alt={`Logo del evento ${item.nombre_evento}`}
              src={item.img_evento}
              role='img'
              aria-label={`Logo del evento ${item.nombre_evento}`}
            />
          )}
          renderItemMeta={(item) => ({
            avatar: (
              <p className='bg-primary p-3 rounded-full' aria-label='Ícono de calendario'>
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
            icon: <SquareCheckBig aria-label='Icono registrar' />,
            className: 'bg-green/50 text-primary hover:bg-green/80',
            'aria-label': 'Registrarse en evento',
            tabIndex: 0,
          }]}
        />
      </div>
    </>
  );
};

FeedEvent.propTypes = {
  // No recibe props actualmente, pero se deja preparado para extensión futura
};

export default FeedEvent;