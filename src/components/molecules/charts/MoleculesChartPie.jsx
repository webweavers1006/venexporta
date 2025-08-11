
import { useRef, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Pie, PieChart, Sector, Legend } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import MoleculesChartPieExportIcons from "./MoleculesChartPieExportIcons";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useChartExport } from "./useChartExport";
import { renderLabel } from "@helpers/charts/charts";

import { usePieChartData } from "./usePieChartData";



/**
/**
 * PieChart genérico y reutilizable para cualquier tipo de datos.
 *
 * Permite personalizar:
 * - Las claves de label y valor.
 * - La función de asignación de colores.
 * - El ordenamiento de los datos.
 * - El renderizado del total y del segmento seleccionado.
 * - La exportación (imagen, Excel).
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.data - Datos a graficar. Cada objeto debe tener una clave de label y value.
 * @param {Object} [props.config] - Configuración visual y de colores.
 * @param {string} [props.labelKey="label"] - Clave del label en cada objeto de data.
 * @param {string} [props.valueKey="value"] - Clave del valor numérico en cada objeto de data.
 * @param {string} [props.title] - Título del gráfico.
 * @param {string} [props.description] - Descripción opcional.
 * @param {number} [props.showMoreThreshold=10] - Umbral para mostrar filtro de top N.
 * @param {number} [props.showMoreCount=10] - Cantidad de elementos a mostrar en el filtro de top N.
 * @param {string} [props.labelTotal="Total"] - Etiqueta para mostrar el total.
 * @param {Array<string>} [props.colors] - Array de colores personalizados.
 * @param {function} [props.getTotal] - Función para calcular el total.
 * @param {function} [props.assignColors] - Función para asignar colores a los datos (data, colors) => dataConColores.
 * @param {function} [props.sortData] - Función para ordenar los datos (data, valueKey) => dataOrdenada.
 * @param {function} [props.renderTotal] - Render personalizado para el total.
 * @param {function} [props.renderSelected] - Render personalizado para el elemento seleccionado.
 * @param {function} [props.onSelect] - Callback al seleccionar un segmento.
 * @param {string} [props.selectedLabel] - Label seleccionado externamente.
 * @param {boolean} [props.showLegend=false] - Si se debe mostrar la leyenda de colores debajo del gráfico.
 * @param {string} [props.selectedLabel] - Label seleccionado externamente.
 *
 * @example
 * <MoleculesChartPie
 *   data={[{ label: "A", value: 10 }, { label: "B", value: 20 }]}
 *   assignColors={(data, colors) => data.map((d, i) => ({ ...d, fill: colors[i % colors.length] }))}
 *   sortData={(data, valueKey) => [...data].sort((a, b) => b[valueKey] - a[valueKey])}
 *   title="Mi gráfico"
 *   onSelect={item => console.log(item)}
 * />
 */
