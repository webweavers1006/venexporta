// Label con value y name truncado para el gráfico de pastel
export const renderLabel = (entry) => {
  const maxLength = 10; // puedes ajustar el largo máximo
  let label = entry.name;
  if (label && label.length > maxLength) {
    label = label.slice(0, maxLength) + '...';
  }
  return `${entry.value} ${label}`;
};