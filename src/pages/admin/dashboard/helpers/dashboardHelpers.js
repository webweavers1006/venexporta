// Helpers y utilidades para el dashboard
// mapPieData: transforma datos para gráficos de torta
export function mapPieData(array, {
  labelKey,
  valueKey,
  colorKey = 'color',
  extra = () => ({}),
  filter = () => true
}) {
  return (array || [])
    .filter(filter)
    .map(item => ({
      label: item[labelKey],
      value: item[valueKey],
      fill: item[colorKey] || undefined,
      ...extra(item)
    }));
}

// pieConfig: genera configuración de colores/labels para gráficos de torta
export function pieConfig(array, {
  labelKey,
  colorKey = 'color',
  filter = () => true
}) {
  return (array || [])
    .filter(filter)
    .reduce((acc, item) => {
      acc[item[labelKey]] = {
        label: item[labelKey],
        color: item[colorKey] || undefined
      };
      return acc;
    }, {});
}
