
// import PropTypes from "prop-types";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo, useRef, useState } from "react";
import PropTypes from "prop-types";
import MoleculesChartPieExportIcons from "./MoleculesChartPieExportIcons";
import { useChartExport } from "./useChartExport";


export default function MoleculesBarChart({
  data = [],
  labelKey = "mes",
  valueKey = "empresas",
  title = "Gráfico de Barras",
  description = "",
  useCustomColors = false,
  customBarColor,
  tooltipLabel,
  tooltipContent,
  showYearSelector = false,
  year,
  onChangeYear,
  availableYears = [],
  exportId = "bar-chart",
  exportTitle,
  exportEnabled = true,
  exportLabel,
  exportExcelFn,
  exportImageFn,
  barProps = {},
  showLegend = false,
  sortDesc = false,
}) {
  // Referencia para exportar el área del gráfico
  const exportRef = useRef(null);
  // Estado para la barra seleccionada
  const [selectedLabel, setSelectedLabel] = useState(null);
  // Hook de exportación

  // Exportación
  const { handleDownload, handleExportExcel } = useChartExport({
    exportRef,
    id: exportId,
    title: exportTitle || title,
    data,
    labelKey,
    valueKey
  });


  // Ordenar los datos si sortDesc está activo
  const sortedData = useMemo(() => {
    if (sortDesc) {
      return [...data].sort((a, b) => (b[valueKey] || 0) - (a[valueKey] || 0));
    }
    return data;
  }, [data, valueKey, sortDesc]);

  // Total
  const totalValue = sortedData.reduce((acc, curr) => acc + (curr[valueKey] || 0), 0);

  // Calcular el máximo valor para normalizar
  const maxValue = useMemo(() => sortedData.reduce((max, curr) => Math.max(max, curr[valueKey] || 0), 0), [sortedData, valueKey]);

  // Función para obtener el color degradado basado en el valor
  const getBarColor = (valor) => {
    if (typeof customBarColor === 'function') return customBarColor(valor, maxValue);
    if (!maxValue) return 'var(--green)';
    const percent = 0.5 + 0.5 * (valor / maxValue);
    return `color-mix(in srgb, var(--green) ${percent * 100}%, transparent)`;
  };


  // Custom shape para aplicar color degradado por barra o color personalizado

  const CustomBar = (props) => {
    const { x, y, width, height, payload, index } = props;
    const isActive = selectedLabel && payload[labelKey] === selectedLabel;
    const barFill = isActive
      ? '#364153' // Color destacado
      : (useCustomColors && payload && payload.fill ? payload.fill : getBarColor(payload && payload[valueKey]));
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={barFill}
        rx={isActive ? 12 : 8}
        style={isActive ? { filter: 'drop-shadow(0 0 6px #36415388)' } : {}}
      />
    );
  };

  CustomBar.propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number,
    payload: PropTypes.object,
  };


  return (
    <Card>
      <CardHeader className="relative">
        <div className="flex items-center justify-between w-full">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <CardTitle>{title}</CardTitle>
              {showYearSelector && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Año:</span>
                  <select
                    className="border rounded px-2 py-1 text-sm"
                    value={year}
                    onChange={e => onChangeYear && onChangeYear(e.target.value)}
                    aria-label="Seleccionar año"
                  >
                    {availableYears.map(a => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            {description && <div className="text-xs text-muted-foreground mb-1">{description}</div>}
            <div className="text-sm font-semibold text-primary">
              Total: {totalValue}
            </div>
          </div>
        </div>
        {/* Botones de exportación */}
        {exportEnabled && (
          <MoleculesChartPieExportIcons
            onDownloadImage={exportImageFn || handleDownload}
            onDownloadExcel={exportExcelFn || handleExportExcel}
            label={exportLabel}
          />
        )}
      </CardHeader>
      <CardContent>
        {/* Área exportable */}
        <div ref={exportRef}>
          <ChartContainer config={{}} className="max-h-[250px] w-full">
            <BarChart data={sortedData} barGap={8} >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={labelKey}
                tickLine={false}
                tickMargin={6}
                axisLine={false}
                tickFormatter={value => typeof value === 'string' ? value.slice(0, 3) : value}
              />
              <YAxis allowDecimals={false} />
              {(tooltipContent || tooltipLabel) ? (
                <ChartTooltip
                  cursor={true}
                  content={tooltipContent || <ChartTooltipContent hideLabel label={tooltipLabel || labelKey} />} />
              ) : null}
              <Bar dataKey={valueKey} shape={<CustomBar />} {...barProps} />
            </BarChart>
          </ChartContainer>
          {/* Leyenda similar a la del ChartPie */}
          {showLegend && (
            <div
              className="w-full flex justify-center mt-2"
              style={{ minWidth: 0 }}
            >
              {/* Leyenda por columnas */}
              {(() => {
                const columns = 4;
                const total = sortedData.length;
                const rows = Math.ceil(total / columns);
                // Construir matriz por columnas
                const legendMatrix = Array.from({ length: rows }, (_, rowIdx) =>
                  Array.from({ length: columns }, (_, colIdx) => {
                    const idx = colIdx * rows + rowIdx;
                    return sortedData[idx];
                  })
                );
                return (
                  <div
                    className="grid grid-cols-4 gap-x-2 gap-y-1 mb-1 px-1 text-[11px] leading-[1.1] max-w-[90%] w-full"
                    aria-label="Leyenda del gráfico de barras"
                  >
                    {legendMatrix.flat().map((item, i) => {
                      if (!item) return <div key={i} />;
                      const isActive = selectedLabel === item[labelKey];
                      return (
                        <div
                          key={item[labelKey]}
                          className={`flex items-center gap-1 min-w-0 whitespace-nowrap overflow-hidden text-ellipsis cursor-pointer rounded ${isActive ? 'bg-[#36415322] ring-2 ring-[#364153]' : 'hover:bg-gray-100'}`}
                          style={{ transition: 'background 0.2s, box-shadow 0.2s' }}
                          onClick={() => setSelectedLabel(item[labelKey])}
                          tabIndex={0}
                          role="button"
                          aria-pressed={isActive}
                        >
                          <span
                            className="inline-block rounded-full border border-gray-300 mr-[3px] flex-shrink-0 w-[10px] h-[10px]"
                            style={{ background: (useCustomColors && item.fill) ? item.fill : getBarColor(item[valueKey]) }}
                            aria-label={`Color de ${item[labelKey]}`}
                          ></span>
                          <span
                            className="font-semibold min-w-[24px] text-right text-[#364153] flex-shrink-0"
                          >
                            {item[valueKey]?.toLocaleString()}
                          </span>
                          <span
                            className="ml-1 text-[.95em] text-[#364153] inline-block truncate min-w-[80px] max-w-[180px] align-middle"
                            title={item[labelKey]}
                          >
                            {item[labelKey]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

MoleculesBarChart.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object),
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  useCustomColors: PropTypes.bool,
  customBarColor: PropTypes.func,
  tooltipLabel: PropTypes.string,
  tooltipContent: PropTypes.node,
  showYearSelector: PropTypes.bool,
  year: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChangeYear: PropTypes.func,
  availableYears: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])),
  exportId: PropTypes.string,
  exportTitle: PropTypes.string,
  exportEnabled: PropTypes.bool,
  exportLabel: PropTypes.string,
  exportExcelFn: PropTypes.func,
  exportImageFn: PropTypes.func,
  barProps: PropTypes.object,
  showLegend: PropTypes.bool,
  sortDesc: PropTypes.bool,
};
