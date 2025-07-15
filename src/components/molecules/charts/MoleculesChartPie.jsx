
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
import { pieSubSectorColors } from "@/lib/data/pieSubSectorColors";
import { useChartExport } from "./useChartExport";
import { assignColors, sortDataDesc, getTotal } from "./chartPieHelpers";




/**
 * MoleculesChartPie
 *
 * Gráfico de torta interactivo con selección y exportación (imagen y Excel).
 *
 * @component
 * @param {Object} props
 * @param {Array<Object>} props.data - Datos a graficar. Cada objeto debe tener una clave de label y value.
 * @param {Object} [props.config] - Configuración visual del gráfico.
 * @param {string} [props.labelKey="label"] - Clave del label en cada objeto de data.
 * @param {string} [props.valueKey="value"] - Clave del valor numérico en cada objeto de data.
 * @param {string} [props.title="Sub Sectores Productivos"] - Título del gráfico.
 * @param {string} [props.description] - Descripción opcional.
 *
 * @example
 * <MoleculesChartPie
 *   data={[{ label: "Sector A", value: 10 }, { label: "Sector B", value: 20 }]}
 *   config={{}}
 *   title="Mi gráfico"
 *   description="Descripción opcional"
 * />
 */
function MoleculesChartPie({
  data,
  config,
  labelKey = "label",
  valueKey = "value",
  title = "Sub Sectores Productivos",
  description = "",
  showMoreThreshold = 10,
  showMoreCount = 10
}) {
  const id = "pie-subsector";
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(data?.[0]?.[labelKey] || "");
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

  // Helpers para datos
  const coloredData = useMemo(() => assignColors(data, pieSubSectorColors), [data]);
  // Siempre ordenar para el combobox de mayor a menor
  const sortedData = useMemo(() => sortDataDesc(coloredData, valueKey), [coloredData, valueKey]);
  const options = useMemo(() => sortedData.map((item) => item[labelKey]), [sortedData, labelKey]);
  const total = useMemo(() => getTotal(coloredData, valueKey), [coloredData, valueKey]);
  // Estado para mostrar solo los top N o todos
  const [showTop, setShowTop] = useState(false);
  // Estado para el input de top N
  const [topN, setTopN] = useState(showMoreThreshold);
  // Por defecto mostrar todos
  const displayedData = useMemo(() => {
    if (showTop && coloredData.length > topN) {
      // Ordenar por valor descendente y tomar los top N
      return [...coloredData].sort((a, b) => b[valueKey] - a[valueKey]).slice(0, topN);
    }
    return coloredData;
  }, [showTop, coloredData, topN, valueKey]);
  const activeIndex = useMemo(() => displayedData.findIndex((item) => item[labelKey] === selected), [selected, displayedData, labelKey]);

  // Si el seleccionado no existe en los datos, seleccionar el primero
  useEffect(() => {
    if (options.length > 0 && !options.includes(selected)) {
      setSelected(options[0]);
    }
  }, [options, selected]);

  // Si al cambiar el filtro, el seleccionado no está visible, selecciona el primero visible
  useEffect(() => {
    if (displayedData.length > 0 && !displayedData.some(item => item[labelKey] === selected)) {
      setSelected(displayedData[0][labelKey]);
    }
  }, [displayedData, selected, labelKey]);

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
          {/* Botón y input para mostrar top N arriba del gráfico */}
          {coloredData.length > showMoreCount && (
            <div className="flex items-center gap-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTop((prev) => !prev)}
                aria-label={showTop ? `Ver todos` : `Ver top ${topN} con más valor`}
              >
                {showTop ? `Ver todos` : `Ver top ${topN} con más valor`}
              </Button>
              <input
                type="number"
                min={1}
                max={coloredData.length}
                value={topN}
                onChange={e => {
                  const val = Math.max(1, Math.min(coloredData.length, Number(e.target.value)));
                  setTopN(val);
                }}
                className="border rounded px-2 py-1 w-16 text-sm"
                style={{ width: 50 }}
                aria-label="Cantidad de elementos a mostrar"
                disabled={!showTop}
              />
            </div>
          )}
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
            <ChartContainer id={id} config={config} className="mx-auto aspect-square w-full max-w-[300px]">
              <PieChart aria-label="Gráfico de torta de subsectores">
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
          {/* Mostrar el total */}
          <div className="mb-2 text-center w-full">
            <span className="font-bold text-base" style={{ color: '#364153' }}>Total: {total.toLocaleString()}</span>
          </div>
          {/* Mostrar el subsector seleccionado y su valor debajo del gráfico */}
          {selected && (
            <div className="text-center w-full flex flex-col items-center gap-2">
              <span
                className="text-foreground font-bold px-4 py-1 rounded"
                style={{ background: coloredData.find(item => item[labelKey] === selected)?.fill || '#eee', color: '#fff', display: 'inline-block', minWidth: 60 }}
                aria-label={`Valor de ${selected}`}
              >
                {coloredData.find(item => item[labelKey] === selected)?.[valueKey]?.toLocaleString()}
                {total > 0 && (
                  <span className="ml-2 text-xs text-white/80">
                    ({(((coloredData.find(item => item[labelKey] === selected)?.[valueKey] || 0) / total) * 100).toFixed(2)}%)
                  </span>
                )}
              </span>
              <span className="font-medium text-base" style={{ color: '#6b7280' }}>
                <span className="font-bold" style={{ color: '#364153' }}>Subsector seleccionado:</span> {selected}
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

MoleculesChartPie.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      value: PropTypes.number,
      fill: PropTypes.string
    })
  ).isRequired,
  config: PropTypes.object,
  labelKey: PropTypes.string,
  valueKey: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  showMoreThreshold: PropTypes.number,
  showMoreCount: PropTypes.number,
};

export default MoleculesChartPie;
