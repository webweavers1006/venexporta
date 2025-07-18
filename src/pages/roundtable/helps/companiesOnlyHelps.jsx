
import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Modal } from "antd";
import { Button } from "@components/ui/button";


/**
 * Componente de ayuda para la disponibilidad de citas en la rueda de negocios.
 * Muestra información y un ejemplo en video sobre cómo solicitar citas.
 *
 * @component
 * @example
 * <ScheduleRoundTableHelpContent videoUrl="https://player.vimeo.com/video/1089278101?..." />
 *
 * @param {Object} props
 * @param {string} props.videoUrl - URL del video de ejemplo (Vimeo embed).
 * @param {string} [props.iframeTitle] - Título accesible para el iframe del video.
 */
function ScheduleRoundTableHelpContent({ videoUrl, iframeTitle }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!isModalOpen) return;
    // Cargar el script de Vimeo solo si es necesario
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
        player.setVolume(0);
        player.setPlaybackRate(0.5);
      }
    }
  }, [isModalOpen]);

  /** Abre el modal de ejemplo */
  const showModal = () => setIsModalOpen(true);
  /** Cierra el modal */
  const handleClose = () => setIsModalOpen(false);

  return (
    <>
      <p className="text-sm">
        Esta sección muestra la disponibilidad de citas para la empresa seleccionada.
      </p>
      <p className="text-sm">
        Al seleccionar un horario disponible, se enviará una solicitud de cita a la empresa, y se mostrará el estatus en el cual se encuentra la solicitud de cita.
      </p>
      <Button
        type="primary"
        className="center"
        onClick={showModal}
        aria-label="Ver ejemplo de disponibilidad de citas"
        tabIndex={0}
      >
        Ver ejemplo
      </Button>
      <Modal
        title="Ejemplo de Disponibilidad de Citas"
        open={isModalOpen}
        onOk={handleClose}
        onCancel={handleClose}
        footer={null}
        aria-modal="true"
        role="dialog"
      >
        <div>
          <iframe
            ref={iframeRef}
            className="aspect-video w-full"
            src={videoUrl}
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
            title={iframeTitle || "Ejemplo de disponibilidad de citas"}
            aria-label={iframeTitle || "Ejemplo de disponibilidad de citas"}
            tabIndex={0}
          ></iframe>
        </div>
      </Modal>
    </>
  );
}

ScheduleRoundTableHelpContent.propTypes = {
  videoUrl: PropTypes.string.isRequired,
  iframeTitle: PropTypes.string,
};


/**
 * Objeto de ayudas contextuales para la sección de empresas en la rueda de negocios.
 * @type {Object}
 * @example
 * import { companiesOnlyHelps } from './companiesOnlyHelps';
 * // ...
 * <AtomsPopoverHelpButton
 *   title={companiesOnlyHelps.scheduleRoundTable.title}
 *   content={companiesOnlyHelps.scheduleRoundTable.content}
 *   side={companiesOnlyHelps.scheduleRoundTable.side}
 *   className={companiesOnlyHelps.scheduleRoundTable.className}
 * />
 */
export const companiesOnlyHelps = {
  scheduleRoundTable: {
    title: "Disponibilidad de citas",
    content: (
      <ScheduleRoundTableHelpContent
        videoUrl="https://player.vimeo.com/video/1089278101?h=650ee17e5a&badge=0&autopause=0&player_id=0&app_id=58479&autoplay=1&quality=1080p&muted=1"
        iframeTitle="Ejemplo de disponibilidad de citas"
      />
    ),
    side: "bottom",
    className: "absolute top-3 right-3 z-10",
  },
  myschedule: {
    title: "Mis citas",
    content: (
      <>
        <p className="text-sm">
          Esta sección muestra el estatus de las citas enviadas por ti y la disponibilidad de los bloques de horarios disponible del evento.
        </p>
      </>
    ),
    side: "left",
    className: "float-right",
  },
};
