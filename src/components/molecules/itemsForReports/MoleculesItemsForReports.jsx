import { Checkbox as UICheckbox } from "@/components/ui/checkbox";
import { useRef, useEffect } from "react";
import { Label } from "@/components/ui/label";
import PropTypes from "prop-types";

Checkbox.propTypes = {
  indeterminate: PropTypes.bool,
};
// Checkbox personalizado para manejar indeterminate correctamente
function Checkbox({ indeterminate, ...props }) {
  const ref = useRef();
  useEffect(() => {
    if (ref.current) {
      ref.current.indeterminate = !!indeterminate;
    }
  }, [indeterminate]);
  return <UICheckbox ref={ref} {...props} />;
}


/**
 * Componente general para mostrar una lista de checkboxes con labels personalizados.
 * @param {Array} items - Array de objetos { id, label, checked, description }
 * @param {Function} onChange - Callback al cambiar el estado de un checkbox (id, checked)
 * @param {string} [className] - Clase extra para el contenedor
 */
export default function MoleculesItemsForReports({ items = [], onChange, className = "" }) {
  // Agrupa los items en filas de 3
  const rows = [];
  for (let i = 0; i < items.length; i += 3) {
    rows.push(items.slice(i, i + 3));
  }

  // Determina si todos están seleccionados
  const allChecked = items.length > 0 && items.every(item => item.checked);
  const someChecked = items.some(item => item.checked);

  // Maneja el cambio de seleccionar/deseleccionar todos
  const handleSelectAll = (checked) => {
    items.forEach(item => {
      if (item.checked !== checked) {
        onChange(item.id, checked);
      }
    });
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <div className="flex items-center gap-2 mb-2 justify-center">
        <Checkbox
          id="select-all"
          checked={allChecked}
          indeterminate={!allChecked && someChecked}
          onCheckedChange={handleSelectAll}
        />
        <Label htmlFor="select-all" className="text-sm font-semibold select-none cursor-pointer">
          {allChecked ? 'Quitar todos' : 'Seleccionar todos'}
        </Label>
      </div>
      {rows.map((row, rowIdx) => (
        <div key={rowIdx} className="flex flex-row gap-4">
          {row.map((item) => (
            <div
              key={item.key}
              className="flex items-start gap-2 flex-1 min-w-0"
              style={item.show === false ? { display: 'none' } : {}}
            >
              <UICheckbox
                id={item.key}
                checked={item.checked}
                onCheckedChange={(checked) => onChange(item.id, checked)}
              />
              <div className="grid gap-1.5 font-normal">
                <Label htmlFor={item.key} className="text-sm leading-none font-medium">
                  {item.label}
                </Label>
                {item.description && (
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

MoleculesItemsForReports.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      checked: PropTypes.bool,
      description: PropTypes.string,
    })
  ),
  onChange: PropTypes.func.isRequired,
  className: PropTypes.string,
};
