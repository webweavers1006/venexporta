import React from "react";
import PropTypes from "prop-types";
import AtomsPanel from "@components/atoms/AtomsPanel";
import { useStore } from "zustand";
import appStore from "@store/appStore";
import { Image } from "antd";
import { Calendar1, SquareX, SquareCheckBig } from "lucide-react";
import { Link } from "react-router";
import MoleculesList from "@components/molecules/MoleculesList";
import { useAppointments } from "./hooks/useAppointments";
import { getCompanyImage } from "./helpers/image";

//✅Components traduction
import { useTranslation } from "react-i18next";

/**
 * @file AppointmentsReceived.jsx
 * @description Muestra la lista de citas recibidas y permite aceptarlas o rechazarlas.
 * @component
 * @example
 * <AppointmentsReceived />
 */
const AppointmentsReceived = () => {
  // Traducción
    const { t } = useTranslation();
  const idCompany = useStore(appStore, (state) => state.idCompany);
  const {
    appointmentsData,
    handleAppointmentAction,
    loading
  } = useAppointments({ idCompany, type: "received" });

  return (
    <>
      <AtomsPanel title={t("appointmentsPanel.heading")} subtitle={t("appointmentsPanel.subheading")} />
      <div className="mt-4">
        <MoleculesList
          data={appointmentsData}
          loading={loading}
          onFilterChange={() => {}}
          onActionClick={(actionType, item) => {
            if (actionType === "reject") {
              handleAppointmentAction(
                item.id,
                2,
                item.id_empresa_receptora,
                item.id_empresa_solicitante,
                item.fecha_solicitada
              );
            } else if (actionType === "accept") {
              handleAppointmentAction(
                item.id,
                1,
                item.id_empresa_receptora,
                item.id_empresa_solicitante,
                item.fecha_solicitada
              );
            }
          }}
          renderItemExtra={(item) => (
            <Image
              width={200}
              className="mask mask-squircle"
              src={getCompanyImage(item.img_empresa_solicitante)}
              alt={`Logo de ${item.empresa_solicitante}`}
              aria-label={`Logo de ${item.empresa_solicitante}`}
            />
          )}
          renderItemMeta={(item) => ({
            avatar: (
              <p className="bg-primary p-3 rounded-full" role="img" aria-label="Calendario">
                <Calendar1 color="#b2e713" />
              </p>
            ),
            title: (
              <Link
                to={`/roundtable/companies/${item.id_empresa_solicitante}/${item.id_evento}/false`}
                tabIndex={0}
                aria-label={`Ver empresa ${item.empresa_solicitante}`}
              >
                {item.empresa_solicitante}
              </Link>
            ),
            description: (
              <>
                <p>{t("appointmentsPanel.event")}: {item.evento}</p>
                <p>{t("appointmentsPanel.requestedDate")}: {item.fecha_solicitada}</p>
                <p>{t("appointmentsPanel.status")}: {t(`appointmentStatus.${item.estatus.toLowerCase().replace(/\s/g, "_")}`)}</p>
              </>
            ),
          })}
          actions={(item) =>
            ["ACEPTADO", "RECHAZADO"].includes(item.estatus)
              ? []
              : [
                  {
                    type: "reject",
                    label: t("appointmentsPanel.reject"),
                    icon: <SquareX />,
                    className: "bg-zinc-300 text-black hover:text-black hover:bg-zinc-400/75",
                    "aria-label": t("appointmentsPanel.rejectAria"),
                    tabIndex: 0,
                  },
                  {
                    type: "accept",
                    label: "Aceptar",
                    icon: <SquareCheckBig />,
                    className: "bg-green/50 text-primary hover:bg-green/80",
                    "aria-label": t("appointmentsPanel.acceptAria"),
                    tabIndex: 0,
                  },
                ]
          }
        />
      </div>
    </>
  );
};

AppointmentsReceived.propTypes = {};

export default AppointmentsReceived;