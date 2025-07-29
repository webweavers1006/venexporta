import React, { useMemo, useState, useRef } from "react";
import PropTypes from "prop-types";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Legend } from "recharts";
import MoleculesChartPieExportIcons from "./MoleculesChartPieExportIcons";
import { useChartExport } from "./useChartExport";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, Check } from "lucide-react";

/**
 * MoleculesChartBarMultiple
 *
 * Gráfico de barras comparativas para eventos, permitiendo seleccionar el evento a mostrar.
 *
 * @param {Object} props
 * @param {Array} props.data - Arreglo de objetos con estructura { evento, participantes_por_eventos, invitados_por_eventos }
 * @param {string} [props.title] - Título del gráfico
 * @param {string} [props.description] - Descripción del gráfico
 */
export default function MoleculesChartBarMultiple({ data = [], title = "Comparativa de Participantes e Invitados", description = "Seleccione un evento para comparar" }) {
  const [selectedEvento, setSelectedEvento] = useState(data[0]?.evento || "");
  // Referencia para exportar el área del gráfico
  const exportRef = useRef(null);
  // Hook de exportación
  const { handleDownload, handleExportExcel } = useChartExport({
    exportRef,
    id: `bar-multiple-chart-${selectedEvento}`,
    title,
    data,
    labelKey: "evento",
    valueKey: "participantes_por_eventos" // o "invitados_por_eventos", según lo que se quiera exportar
  });

  // Opciones para el combobox
  const eventosOptions = useMemo(() => data.map(ev => ev.evento), [data]);

  // Datos filtrados para el evento seleccionado
  const chartData = useMemo(() => {
    const evento = data.find(ev => ev.evento === selectedEvento);
    if (!evento) return [];
    return [
      {
        name: evento.evento,
        Participantes: Number(evento.participantes_por_eventos) || 0,
        Invitados: Number(evento.invitados_por_eventos) || 0,
      },
    ];
  }, [data, selectedEvento]);

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {/* Botones de exportación */}
        <MoleculesChartPieExportIcons
          onDownloadImage={handleDownload}
          onDownloadExcel={handleExportExcel}
        />
      </CardHeader>
      <CardContent>
        {/* Área exportable */}
        <div ref={exportRef}>
          <div className="mt-2 w-full max-w-xs mx-auto flex flex-col items-center gap-2 p-6">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded="true"
                  className="h-7 w-full rounded-lg pl-2.5 justify-between overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  <span className="block w-full truncate text-left">
                    {selectedEvento || "Seleccionar evento"}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-[180px] max-w-xs p-0">
                <Command>
                  <CommandInput placeholder="Buscar evento..." className="h-9" />
                  <CommandList>
                    <CommandEmpty>No se encontraron eventos.</CommandEmpty>
                    <CommandGroup>
                      {eventosOptions.map((evento) => (
                        <CommandItem
                          key={evento}
                          value={evento}
                          onSelect={() => setSelectedEvento(evento)}
                        >
                          <span className="block w-full truncate text-left flex items-center gap-2">
                            <span className="truncate">{evento}</span>
                          </span>
                          <Check className={"ml-auto " + (selectedEvento === evento ? "opacity-100" : "opacity-0")} />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          <ChartContainer config={{ Participantes: { label: "Participantes", color: "#3b82f6" }, Invitados: { label: "Invitados", color: "#22c55e" } }}>
            <BarChart width={400} height={250} data={chartData} barGap={16}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="name" tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} />
              <Legend />
              <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
              <Bar dataKey="Participantes" fill="#3b82f6" radius={4} />
              <Bar dataKey="Invitados" fill="#22c55e" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="text-muted-foreground leading-none">Comparativa de participantes e invitados por evento</div>
      </CardFooter>
    </Card>
  );
}

MoleculesChartBarMultiple.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      evento: PropTypes.string.isRequired,
      participantes_por_eventos: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      invitados_por_eventos: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
  title: PropTypes.string,
  description: PropTypes.string,
};