function MoleculesChartPie({
  data = [],
  config = {},
  labelKey = "label",
  valueKey = "value",
  title = "",
  description = "",
  labelTotal = "Total",
  colors = [],
  getTotal = (data, valueKey) => data.reduce((acc, item) => acc + (Number(item[valueKey]) || 0), 0),
  assignColors = (data, colors) => data.map((d, i) => ({ ...d, fill: colors[i % colors.length] })),
  sortData = (data, valueKey) => [...data].sort((a, b) => b[valueKey] - a[valueKey]),
  renderSelected,
  onSelect,
  selectedLabel,
  showLegend = false,
}) {
  // id único por instancia
  const id = useMemo(() => `pie-chart-${Math.random().toString(36).slice(2, 10)}`,[/*empty*/]);
  const [open, setOpen] = useState(false);
  const chartRef = useRef(null);
  const exportRef = useRef(null);

  // Usar hook para lógica de datos y selección
  const {
    coloredData,
    sortedData,
    options,
    total,
    displayedData,
    activeIndex,
    selected,
    setSelected,
  } = usePieChartData({
    data,
    labelKey,
    valueKey,
    colors,
    getTotal,
    assignColors,
    sortData,
    selectedLabel,
    onSelect,
  });

  // Export hooks
  const { handleDownload, handleExportExcel } = useChartExport({
    exportRef,
    id,
    title,
    data,
    labelKey,
    valueKey
  });

  // Accesibilidad: aria-labels y roles
  return (
    <Card data-chart={id} className="flex flex-col h-full" role="region" aria-label={title}>
      <ChartStyle id={id} config={config} />
      <CardHeader className="flex-row items-start space-y-0 pb-0 justify-center relative">
        <MoleculesChartPieExportIcons
          onDownloadImage={handleDownload}
          onDownloadExcel={handleExportExcel}
          aria-label="Exportar gráfico"
        />
        <div className="grid gap-1 w-full place-items-center">
          <CardTitle className="text-center w-full">{title}</CardTitle>
          {description && <CardDescription className="mt-1 text-muted-foreground text-center w-full">{description}</CardDescription>}

          {/*
          Funcionalidad de top N desactivada. Si se requiere, reactivar y ajustar lógica.
          */}
          <div className="mt-2 w-full max-w-xs mx-auto flex flex-col items-center gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  aria-label="Seleccionar subsector"
                  className="h-7 w-full rounded-lg pl-2.5 justify-between overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <span className="block w-full truncate text-left">
                    {selected ? options.find((o) => o === selected) : "Seleccione..."}
                  </span>
                  <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-[180px] max-w-xs p-0" aria-label="Opciones de subsector">
                <Command>
                  <CommandInput placeholder="Buscar..." className="h-9" aria-label="Buscar subsector" />
                  <CommandList>
                    <CommandEmpty>No se encontró.</CommandEmpty>
                    <CommandGroup>
                      {sortedData.map((item) => (
                        <CommandItem
                          key={item[labelKey]}
                          value={item[labelKey]}
                          onSelect={() => {
                            setSelected(item[labelKey]);
                            setOpen(false);
                            if (onSelect) {
                              onSelect(item);
                            }
                          }}
                          aria-label={`Seleccionar ${item[labelKey]}`}
                        >
                          <span className="block w-full truncate text-left flex items-center gap-2">
                            <span className="text-xs text-muted-foreground min-w-[40px] text-left">{item[valueKey]?.toLocaleString()}</span>
                            <span className="truncate">{item[labelKey]}</span>
                          </span>
                          <Check className={cn("ml-auto", selected === item[labelKey] ? "opacity-100" : "opacity-0")} aria-hidden="true" />
                        </CommandItem>
                      ))}

                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 justify-center pb-0 items-center">
        {/* Área a exportar: fondo blanco, gráfico, total y seleccionado */}
        <div ref={exportRef}>
          {/* Título solo para la imagen exportada */}
          <div
            className="w-full text-center mb-2 only-export-title font-bold text-[18px] text-[#364153] hidden"
          >
            {title}
          </div>
          <div ref={chartRef} className="w-full flex flex-col items-center">
            {/* Contenedor fijo y padding extra para evitar que el layout se mueva al seleccionar sectores */}
            <div className="w-[500px] h-[275px] flex items-center justify-center relative overflow-visible">
              <ChartContainer id={id} config={config} className="mx-auto aspect-square w-full max-w-[320px] min-w-[320px] min-h-[275px]">
                <PieChart width={160} height={100} aria-label="Gráfico de torta de subsectores" style={{ overflow: 'visible' }}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    labelLine={{ className: 'color-white' }}
                    line
                    data={displayedData}
                    dataKey={valueKey}
                    nameKey={labelKey}
                    innerRadius={40}
                    outerRadius={100}
                    strokeWidth={5}
                    activeIndex={activeIndex}
                    activeShape={({ outerRadius = 0, ...props }) => (
                      <g>
                        <Sector {...props} outerRadius={outerRadius + 5} />
                        <Sector {...props} outerRadius={outerRadius + 12} innerRadius={outerRadius + 7} />
                      </g>
                    )}
                    onClick={(_, idx) => {
                      setSelected(displayedData[idx]?.[labelKey]);
                      if (onSelect) {
                        onSelect(displayedData[idx]);
                      }
                    }}
                    isAnimationActive={false}
                    cursor="pointer"
                    aria-label="Sector del gráfico"
                    tabIndex={0}
                    
                  >
                    {/* Etiqueta personalizada: nombre y cantidad */}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
          </div>
          {/* Leyenda opcional */}
          {showLegend && (
            <div
              className="w-full flex justify-center"
              style={{ minWidth: 0 }}
            >
              <div
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-x-2 gap-y-1  mb-1 px-1 text-[11px] leading-[1.1] max-w-[400px] w-full"
                aria-label="Leyenda del gráfico de pastel"
              >
                {[...displayedData]
                  .sort((a, b) => (b[valueKey] || 0) - (a[valueKey] || 0))
                  .map((item) => (
                    <div
                      key={item[labelKey]}
                      className="flex items-center gap-1 min-w-0 whitespace-nowrap overflow-hidden text-ellipsis"
                    >
                      <span
                        className="inline-block rounded-full border border-gray-300 mr-[3px] flex-shrink-0 w-[10px] h-[10px]"
                        style={{ background: item.fill }}
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
                  ))}
              </div>
            </div>
          )}

          {/* Contenedor fijo para total y seleccionado, evita movimiento */}
          <div className="flex flex-col justify-start min-h-[80px]">
            {/* Mostrar el total, permite custom render */}
            {/* Mostrar el seleccionado, permite custom render */}
            {selected && (
              renderSelected
                ? renderSelected(selected, coloredData.find(item => item[labelKey] === selected), total)
                : (
                  <div className="text-center w-full flex flex-col items-center gap-2">
                    <span className="font-medium text-base text-gray-500">
                      <span className="font-bold text-[#364153]">Seleccionado:</span> {selected}
                    </span>
                    <span
                      className="text-foreground font-bold px-4 py-1 rounded inline-block min-w-[60px] text-white"
                      style={{ background: coloredData.find(item => item[labelKey] === selected)?.fill || '#eee' }}
                      aria-label={`Valor de ${selected}`}
                    >
                      {labelTotal ? `${labelTotal}: ` : ''}
                      {coloredData.find(item => item[labelKey] === selected)?.[valueKey]?.toLocaleString()}
                      {total > 0 && (
                        <span className="ml-2 text-xs text-white/80">
                          ({(((coloredData.find(item => item[labelKey] === selected)?.[valueKey] || 0) / total) * 100).toFixed(2)}%)
                        </span>
                      )}
                    </span>
                    
                  </div>
                )
            )}
          </div>
        </div>
      </CardContent>

    </Card>
  );
}



