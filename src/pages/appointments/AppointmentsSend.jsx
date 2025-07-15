import { useState, useEffect } from "react";
import AtomsPanel from "@components/atoms/AtomsPanel";
import { useStore } from "zustand";
import appStore from "@store/appStore";
import { message, Image } from 'antd';
import { fetchRequestedAppointments, deleteAppointment } from "@src/lib/api/apiUser";
import { Calendar1, SquareCheckBig } from "lucide-react";
import { Link } from "react-router";
import { Button as ButtonShacdn } from "@components/ui/button";
import MoleculesList from "@components/molecules/MoleculesList";

const AppointmentsSend = () => {
  const idCompany = useStore(appStore, (state) => state.idCompany);
  const [appointmentsData, setAppointmentsData] = useState([]);

  const loadAppointmentsData = async () => {
    try {
      const data = await fetchRequestedAppointments(idCompany, 1);
      setAppointmentsData(data);
    } catch (error) {
      console.error("Error fetching appointments data:", error);
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      await deleteAppointment(id);
      message.success("Cita cancelada exitosamente");
      loadAppointmentsData(); // Recargar datos después de eliminar
    } catch (error) {
      message.error("Error al cancelar la cita");
    }
  };

  useEffect(() => {
    loadAppointmentsData();
  }, [idCompany]);

  return (
    <>
      <AtomsPanel title={"Mis Citas"} subtitle={"Información de las citas enviadas"} />
      <div className="mt-4">
        <MoleculesList
          data={appointmentsData}
          onFilterChange={() => {}}
          onActionClick={(actionType, item) => {
            if (actionType === 'cancel') {
              handleCancelAppointment(item.id);
            }
          }}
          renderItemExtra={(item) => (
            <Image
              width={200}
              className="mask mask-squircle"
              src={
                !item.img_empresa_receptora || item.img_empresa_receptora === "no hay imagen cargada"
                  ? "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"
                  : item.img_empresa_receptora
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
              <Link to={`/roundtable/companies/${item.id_empresa_receptora}/${item.id_evento}/false`}>
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
            (item.estatus === "ACEPTADO" || item.estatus === "RECHAZADO")
              ? []
              : [{
                  type: 'cancel',
                  label: 'Cancelar',
                  icon: <SquareCheckBig />,
                  className: "bg-green/50 text-primary hover:bg-green/80",
                }]
          }
        />
      </div>
      
    </>
  );
};

export default AppointmentsSend;