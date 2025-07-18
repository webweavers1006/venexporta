
import React, { lazy } from 'react';
import PropTypes from 'prop-types';
import { Calendar1 } from 'lucide-react';
import { useEventInfo } from './hooks/useEventInfo';

const AtomsPanel = lazy(() => import('@components/atoms/AtomsPanel'));

/**
 * Componente para mostrar información de eventos y permitir el registro de empresas.
 *
 * @component
 * @example
 * // Uso básico:
 * <EventInfo />
 *
 * @returns {JSX.Element} Renderizado del panel de información de eventos.
 */
function EventInfo({ panelTitle = 'Evento', panelSubtitle = 'Información del evento' }) {
  const { eventData, handleRegister } = useEventInfo();

  // Render de ejemplo, se puede extender para mostrar la lista de eventos
  return (
    <>
      <AtomsPanel title={panelTitle} subtitle={panelSubtitle} />
      {/* Ejemplo de renderizado de eventos, se puede personalizar */}
      <div className="mt-4" role="region" aria-label="Lista de eventos">
        {eventData && eventData.length > 0 ? (
          <ul className="space-y-4">
            {eventData.map((evento) => (
              <li key={evento.id} className="flex items-center gap-4 border p-4 rounded-md" tabIndex={0} aria-label={`Evento: ${evento.nombre_evento}`}>
                <span className="bg-primary p-3 rounded-full" title="Evento">
                  <Calendar1 color="#b2e713" aria-hidden="true" />
                </span>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{evento.nombre_evento}</h3>
                  <p className="text-sm">{evento.descripcion_evento}</p>
                  <p className="text-xs text-gray-500">Duración: {evento.fecha_inicio} - {evento.fecha_final}</p>
                  <p className="text-xs text-gray-500">Inscripción: {evento.fecha_inicial_inscripcion} - {evento.fecha_final_inscripcion}</p>
                </div>
                <button
                  type="button"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
                  onClick={() => handleRegister(evento.id)}
                  aria-label={`Registrarse en el evento ${evento.nombre_evento}`}
                  tabIndex={0}
                  title={`Registrarse en ${evento.nombre_evento}`}
                >
                  Registrarse
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">No hay eventos disponibles.</p>
        )}
      </div>
    </>
  );
}

EventInfo.propTypes = {
  /** Título del panel */
  panelTitle: PropTypes.string,
  /** Subtítulo del panel */
  panelSubtitle: PropTypes.string,
};

export default EventInfo;