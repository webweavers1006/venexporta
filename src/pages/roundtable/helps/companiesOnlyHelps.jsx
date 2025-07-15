import React, { useState, useRef, useEffect } from "react";
import { Modal } from "antd";
import { Button } from "@components/ui/button";

function ScheduleRoundTableHelpContent() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const iframeRef = useRef(null);

  // Cargar la API de Vimeo solo una vez y ajustar el video cuando el modal esté abierto
  useEffect(() => {
    if (!isModalOpen) return;

    // Cargar el script de Vimeo si no está presente
    if (!window.Vimeo) {
      const script = document.createElement("script");
      script.src = "https://player.vimeo.com/api/player.js";
      script.onload = setupVimeoPlayer;
      document.body.appendChild(script);
    } else {
      setupVimeoPlayer();
    }

    function setupVimeoPlayer() {
      if (iframeRef.current && window.Vimeo) {
        const player = new window.Vimeo.Player(iframeRef.current);
        player.setVolume(0); // Silenciar
        player.setPlaybackRate(0.5); // Velocidad 0.5x
      }
    }
  }, [isModalOpen]);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  return (
    <>
      <p className="text-sm">
        Esta seccion muestra la disponibilidad de citas para la empresa seleccionada.
      </p>
      <p className="text-sm">
        Al seleccionar un horario disponible, se enviará una solicitud de cita a la empresa, y se mostrará el estatus en el cual se encuentra la solicitud de cita.
      </p>
      <Button type="primary" className="center" onClick={showModal}>
        Ver ejemplo
      </Button>
      <Modal
        title="Ejemplo de Disponibilidad de Citas"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <div>
          <iframe
            ref={iframeRef}
            className="aspect-video w-full"
            src="https://player.vimeo.com/video/1089278101?h=650ee17e5a&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&quality=1080p&muted=1"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            title="Vídeo sin título ‐ Hecho con Clipchamp (1)"
          ></iframe>
        </div>
      </Modal>
    </>
  );
}

export const companiesOnlyHelps = {
  scheduleRoundTable: {
    title: "Disponibilidad de citas",
    content: <ScheduleRoundTableHelpContent />,
    side: "bottom",
    className: "absolute top-3 right-3 z-10",
  },
  myschedule: {
    title: "Mis citas",
    content: (
      <>
        <p className="text-sm">
          Esta seccion muestra el estatus de las citas enviadas por ti y la
          disponibilidad de los bloques de horarios disponible del evento.
        </p>
      </>
    ),
    side: "left",
    className: "float-right",
  },
};
