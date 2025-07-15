import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { ChevronsUpDown, Check } from "lucide-react";

/**
 * Selector de país reutilizable para dashboards.
 */
function MoleculesCountrySelector({ paises, selectedPais, onSelectPais }) {
  const [openPais, setOpenPais] = useState(false);
  return (
    <div className="mb-4 flex flex-row items-center gap-2">
      <label className="font-semibold">Filtrar por país:</label>
      <Popover open={openPais} onOpenChange={setOpenPais}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openPais}
            className="w-[200px] justify-between"
          >
            {selectedPais
              ? paises.find((p) => p.id === selectedPais)?.pais
              : "Seleccione país..."}
            <ChevronsUpDown className="opacity-50 ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command
            filter={(value, search) => {
              const pais = paises.find((p) => String(p.id) === value);
              return pais?.pais?.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
            }}
          >
            <CommandInput placeholder="Buscar país..." className="h-9" />
            <CommandList>
              <CommandEmpty>No se encontró país.</CommandEmpty>
              <CommandGroup>
                {paises.map((p) => (
                  <CommandItem
                    key={p.id}
                    value={String(p.id)}
                    onSelect={() => {
                      onSelectPais(p.id);
                      setOpenPais(false);
                    }}
                  >
                    {p.pais}
                    <Check
                      className={
                        "ml-auto " +
                        (selectedPais === p.id ? "opacity-100" : "opacity-0")
                      }
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default MoleculesCountrySelector;
