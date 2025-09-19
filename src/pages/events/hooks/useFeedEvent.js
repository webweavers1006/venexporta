/**
 * Hook personalizado para la lógica de FeedEvent: fetch y registro de eventos.
 * @module useFeedEvent
 * @example
 * const { eventData, handleRegister } = useFeedEvent();
 */
import { useState, useCallback } from 'react';
import { Modal, message } from 'antd';
import { fetchEventos, registerForEvent } from '@lib/api/apiIndex';

//✅Components traduction
import { useTranslation } from "react-i18next";


/**
 * Hook para manejar la lógica de eventos y registro en FeedEvent.
 * @param {Object} params
 * @param {string|number} idCompany - ID de la empresa
 * @param {string|number} idPais - ID del país
 * @param {function} navigate - Función de navegación (react-router)
 * @returns {{ eventData: Array, fetchAndSetEventos: Function, handleRegister: Function }}
 */
function useFeedEvent({ idCompany, idPais, navigate }) {
  // Traducción
    const { t } = useTranslation();
  const [eventData, setEventData] = useState([]);

  /**
   * Fetch de eventos y seteo de estado.
   */
  const fetchAndSetEventos = useCallback(async () => {
    try {
      const eventos = await fetchEventos();
      setEventData(eventos);
    } catch (error) {
      setEventData([]);
      // eslint-disable-next-line no-console
      console.error('Error fetching data:', error);
    }
  }, []);

  /**
   * Muestra modal de éxito y redirige según país.
   */
  const showFullScreenModal = useCallback(() => {
    const config = {
      status: 'success',
      title: t("feedEvent.modal.successTitle"),
      subtitle:
        t("feedEvent.modal.successContent"),
      links: [],
    };
    Modal.success({
      title: config.title,
      content: config.subtitle,
      okText: t("close"),
      onOk: () => {
        if (idPais !== 95) {
          navigate('/roundtable/companies');
        } else {
          navigate('/myevent/feed');
        }
      },
    });
  }, [idPais, navigate]);

  /**
   * Maneja el registro a un evento mostrando confirmación y feedback.
   * @param {number|string} id - ID del evento
   */
  const handleRegister = useCallback((id) => {
    Modal.confirm({
      title: t("feedEvent.modal.confirmTitle"),
      content: t("feedEvent.modal.confirmContent"),
      okText: t("feedEvent.modal.ok"),
      cancelText: t("feedEvent.modal.cancel"),
      okButtonProps: {
        style: { backgroundColor: '#2D044A', borderColor: '#2D044A' },
      },
      onOk: async () => {
        try {
          await registerForEvent(id, idCompany);
          message.success(t("feedEvent.message.success"));
          showFullScreenModal();
        } catch (error) {
          message.error(error?.response?.data?.error?.message || t("feedEvent.message.error"));
        }
      },
    });
  }, [idCompany, showFullScreenModal]);

  return {
    eventData,
    fetchAndSetEventos,
    handleRegister,
  };
}

export default useFeedEvent;
