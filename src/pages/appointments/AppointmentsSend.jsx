import React from "react";
import PropTypes from "prop-types";
import AtomsPanel from "@components/atoms/AtomsPanel";
import { useStore } from "zustand";
import appStore from "@store/appStore";
import { Image } from "antd";
import { Calendar1, SquareCheckBig } from "lucide-react";
import { Link } from "react-router";
import MoleculesList from "@components/molecules/MoleculesList";
import { useAppointments } from "./hooks/useAppointments";
import { getCompanyImage } from "./helpers/image";


/**
 * @file AppointmentsSend.jsx
 * @description Muestra la lista de citas enviadas y permite cancelarlas.
 * @component
 * @example
 * <AppointmentsSend />
 */
const AppointmentsSend = () => {
  const idCompany = useStore(appStore, (state) => state.idCompany);
  const {
    appointmentsData,
    handleCancelAppointment,
    loading
  } = useAppointments({ idCompany, type: "sent" });

  return (
    <>
      <AtomsPanel title="Mis Citas" subtitle="Información de las citas enviadas" />
      <div className="mt-4">
        <MoleculesList
          data={appointmentsData}
          loading={loading}
          onFilterChange={() => {}}
          onActionClick={(actionType, item) => {
            if (actionType === "cancel") {
              handleCancelAppointment(item.id);
            }
          }}
          renderItemExtra={(item) => (
            <Image
              width={200}
              className="mask mask-squircle"
              src={getCompanyImage(item.img_empresa_receptora)}
              alt={`Logo de ${item.empresa_receptora}`}
              aria-label={`Logo de ${item.empresa_receptora}`}
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
                to={`/roundtable/companies/${item.id_empresa_receptora}/${item.id_evento}/false`}
                tabIndex={0}
                aria-label={`Ver empresa ${item.empresa_receptora}`}
              >
                {item.empresa_receptora}
              </Link>
            ),
            description: (
              <>
                <p>Evento: {item.evento}</p>
                <p>Fecha Solicitada: {item.fecha_solicitada}</p>
                <p>Estatus: {item.estatus}</p>
              </>
            ),
          })}
          actions={(item) =>
            ["ACEPTADO", "RECHAZADO"].includes(item.estatus)
              ? []
              : [
                  {
                    type: "cancel",
                    label: "Cancelar",
                    icon: <SquareCheckBig />,
                    className: "bg-green/50 text-primary hover:bg-green/80",
                    "aria-label": "Cancelar cita",
                    tabIndex: 0,
                  },
                ]
          }
        />
      </div>
    </>
  );
};

AppointmentsSend.propTypes = {};

export default AppointmentsSend;