import { useState, useEffect } from "react";
import AtomsPanel from "@components/atoms/AtomsPanel";
import { useStore } from "zustand";
import appStore from "@store/appStore";
import { message, Image } from 'antd';
import { fetchRequestedAppointments, updateAppointmentStatus } from "@src/lib/api/apiUser";
import { Calendar1, SquareX, SquareCheckBig } from "lucide-react";
import { Link } from "react-router";
import MoleculesList from "@components/molecules/MoleculesList";

const AppointmentsReceived = () => {
  const idCompany = useStore(appStore, (state) => state.idCompany);
  const [appointmentsData, setAppointmentsData] = useState([]);

  const loadAppointmentsData = async () => {
    try {
      const data = await fetchRequestedAppointments(idCompany, 2);
      setAppointmentsData(data);
    } catch (error) {
      console.error("Error fetching appointments data:", error);
    }
  };

  const handleAppointmentAction = async (id, status, id_empresa_receptora, id_empresa_solicitante, fecha_solicitada) => {
    try {
      const response = await updateAppointmentStatus(id, status, id_empresa_receptora, id_empresa_solicitante, fecha_solicitada);
      if (response.datosNuevos) {
        message.success(status === 1 ? "Cita aceptada exitosamente" : "Cita rechazada exitosamente");
      } else {
        message.error("Hubo un problema al procesar la solicitud");
      }
    } catch (error) {
      console.error("Error al actualizar el estado de la cita:", error);
      message.error(error.response.data.error.message);
    } finally {
      loadAppointmentsData(); // Recargar datos siempre
    }
  };

  useEffect(() => {
    loadAppointmentsData();
  }, [idCompany]);

  return (
    <>
      <AtomsPanel title={"Mis Citas"} subtitle={"Información de las citas recibidas"} />
      <div className="mt-4">
        <MoleculesList
          data={appointmentsData}
          onFilterChange={() => {}}
          onActionClick={(actionType, item) => {
            if (actionType === 'reject') {
              handleAppointmentAction(item.id, 2, item.id_empresa_receptora, item.id_empresa_solicitante, item.fecha_solicitada);
            } else if (actionType === 'accept') {
              handleAppointmentAction(item.id, 1, item.id_empresa_receptora, item.id_empresa_solicitante, item.fecha_solicitada);
            }
          }}
          renderItemExtra={(item) => (
            <Image
              width={200}
              className="mask mask-squircle"
              src={
                !item.img_empresa_solicitante || item.img_empresa_solicitante === "no hay imagen cargada"
                  ? "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                  : item.img_empresa_solicitante
              }
            />
          )}
          renderItemMeta={(item) => ({
            avatar: (
              <p className='bg-primary p-3 rounded-full'>
                <Calendar1 color="#b2e713" />
              </p>
            ),
            title: (
              <Link to={`/roundtable/companies/${item.id_empresa_solicitante}/${item.id_evento}/false`}>
                {item.empresa_solicitante}
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
            (item.estatus === "ACEPTADO" || item.estatus === "RECHAZADO")
              ? []
              : [{
                  type: 'reject',
                  label: 'Rechazar',
                  icon: <SquareX />,
                  className: "bg-zinc-300 text-black hover:text-black hover:bg-zinc-400/75",
                }, {
                  type: 'accept',
                  label: 'Aceptar',
                  icon: <SquareCheckBig />,
                  className: "bg-green/50 text-primary hover:bg-green/80",
                }]
          }
        />
      </div>
      
    </>
  );
};

export default AppointmentsReceived;