import PropTypes from 'prop-types';

/**
 * Renderizador por defecto para el segmento seleccionado en el gráfico de torta.
 * @param {Object} props
 * @param {string} props.selected - Label seleccionado.
 * @param {Object} props.item - Objeto de datos seleccionado.
 * @param {number} props.total - Total general.
 * @param {string} [props.labelTotal] - Etiqueta para el total.
 */
export function DefaultPieSelected({ selected, item, total, labelTotal = 'Total' }) {
  if (!item) return null;
  return (
    <div className="text-center w-full flex flex-col items-center gap-2">
      <span className="font-medium text-base" style={{ color: '#6b7280' }}>
        <span className="font-bold" style={{ color: '#364153' }}>Seleccionado:</span> {selected}
      </span>
      <span
        className="text-foreground font-bold px-4 py-1 rounded"
        style={{ background: item?.fill || '#eee', color: '#fff', display: 'inline-block', minWidth: 60 }}
        aria-label={`Valor de ${selected}`}
      >
        {labelTotal ? `${labelTotal}: ` : ''}{item?.value?.toLocaleString()}
        {total > 0 && (
          <span className="ml-2 text-xs text-white/80">
            ({(((item?.value || 0) / total) * 100).toFixed(2)}%)
          </span>
        )}
      </span>
    </div>
  );
}

DefaultPieSelected.propTypes = {
  selected: PropTypes.string,
  item: PropTypes.object,
  total: PropTypes.number,
  labelTotal: PropTypes.string
};
