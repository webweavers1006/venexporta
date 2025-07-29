
import React, { useState, useRef, useMemo, useEffect } from "react";
import PropTypes from "prop-types";
import { Pie, PieChart, Sector } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import MoleculesChartPieExportIcons from "./MoleculesChartPieExportIcons";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useChartExport } from "./useChartExport";




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
  selectedLabel
}) {
  // id único por instancia
  const id = useMemo(() => `pie-chart-${Math.random().toString(36).slice(2, 10)}`,[/*empty*/]);
  const [open, setOpen] = useState(false);
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
  const chartRef = useRef(null);
  const exportRef = useRef(null);

  // Export hooks
  const { handleDownload, handleExportExcel } = useChartExport({
    exportRef,
    id,
    title,
    data,
    labelKey,
    valueKey
  });

  // Helpers para datos (totalmente parametrizables)
  const coloredData = useMemo(() => assignColors(data, colors), [data, colors, assignColors]);
  const sortedData = useMemo(() => sortData(coloredData, valueKey), [coloredData, valueKey, sortData]);
  const options = useMemo(() => sortedData.map((item) => item[labelKey]), [sortedData, labelKey]);
  const total = useMemo(() => getTotal(coloredData, valueKey), [coloredData, valueKey, getTotal]);
  // Por defecto mostrar todos
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
            className="w-full text-center mb-2 only-export-title"
            style={{ fontWeight: 700, fontSize: 18, color: '#364153', display: 'none' }}
          >
            {title}
          </div>
          <div ref={chartRef} className="w-full flex flex-col items-center">
            {/* Contenedor fijo y padding extra para evitar que el layout se mueva al seleccionar sectores */}
            <div style={{ width: 340, height: 360, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'visible', paddingBottom: 30 }}>
              <ChartContainer id={id} config={config} className="mx-auto aspect-square w-full max-w-[320px] min-w-[320px] min-h-[320px]">
                <PieChart width={320} height={320} aria-label="Gráfico de torta de subsectores" style={{ overflow: 'visible' }}>
                  <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                  <Pie
                    data={displayedData}
                    dataKey={valueKey}
                    nameKey={labelKey}
                    innerRadius={60}
                    strokeWidth={5}
                    activeIndex={activeIndex}
                    activeShape={({ outerRadius = 0, ...props }) => (
                      <g>
                        <Sector {...props} outerRadius={outerRadius + 10} />
                        <Sector {...props} outerRadius={outerRadius + 25} innerRadius={outerRadius + 12} />
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
                    {/* Sin Label en el centro */}
                  </Pie>
                </PieChart>
              </ChartContainer>
            </div>
          </div>
          {/* Contenedor fijo para total y seleccionado, evita movimiento */}
          <div style={{ minHeight: 80, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
            {/* Mostrar el total, permite custom render */}
            {/* Mostrar el seleccionado, permite custom render */}
            {selected && (
              renderSelected
                ? renderSelected(selected, coloredData.find(item => item[labelKey] === selected), total)
                : (
                  <div className="text-center w-full flex flex-col items-center gap-2">
                    <span className="font-medium text-base" style={{ color: '#6b7280' }}>
                      <span className="font-bold" style={{ color: '#364153' }}>Seleccionado:</span> {selected}
                    </span>
                    <span
                      className="text-foreground font-bold px-4 py-1 rounded"
                      style={{ background: coloredData.find(item => item[labelKey] === selected)?.fill || '#eee', color: '#fff', display: 'inline-block', minWidth: 60 }}
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
};

// Sugerencia de extensión: si se requiere lógica de filtrado avanzada, considerar un hook personalizado
// Ejemplo: usePieChartData({ data, labelKey, valueKey, ... })

export default MoleculesChartPie;
