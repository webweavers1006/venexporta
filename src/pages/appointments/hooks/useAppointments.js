import { useState, useEffect, useCallback } from "react";
import { updateAppointmentStatus, fetchRequestedAppointments } from '@src/lib/api/schedules/schedules';
import { deleteAppointment } from '@src/lib/api/schedules/schedules';
import { message } from "antd";

/**
 * Hook para gestionar la lógica de citas recibidas y enviadas.
 * @param {Object} params
 * @param {string|number} params.idCompany - ID de la empresa.
 * @param {"received"|"sent"} params.type - Tipo de citas: 'received' o 'sent'.
 * @returns {Object} Estado y acciones para las citas.
 */
export function useAppointments({ idCompany, type }) {
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAppointmentsData = useCallback(async () => {
    setLoading(true);
    try {
      const tipo = type === "received" ? 2 : 1;
      const data = await fetchRequestedAppointments(idCompany, tipo);
      setAppointmentsData(data);
    } catch (error) {
      message.error("Error al obtener las citas");
    } finally {
      setLoading(false);
    }
  }, [idCompany, type]);

  useEffect(() => {
    if (idCompany) loadAppointmentsData();
  }, [idCompany, loadAppointmentsData]);

  // Acciones para received
  const handleAppointmentAction = useCallback(async (id, status, id_empresa_receptora, id_empresa_solicitante, fecha_solicitada) => {
    try {
      const response = await updateAppointmentStatus(id, status, id_empresa_receptora, id_empresa_solicitante, fecha_solicitada);
      if (response.datosNuevos) {
        message.success(status === 1 ? "Cita aceptada exitosamente" : "Cita rechazada exitosamente");
      } else {
        message.error("Hubo un problema al procesar la solicitud");
      }
    } catch (error) {
      message.error(error?.response?.data?.error?.message || "Error al actualizar el estado de la cita");
    } finally {
      loadAppointmentsData();
    }
  }, [loadAppointmentsData]);

  // Acción para sent
  const handleCancelAppointment = useCallback(async (id) => {
    try {
      await deleteAppointment(id);
      message.success("Cita cancelada exitosamente");
    } catch (error) {
      message.error("Error al cancelar la cita");
    } finally {
      loadAppointmentsData();
    }
  }, [loadAppointmentsData]);

  return {
    appointmentsData,
    loading,
    loadAppointmentsData,
    handleAppointmentAction: type === "received" ? handleAppointmentAction : undefined,
    handleCancelAppointment: type === "sent" ? handleCancelAppointment : undefined,
  };
}
