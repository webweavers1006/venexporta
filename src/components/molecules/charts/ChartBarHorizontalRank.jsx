"use client"

import React from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

/**
 * Componente reutilizable para rankings horizontales.
 * Props:
 * - data: array de objetos con los datos a graficar
 * - valueKey: clave del valor numérico (ej: "participantes_por_eventos")
 * - labelKey: clave del label/categoría (ej: "evento")
 * - title: título del gráfico
 * - description: descripción opcional
 * - color: color de la barra (CSS var o hex)
 * - valueLabel: etiqueta para la leyenda/tooltip
 * - footer: contenido opcional para el footer
 */
export function ChartBarHorizontalRank({
  data = [],
  valueKey = "participantes_por_eventos",
  labelKey = "evento",
  title = "Ranking",
  description = "",
  color = "var(--chart-1)",
  valueLabel = "Participantes",
  footer = null,
}) {
  // Normaliza los valores numéricos
  const chartData = React.useMemo(
    () =>
      data.map((item) => ({
        ...item,
        [valueKey]: Number(item[valueKey]) || 0,
      })),
    [data, valueKey]
  )

  const chartConfig = React.useMemo(
    () => ({
      [valueKey]: {
        label: valueLabel,
        color,
      },
    }),
    [valueKey, valueLabel, color]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: -20 }}
            width={400}
            height={Math.max(60, chartData.length * 24)}
          >
            <XAxis type="number" dataKey={valueKey} hide />
            <YAxis
              dataKey={labelKey}
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={200}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey={valueKey} fill={color} radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      {footer !== null ? (
        <CardFooter>{footer}</CardFooter>
      ) : (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          
        </CardFooter>
      )}
    </Card>
  )
}
