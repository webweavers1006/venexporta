import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartStyle, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import MoleculesChartPieExportIcons from "./MoleculesChartPieExportIcons";
import { useChartExport } from "./useChartExport";



const MESES = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];


/**
 * Componente de gráfico de área para datos mensuales genéricos.
 * Props:
 * - data: array de objetos con al menos { mes, [valueKey] }
 * - anio: año seleccionado
 * - onChangeAnio: función para cambiar el año
 * - aniosDisponibles: array de años
 * - label: etiqueta para la leyenda y tooltip (ej: "Empresas", "Eventos")
 * - valueKey: clave del valor numérico (ej: "empresas", "cantidad", "cantidad_eventos")
 * - xKey: clave del eje X (por defecto "mes")
 * - color: color principal (CSS var o hex)
 * - title: título del gráfico
 * - description: descripción opcional
 */
function ChartAreaMeses({
  data,
  anio,
  onChangeAnio,
  aniosDisponibles,
  label,
  valueKey,
  xKey,
  color,
  title,
  description
}) {
  // Normalizar los datos para asegurar que todos los meses estén presentes
  const chartData = React.useMemo(() => {
    const mapMeses = {};
    (data || []).forEach(item => {
      mapMeses[item[xKey]] = Number(item[valueKey]) || 0;
    });
    return MESES.map(mes => ({
      [xKey]: mes,
      [valueKey]: mapMeses[mes] || 0
    }));
  }, [data, valueKey, xKey]);

  // Configuración para leyenda y tooltip
  const chartConfig = React.useMemo(() => ({
    [valueKey]: {
      label: label,
      color: color,
    },
  }), [label, color, valueKey]);


  // Calcular el total anual
  const total = React.useMemo(() => chartData.reduce((acc, item) => acc + (Number(item[valueKey]) || 0), 0), [chartData, valueKey]);

  // Referencias para exportar
  const exportRef = React.useRef(null);
  const id = `area-meses-${label}`;
  // Export hooks
  const { handleDownload, handleExportExcel } = useChartExport({
    exportRef,
    id,
    title,
    data: chartData,
    labelKey: xKey,
    valueKey
  });

  return (
    <Card className="pt-0 h-full flex justify-center relative">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-2 space-y-0 border-b py-5">
        <div className="flex-1 w-full">
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
          <span className="text-sm font-semibold text-gray-700 mt-1 block">
            Total: {total.toLocaleString()} {label?.toLowerCase()}
          </span>
        </div>
        <div className="flex flex-row items-center gap-2 w-full sm:w-auto justify-end">
          <MoleculesChartPieExportIcons
            onDownloadImage={handleDownload}
            onDownloadExcel={handleExportExcel}
            aria-label="Exportar gráfico"
          />
          <Select value={anio} onValueChange={onChangeAnio}>
            <SelectTrigger className="w-[120px] rounded-lg" aria-label="Seleccionar año">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {aniosDisponibles.map((a) => (
                <SelectItem key={a} value={String(a)} className="rounded-lg">
                  {a}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <div ref={exportRef}>
          {/* Título solo para la imagen exportada */}
          <div
            className="w-full text-center mb-2 only-export-title"
            style={{ fontWeight: 700, fontSize: 18, color: '#364153', display: 'none' }}
          >
            {title}
          </div>
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id={`fillArea${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={color} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis dataKey={xKey} tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey={valueKey}
                type="monotone"
                fill={`url(#fillArea${label})`}
                stroke={color}
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export default ChartAreaMeses;