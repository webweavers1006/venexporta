import React from 'react';
import PropTypes from 'prop-types';
import AtomsPanel from '@components/atoms/AtomsPanel';
import { Modal, message } from 'antd';
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import { deleteEventByCompany } from '@src/lib/api/apiIndex';
import { Calendar1, SquareX } from 'lucide-react';
import MoleculesList from '@components/molecules/MoleculesList';
import useMyEventsData from './hooks/useMyEventsData';

//✅Components traduction
import { useTranslation } from "react-i18next";
/**
 * Componente para mostrar y gestionar los eventos registrados de una empresa.
 * @component
 * @example
 * <MyFeedEvent />
 */
function MyFeedEvent() {
  // Traducción
  const { t } = useTranslation();
  const idCompany = useStore(appStore, state => state.idCompany);
  const { eventsData, reloadEvents, loading, error } = useMyEventsData(idCompany);

  /**
   * Muestra un modal de confirmación y elimina la participación en el evento si se confirma.
   * @param {string|number} id - ID del evento a eliminar.
   */
  const handleDelete = async (id) => {
    Modal.confirm({
      title: t("myEvents.modal.title"),
      content: t("myEvents.modal.content"),
      okText: t("myEvents.modal.ok"),
      cancelText: t("myEvents.modal.cancel"),
      okButtonProps: { 'aria-label':  t("myEvents.modal.okAria") },
      cancelButtonProps: { 'aria-label': t("myEvents.modal.cancelAria") },
      onOk: async () => {
        try {
          await deleteEventByCompany(id);
          message.success(t("myEvents.success"));
          reloadEvents();
        } catch (error) {
          message.error(error?.response?.data?.error?.message || t("myEvents.error"));
        }
      },
    });
  };


  return (
    <section aria-labelledby="my-events-title">
      <AtomsPanel
        title={t("myEvents.title")}

        subtitle={t("myEvents.subtitle")}

      />
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
              alt={`Imagen del evento ${item.nombre_evento}`}
              src={item.img_evento}
              role="img"
            />
          )}
          renderItemMeta={(item) => ({
            avatar: (
              <p className='bg-primary p-3 rounded-full' role="presentation">
                <Calendar1 color="#b2e713" aria-label="Ícono de calendario" />
              </p>
            ),
            title: <p>{item.nombre_evento}</p>,
            description: (
              <>
                <p>{t("myEvents.description")}: {item.descripcion_evento}</p>
                <p>{t("myEvents.eventDuration")}: {item.fecha_inicio} - {item.fecha_final}</p>
                <p>{t("myEvents.registrationDuration")}: {item.fecha_inicial_inscripcion} - {item.fecha_final_inscripcion}</p>
              </>
            ),
          })}
          actions={[{
            type: 'delete',
            label: t("myEvents.cancelButton"),
            icon: <SquareX aria-label={t("myEvents.cancelIconAria")} />,
            className: "bg-zinc-300 text-black hover:text-black hover:bg-zinc-400/75",
            role: 'button',
            'aria-label': t("myEvents.cancelAria"),
            tabIndex: 0,
          }]}
          loading={loading}
          error={error}
        />
      </div>
    </section>
  );
}

MyFeedEvent.propTypes = {};
// ...eliminado: export default MyEvents;
export default MyFeedEvent;