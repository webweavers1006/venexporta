import { useState, useMemo, useEffect } from "react";

/**
 * Hook para manejar la lógica de datos y selección del PieChart.
 * Permite separar la lógica del componente principal para mayor escalabilidad.
 */
export function usePieChartData({
  data = [],
  labelKey = "label",
  valueKey = "value",
  colors = [],
  getTotal = (data, valueKey) => data.reduce((acc, item) => acc + (Number(item[valueKey]) || 0), 0),
  assignColors = (data, colors) => data.map((d, i) => ({ ...d, fill: colors[i % colors.length] })),
  sortData = (data, valueKey) => [...data].sort((a, b) => b[valueKey] - a[valueKey]),
  selectedLabel,
  onSelect,
}) {
  const [selected, setSelected] = useState(data?.[0]?.[labelKey] || "");

  // Sincronizar selección interna con el valor del padre si cambia
  useEffect(() => {
    if (selectedLabel && selectedLabel !== selected) {
      setSelected(selectedLabel);
    }
    if (!selectedLabel && selected) {
      setSelected("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLabel]);

  // Helpers para datos (totalmente parametrizables)
  const coloredData = useMemo(() => assignColors(data, colors), [data, colors, assignColors]);
  const sortedData = useMemo(() => sortData(coloredData, valueKey), [coloredData, valueKey, sortData]);
  const options = useMemo(() => sortedData.map((item) => item[labelKey]), [sortedData, labelKey]);
  const total = useMemo(() => getTotal(coloredData, valueKey), [coloredData, valueKey, getTotal]);
  const displayedData = sortedData;
  const activeIndex = useMemo(() => displayedData.findIndex((item) => item[labelKey] === selected), [selected, displayedData, labelKey]);

  // Si el seleccionado no existe en los datos, seleccionar el primero
  useEffect(() => {
    if (options.length > 0 && !options.includes(selected)) {
      setSelected(options[0]);
      if (onSelect) {
        const found = coloredData.find(item => item[labelKey] === options[0]);
        onSelect(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options]);

  // Si al cambiar los datos, el seleccionado no está visible, selecciona el primero visible
  useEffect(() => {
    if (displayedData.length > 0 && !displayedData.some(item => item[labelKey] === selected)) {
      setSelected(displayedData[0][labelKey]);
      if (onSelect) {
        const found = coloredData.find(item => item[labelKey] === displayedData[0][labelKey]);
        onSelect(found);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayedData]);

  return {
    coloredData,
    sortedData,
    options,
    total,
    displayedData,
    activeIndex,
    selected,
    setSelected,
  };
}
