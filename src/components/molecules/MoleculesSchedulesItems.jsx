import { Separator } from "@components/ui/separator";
import PropTypes from "prop-types";

export default function MoleculesSchedulesItems({
  empresaEmisoraNombre,
  empresaEmisoraImg,
  empresaReceptoraNombre,
  empresaReceptoraImg,
  estatus,
  fechaSolicitada,
  pais,
  estatusColor, // nuevo prop
  textEstatus
}) {
  // Texto a mostrar para el estatus basado en estatusColor.text
  // Si estatusColor?.text === "EN REVISION" mostrar "SIN RESPONDER"; en otros casos mostrar estatusColor?.text
  // Fallback a "estatus" si no viene estatusColor?.text
  const displayStatus =
    (estatus === "EN REVISION" || estatusColor?.text === "EN REVISION")
      ? textEstatus
      : (estatus ?? estatusColor?.text ?? "");

  return (
    <div className="w-full mx-auto rounded-lg overflow-hidden border border-gray-100 shadow-sm odd:bg-gray-50 even:bg-white transition-colors hover:bg-gray-100/50">
      <div className="p-4 sm:p-6">
        {/* Grid responsivo: 1 columna en móvil, 3 en pantallas medianas+ */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 items-center">
          {/* Empresa emisora */}
          <div className="flex flex-col items-center space-y-3 sm:space-y-3 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden flex items-center justify-center bg-white">
              <img
                src={empresaEmisoraImg || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                alt={empresaEmisoraNombre ? `Logo ${empresaEmisoraNombre}` : "Empresa Emisora"}
                className="mask mask-squircle w-16 h-16 sm:w-20 sm:h-20 object-cover"
              />
            </div>
            <p className="text-center text-sm w-full max-w-[12rem] sm:max-w-none truncate" title={empresaEmisoraNombre}>
              {empresaEmisoraNombre}
            </p>
          </div>

          {/* Estado y detalles */}
          <div className="flex flex-col items-center justify-center space-y-2">
            <span
              className={`px-3 py-1 rounded-md font-medium shrink-0 ${estatusColor?.bg || 'bg-gray-300'} ${estatusColor?.text || 'text-gray-700'}`}
            >
              {displayStatus}
            </span>
            <div className="w-20 sm:w-24 h-1 bg-gray-300 rounded-full" />
            <span className="text-xs text-gray-500 text-center">{fechaSolicitada}</span>
            <span className="text-xs text-gray-500 text-center">Receptor {pais}</span>
          </div>

          {/* Empresa receptora */}
          <div className="flex flex-col items-center space-y-3 sm:space-y-3 min-w-0">
            <div className="w-16 h-16 sm:w-20 sm:h-20 overflow-hidden flex items-center justify-center bg-white">
              <img
                src={empresaReceptoraImg || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                alt={empresaReceptoraNombre ? `Logo ${empresaReceptoraNombre}` : "Empresa Receptora"}
                className="mask mask-squircle w-16 h-16 sm:w-20 sm:h-20 object-cover"
              />
            </div>
            <p className="text-center text-sm w-full max-w-[12rem] sm:max-w-none truncate" title={empresaReceptoraNombre}>
              {empresaReceptoraNombre}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

MoleculesSchedulesItems.propTypes = {
  empresaEmisoraNombre: PropTypes.string,
  empresaEmisoraImg: PropTypes.string,
  empresaReceptoraNombre: PropTypes.string,
  empresaReceptoraImg: PropTypes.string,
  estatus: PropTypes.string,
  fechaSolicitada: PropTypes.string,
  pais: PropTypes.string,
  estatusColor: PropTypes.shape({
    bg: PropTypes.string,
    text: PropTypes.string,
  }),
};
