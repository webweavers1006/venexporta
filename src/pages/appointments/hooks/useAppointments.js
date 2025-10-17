import { useState, useEffect, useCallback } from "react";
import { updateAppointmentStatus, fetchRequestedAppointments } from '@src/lib/api/schedules/schedules';
import { deleteAppointment } from '@src/lib/api/schedules/schedules';
import { message } from "antd";

//✅Components traduction
import { useTranslation } from "react-i18next";


/**
 * Hook para gestionar la lógica de citas recibidas y enviadas.
 * @param {Object} params
 * @param {string|number} params.idCompany - ID de la empresa.
 * @param {"received"|"sent"} params.type - Tipo de citas: 'received' o 'sent'.
 * @returns {Object} Estado y acciones para las citas.
 */
export function useAppointments({ idCompany, type }) {
  // Traducción
  const { t } = useTranslation();
  const [appointmentsData, setAppointmentsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadAppointmentsData = useCallback(async () => {
    setLoading(true);
    try {
      const tipo = type === "received" ? 2 : 1;
      const data = await fetchRequestedAppointments(idCompany, tipo);
      setAppointmentsData(data);
    } catch (error) {
      message.error(t("appointments.errorLoading"));
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
        message.success(status === 1 ? t("appointments.acceptSuccess") : t("appointments.rejectSuccess") );

      } else {
        message.error(t("appointments.processingError"));
      }
    } catch (error) {
      message.error(error?.response?.data?.error?.message || t("appointments.updateError"));
    } finally {
      loadAppointmentsData();
    }
  }, [loadAppointmentsData]);

  // Acción para sent
  const handleCancelAppointment = useCallback(async (id) => {
    try {
      await deleteAppointment(id);
      message.success(t("appointments.cancelSuccess"));
    } catch (error) {
      message.error(t("appointments.cancelError"));
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