MoleculesChartPie.propTypes = {
  /** Datos a graficar. Cada objeto debe tener una clave de label y value. */
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  /** Configuración visual y de colores. */
  config: PropTypes.object,
  /** Clave del label en cada objeto de data. */
  labelKey: PropTypes.string,
  /** Clave del valor numérico en cada objeto de data. */
  valueKey: PropTypes.string,
  /** Título del gráfico. */
  title: PropTypes.string,
  /** Descripción opcional. */
  description: PropTypes.string,
  /** Etiqueta para mostrar el total. */
  labelTotal: PropTypes.string,
  /** Array de colores personalizados. */
  colors: PropTypes.arrayOf(PropTypes.string),
  /** Función para calcular el total. */
  getTotal: PropTypes.func,
  /** Función para asignar colores a los datos. */
  assignColors: PropTypes.func,
  /** Función para ordenar los datos. */
  sortData: PropTypes.func,
  /** Render personalizado para el elemento seleccionado. */
  renderSelected: PropTypes.func,
  /** Callback al seleccionar un segmento. */
  onSelect: PropTypes.func,
  /** Label seleccionado externamente. */
  selectedLabel: PropTypes.string,
  /** Si se debe mostrar la leyenda de colores debajo del gráfico. */
  showLegend: PropTypes.bool,
};

MoleculesChartPie.defaultProps = {
  config: {},
  labelKey: 'label',
  valueKey: 'value',
  title: '',
  description: '',
  labelTotal: 'Total',
  colors: [],
  getTotal: (data, valueKey) => data.reduce((acc, item) => acc + (Number(item[valueKey]) || 0), 0),
  assignColors: (data, colors) => data.map((d, i) => ({ ...d, fill: colors[i % colors.length] })),
  sortData: (data, valueKey) => [...data].sort((a, b) => b[valueKey] - a[valueKey]),
  renderSelected: undefined,
  onSelect: undefined,
  selectedLabel: undefined,
  showLegend: false,
};

// Sugerencia de extensión: si se requiere lógica de filtrado avanzada, considerar un hook personalizado
// Ejemplo: usePieChartData({ data, labelKey, valueKey, ... })

export default MoleculesChartPie;
