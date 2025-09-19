import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BadgeCheck, BadgeX } from "lucide-react";
import { useEffect, useState } from "react";
import { Modal, message, Badge } from "antd"; // Import Modal and message from Ant Design
import { scheduleAppointment } from "@src/lib/api/schedules/schedules";
import appStore from '@src/store/appStore';
import { Calendar1 } from "lucide-react";
import {companiesOnlyHelps} from "@/pages/roundtable/helps/companiesOnlyHelps";
import AtomsPopoverHelpButton from '@components/atoms/AtomsPopoverHelpButton';

//✅Components traduction
import { useTranslation } from "react-i18next";

const ScheduleModule = ({ scheduleBlocks, reloadScheduleBlocks, id_evento, id_empresa_receptora, disableSelect = false }) => {
  // Traducción
  const { t } = useTranslation();
  const { idCompany} = appStore();
  const [defaultTab, setDefaultTab] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility
  const [selectedBlock, setSelectedBlock] = useState(null); // State for the selected block

  useEffect(() => {
    setDefaultTab(Object.keys(scheduleBlocks)[0] || "");
  }, [scheduleBlocks]);

  const handleRequestAppointment = (block) => {
    setSelectedBlock(block); // Set the selected block
    setIsModalOpen(true); // Open the modal
  };
  
  const handleModalOk = async () => {
    try {
      let id_empresa_solicitante = idCompany; // Get idCompany from store
      await scheduleAppointment(
        id_evento,
        id_empresa_solicitante,
        id_empresa_receptora,
        selectedBlock.fecha_hora
      );

      message.success(t("schedule.appointmentSuccess", {id: selectedBlock.id,date: selectedBlock.fecha_hora}));setIsModalOpen(false);

      // Reload schedule blocks
      if (reloadScheduleBlocks) {
        reloadScheduleBlocks();
      }
    } catch (error) {
      console.error("Error scheduling appointment:", error);
      message.error(error.response.data.error.message);
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false); // Close the modal
  };

  return (
    <div className="bg-white flex flex-col items-center justify-start rounded-2xl p-4 col-span-1 relative">
  
          <AtomsPopoverHelpButton
            side={!disableSelect?companiesOnlyHelps.scheduleRoundTable.side : companiesOnlyHelps.myschedule.side}
            title={!disableSelect?companiesOnlyHelps.scheduleRoundTable.title :companiesOnlyHelps.myschedule.title}
            className={!disableSelect?companiesOnlyHelps.scheduleRoundTable.className : companiesOnlyHelps.myschedule.className}
            content={!disableSelect?companiesOnlyHelps.scheduleRoundTable.content : companiesOnlyHelps.myschedule.content}
            classNameContent={!disableSelect?companiesOnlyHelps.scheduleRoundTable.classNameContent : companiesOnlyHelps.myschedule.classNameContent}
          />

      
      <h3 className="text-lg font-semibold text-zinc-700 text-center">{t("schedule.title")}</h3>
      <p className="text-sm mb-4 text-zinc-700 text-center">{t("schedule.subtitle")}</p>
      <div className="flex flex-col  h-full w-full">
        <Tabs value={defaultTab} onValueChange={setDefaultTab} className="w-full">
          <TabsList className="flex justify-center mx-auto bg-green/50 text-primary">
            {Object.keys(scheduleBlocks).map((date) => (
              <TabsTrigger key={date} value={date} className>
                <Calendar1/>{date}
              </TabsTrigger>
            ))}
          </TabsList>
          {Object.keys(scheduleBlocks).map((date) => (
            <TabsContent key={date} value={date}>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("schedule.table.time")}</TableHead>
                    <TableHead>{t("schedule.table.availability")}</TableHead>
                    <TableHead>{t("schedule.table.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scheduleBlocks[date].map((block) => {
                    // Validar si el bloque está rechazado, aceptado o en revisión y no disponible
                    const isSpecialStatus =
                      !block.disponibilidad &&
                      (block.estatus === "RECHAZADO" ||
                        block.estatus === "ACEPTADO" ||
                        block.estatus === "EN REVISION");

                    let bgColor = "";
                    let textColor = "#fff";
                    if (block.estatus === "RECHAZADO") {
                      bgColor = "#ffcccc"; // rojo claro
                      textColor = "#b91c1c"; // rojo fuerte
                    } else if (block.estatus === "ACEPTADO") {
                      bgColor = "#b6ffd0"; // gris/azul claro
                      textColor = "#222";
                    } else if (block.estatus === "EN REVISION") {
                      bgColor = "#dbeafe"; // azul claro
                      textColor = "#2563eb";
                    }

                    if (isSpecialStatus) {
                      let mensaje = "";
                      if (block.estatus === "ACEPTADO") {
                        mensaje = block.miEmpresa
                          ? "Cita Aceptada " + block.fecha_hora
                          : "Ocupado " + block.fecha_hora;
                      } else {
                        mensaje = `${block.estatus} ${block.fecha_hora}`;
                      }

                      return (
                        <TableRow key={block.id} style={{ background: bgColor }}>
                          <TableCell colSpan={3} style={{ textAlign: "center", color: textColor, fontWeight: 600 }}>
                            {mensaje}
                          </TableCell>
                        </TableRow>
                      );
                    }

                    return (
                      <TableRow key={block.id}>
                        <TableCell>
                          <Badge color="#2c0449" size="small" style={{ marginRight: "5px" }} />
                          {block.fecha_hora.split(" ")[1]}
                        </TableCell>
                        <TableCell>
                          {block.disponibilidad ? (
                            <BadgeCheck className="text-green-500" />
                          ) : (
                            <BadgeX className="text-red-500" />
                          )}
                        </TableCell>
                        <TableCell>
                          {block.disponibilidad ? (
                            disableSelect ? (
                              // No mostrar nada si está deshabilitado
                              null
                            ) : (
                              <span
                                onClick={() => handleRequestAppointment(block)}
                                style={{ color: "blue", cursor: "pointer" }}
                              >
                                {t("schedule.select")}
                              </span>
                            )
                          ) : (
                            <>
                              {/* Si no es un estatus especial, pero está no disponible, puedes mostrar el estatus aquí si lo deseas */}
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>
          ))}
        </Tabs>
      </div>
      {/* Mostrar el caption siempre al final del contenedor */}
      {defaultTab && (
        <div className="w-full mt-2 text-center text-sm text-gray-500">
           {t("schedule.caption", { date: defaultTab })}.
        </div>
      )}
      {/* Modal for requesting an appointment */}
      <Modal
        title={t("schedule.modal.title")}
        visible={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        okText={t("ok")}
        cancelText={t("cancel")}
      >
        <p>{t("schedule.modal.confirmation")}</p>
      </Modal>
    </div>
  );
};

export default ScheduleModule;
