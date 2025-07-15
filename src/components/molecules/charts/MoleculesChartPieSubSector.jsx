import * as React from "react";
import { Pie, PieChart, Sector, Label } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartStyle, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { pieSubSectorColors } from "@/lib/data/pieSubSectorColors";

function MoleculesChartPieSubSector({ data, config, labelKey = "label", valueKey = "value", title = "Sub Sectores Productivos", description = "", }) {
  const id = "pie-subsector";
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState(data?.[0]?.[labelKey] || "");

  // Paleta de colores por defecto
  const defaultColors = pieSubSectorColors;

  // Asignar color a cada elemento si no tiene
  const coloredData = React.useMemo(() =>
    data.map((item, idx) => ({
      ...item,
      fill: item.fill || defaultColors[idx % defaultColors.length]
    })),
    [data]
  );

  // Ordenar los datos por cantidad descendente para el combobox
  const sortedData = React.useMemo(() =>
    [...coloredData].sort((a, b) => (b[valueKey] || 0) - (a[valueKey] || 0)),
    [coloredData, valueKey]
  );

  const activeIndex = React.useMemo(() => coloredData.findIndex((item) => item[labelKey] === selected), [selected, coloredData, labelKey]);
  const options = React.useMemo(() => sortedData.map((item) => item[labelKey]), [sortedData, labelKey]);

  // Calcular el total de todos los subsectores
  const total = React.useMemo(() => coloredData.reduce((acc, item) => acc + (item[valueKey] || 0), 0), [coloredData, valueKey]);

  return (
    <Card data-chart={id} className="flex flex-col h-full">
      <ChartStyle id={id} config={config} />
      <CardHeader className="flex-row items-start space-y-0 pb-0 justify-center">
        <div className="grid gap-1 w-full place-items-center">
          <CardTitle className="text-center w-full">{title}</CardTitle>
          <CardDescription className="mt-1 text-muted-foreground text-center w-full">{description}</CardDescription>
          {/* Combobox debajo del subtítulo */}
          <div className="mt-2 w-full max-w-xs mx-auto flex justify-center">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className="h-7 w-full rounded-lg pl-2.5 justify-between overflow-hidden text-ellipsis whitespace-nowrap">
                  <span className="block w-full truncate text-left">
                    {selected ? options.find((o) => o === selected) : "Seleccione..."}
                  </span>
                  <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full min-w-[180px] max-w-xs p-0">
                <Command>
                  <CommandInput placeholder="Buscar..." className="h-9" />
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
                        >
                          <span className="block w-full truncate text-left flex items-center gap-2">
                            <span className="text-xs text-muted-foreground min-w-[40px] text-left">{item[valueKey]?.toLocaleString()}</span>
                            <span className="truncate">{item[labelKey]}</span>
                          </span>
                          <Check className={cn("ml-auto", selected === item[labelKey] ? "opacity-100" : "opacity-0")} />
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
        <ChartContainer id={id} config={config} className="mx-auto aspect-square w-full max-w-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={coloredData}
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
            >
              {/* Sin Label en el centro */}
            </Pie>
          </PieChart>
        </ChartContainer>
        {/* Mostrar el subsector seleccionado y su valor debajo del gráfico */}
        <div className="mb-2 text-center w-full">
          <span className="font-bold text-base text-gray-700">Total: {total.toLocaleString()}</span>
        </div>
        {selected && (
          <div className="text-center w-full flex flex-col items-center gap-2">
            <span
              className="text-foreground font-bold px-4 py-1 rounded"
              style={{ background: coloredData[activeIndex]?.fill || '#eee', color: '#fff', display: 'inline-block', minWidth: 60 }}
            >
              {coloredData[activeIndex]?.[valueKey]?.toLocaleString()}
              {total > 0 && (
                <span className="ml-2 text-xs text-white/80">
                  ({((coloredData[activeIndex]?.[valueKey] / total) * 100).toFixed(2)}%)
                </span>
              )}
            </span>
            <span className="font-medium text-base text-muted-foreground">
              <span className="font-bold text-gray-700">Subsector seleccionado:</span> {selected}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default MoleculesChartPieSubSector;
