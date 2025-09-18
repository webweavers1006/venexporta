import React from 'react';
import PropTypes from 'prop-types';

/**
 * Tarjeta seleccionable para un QR dentro del grid.
 * Encapsula la UI de selección y accesibilidad alrededor del componente base de QR.
 *
 * Contrato:
 * - Entradas: index, item (datos del QR), BaseComponent (componente que dibuja el QR), selected, onToggle.
 * - Salida: JSX de una tarjeta clickable con borde de selección y etiqueta opcional.
 */
function QrSelectableItem({ index, item, BaseComponent, selected, onToggle, qrProps }) {
  return (
    <div className="relative flex flex-col items-center" data-index={index}>
      <div
        className={`relative rounded-lg p-2 transition ring-offset-2 cursor-pointer ${selected ? 'ring-2 ring-teal-600' : 'ring-1 ring-transparent hover:ring-teal-300/60'}`}
        role="checkbox"
        aria-checked={selected}
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); onToggle(); } }}
      >
        <button
          type="button"
          aria-pressed={selected}
          onClick={(e) => { e.stopPropagation(); onToggle(); }}
          className={`absolute z-10 top-2 left-2 h-5 w-5 rounded border ${selected ? 'bg-teal-600 border-teal-700' : 'bg-white/90 border-gray-300'} shadow-sm flex items-center justify-center`}
          title={selected ? 'Quitar de la selección' : 'Seleccionar para exportar'}
        >
          {selected ? (
            <span className="block h-3 w-3 bg-white rounded-sm" />
          ) : null}
        </button>
        <BaseComponent
          item={item}
          {...qrProps}
        />
      </div>
      {item.label ? (
        <span className="mt-2 text-sm text-gray-700 text-center line-clamp-2">{item.label}</span>
      ) : null}
    </div>
  );
}

export default React.memo(QrSelectableItem);

QrSelectableItem.propTypes = {
  index: PropTypes.number.isRequired,
  item: PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string,
    logoSrc: PropTypes.string,
  }).isRequired,
  BaseComponent: PropTypes.elementType.isRequired,
  selected: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  qrProps: PropTypes.object,
};

QrSelectableItem.defaultProps = {
  selected: false,
};
