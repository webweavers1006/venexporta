
import PropTypes from "prop-types";
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
import { useMemo, useRef } from "react";
import MoleculesChartPieExportIcons from "./MoleculesChartPieExportIcons";
import { useChartExport } from "./useChartExport";


export default function MoleculesEmpresasBarChart({
  data = [],
  anio,
  onChangeAnio,
  aniosDisponibles = [],
  title = "Empresas por Mes",
  description = "Total de empresas registradas por mes en el año seleccionado",
}) {
  // Referencia para exportar el área del gráfico
  const exportRef = useRef(null);
  // Hook de exportación
  const { handleDownload, handleExportExcel } = useChartExport({
    exportRef,
    id: `empresas-bar-chart-${anio}`,
    title,
    data,
    labelKey: "mes",
    valueKey: "empresas"
  });
  const chartConfig = {
    empresas: {
      label: "Empresas",
      color: "var(--green)",
    },
  };
  const totalEmpresas = data.reduce((acc, curr) => acc + (curr.empresas || 0), 0);

  // Calcular el máximo valor para normalizar
  const maxEmpresas = useMemo(() => data.reduce((max, curr) => Math.max(max, curr.empresas || 0), 0), [data]);

  // Función para obtener el color degradado basado en el valor
  const getBarColor = (valor) => {
    // Si no hay valor máximo, usar el color base
    if (!maxEmpresas) return 'var(--green)';
    // Normalizar el valor entre 0.5 y 1 para evitar barras muy claras
    const percent = 0.5 + 0.5 * (valor / maxEmpresas);
    // Usar color base var(--green) como color de fondo y solo modificar opacidad
    return `color-mix(in srgb, var(--green) ${percent * 100}%, transparent)`;
  };

  // Custom shape para aplicar color degradado por barra
  const CustomBar = (props) => {
    const { fill, x, y, width, height, payload } = props;
    return (
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill={getBarColor(payload.empresas)}
        rx={8}
      />
    );
  };

  return (
    <Card>
      <CardHeader className="relative">
        <div className="flex items-center justify-between w-full">
          <div className="w-full">
            <div className="flex items-center justify-between w-full">
              <CardTitle>{title}</CardTitle>
              <div className="flex items-center gap-2">
                <span className="font-medium">Año:</span>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={anio}
                  onChange={e => onChangeAnio(e.target.value)}
                  aria-label="Seleccionar año"
                >
                  {aniosDisponibles.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>
            <CardDescription>{description}</CardDescription>
            <div className="text-sm font-semibold text-primary">
              Total empresas: {totalEmpresas}
            </div>
          </div>
        </div>
        {/* Botones de exportación */}
        <MoleculesChartPieExportIcons
          onDownloadImage={handleDownload}
          onDownloadExcel={handleExportExcel}
        />
      </CardHeader>
      <CardContent>
        {/* Área exportable */}
        <div ref={exportRef}>
          <ChartContainer config={chartConfig}>
            <BarChart width={600} height={350} data={data} barGap={16}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="mes"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={value => value.slice(0, 3)}
              />
              <YAxis allowDecimals={false} />
              {/* <Legend /> */}
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <Bar dataKey="empresas" shape={<CustomBar />} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}

MoleculesEmpresasBarChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      mes: PropTypes.string.isRequired,
      empresas: PropTypes.number.isRequired,
    })
  ),
  anio: PropTypes.string.isRequired,
  onChangeAnio: PropTypes.func.isRequired,
  aniosDisponibles: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.number])).isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};
