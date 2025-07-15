import { Separator } from "@components/ui/separator";

export default function MoleculesSchedulesItems({
  empresaEmisoraNombre,
  empresaEmisoraImg,
  empresaReceptoraNombre,
  empresaReceptoraImg,
  estatus,
  fechaSolicitada,
  pais,
  estatusColor // nuevo prop
}) {
  return (
    <div className="w-full mx-auto bg-white rounded-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between">
          {/* Empresa emisora */}
          <div className="flex flex-col items-center space-y-3 flex-1">
            <div className="w-20 h-20 overflow-hidden flex items-center justify-center bg-white">
              <img
                src={empresaEmisoraImg || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                alt="Empresa Emisora"
                className="mask mask-squircle w-16 h-16 object-cover"
              />
            </div>
            <p className="text-center text-sm">{empresaEmisoraNombre}</p>
          </div>

          {/* Estado y detalles */}
          <div className="flex flex-col items-center justify-center space-y-2 flex-1">
            <span
              className={`px-3 py-1 rounded-md font-medium ${estatusColor?.bg || 'bg-gray-300'} ${estatusColor?.text || 'text-gray-700'}`}
            >
              {estatus}
            </span>
            <div className="w-24 h-1 bg-gray-300 rounded-full" />
            <span className="text-xs text-gray-500">{fechaSolicitada}</span>
            <span className="text-xs text-gray-500">Receptor {pais}</span>
          </div>

          {/* Empresa receptora */}
          <div className="flex flex-col items-center space-y-3 flex-1">
            <div className="w-20 h-20 overflow-hidden flex items-center justify-center bg-white">
              <img
                src={empresaReceptoraImg || "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png"}
                alt="Empresa Receptora"
                className="mask mask-squircle w-16 h-16 object-cover"
              />
            </div>
            <p className="text-center text-sm">{empresaReceptoraNombre}</p>
          </div>
        </div>
      </div>
      <Separator />
    </div>
  );
}
