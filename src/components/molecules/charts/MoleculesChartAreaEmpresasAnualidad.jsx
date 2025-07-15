import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartStyle, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const chartConfig = {
  empresas: {
    label: "Empresas",
    color: "var(--chart-1)",
  },
};

const MESES = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];

function MoleculesChartAreaEmpresasAnualidad({ data, anio, onChangeAnio, aniosDisponibles }) {
  // Normalizar los datos para asegurar que todos los meses estén presentes
  const chartData = React.useMemo(() => {
    const mapMeses = {};
    (data || []).forEach(item => {
      mapMeses[item.mes] = Number(item.cantidad_empresa) || 0;
    });
    return MESES.map(mes => ({
      mes,
      empresas: mapMeses[mes] || 0
    }));
  }, [data]);

  return (
    <Card className="pt-0 h-full flex justify-center">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>Empresas por Mes</CardTitle>
          <CardDescription>
            Total de empresas registradas por mes en el año seleccionado
          </CardDescription>
        </div>
        <Select value={anio} onValueChange={onChangeAnio}>
          <SelectTrigger className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex" aria-label="Seleccionar año">
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
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillEmpresas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-empresas)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-empresas)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="mes" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
            <Area
              dataKey="empresas"
              type="natural"
              fill="url(#fillEmpresas)"
              stroke="var(--color-empresas)"
              stackId="a"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default MoleculesChartAreaEmpresasAnualidad;