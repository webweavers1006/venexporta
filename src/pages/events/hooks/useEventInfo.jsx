import { useEffect, useState, useCallback } from 'react';
import { fetchEventos, registerForEvent } from '@lib/api/apiIndex';
import { message, Modal } from 'antd';
import { useNavigate } from 'react-router-dom';
import appStore from '@store/appStore';
import { useStore } from 'zustand';

/**
 * Hook personalizado para manejar la lógica de eventos y registro de empresas en eventos.
 * @returns {Object} - Estado y funciones para manejar eventos y registro.
 */
export function useEventInfo() {
  const idCompany = useStore(appStore, state => state.idCompany);
  const [eventData, setEventData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventos = await fetchEventos();
        setEventData(eventos);
      } catch (error) {
        message.error('Error al obtener los eventos');
      }
    };
    fetchData();
  }, []);

  const showFullScreenModal = useCallback(() => {
    Modal.success({
      title: '¡Registro Exitoso!',
      content: (
        <div>
          <p>Gracias por confirmar tu interés en participar, en los próximos días se les notificará a través de la aplicación información de la siguiente etapa de la ruta para la feria!</p>
        </div>
      ),
      okText: 'Cerrar',
      onOk: () => {
        navigate('/myevent/feed');
      },
    });
  }, [navigate]);

  const handleRegister = useCallback(
    async (id) => {
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
            showFullScreenModal();
          } catch (error) {
            message.error(error?.response?.data?.error?.message || 'Error al registrarse');
          }
        },
      });
    },
    [idCompany, showFullScreenModal]
  );

  return {
    eventData,
    handleRegister,
  };
}
