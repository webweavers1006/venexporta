import { useState } from "react";
import { Button } from "@src/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@src/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@src/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@src/lib/utils";

const ComboboxField = ({ field, options, placeholder, onChange }) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(field.value || "");
  const [visibleOptions, setVisibleOptions] = useState(10); // Mostrar inicialmente 10 opciones

  // Opciones visibles según el límite actual
  const displayedOptions = options.slice(0, visibleOptions);

  const handleLoadMore = () => {
    // Cargar 10 opciones más al hacer clic en "Cargar más"
    setVisibleOptions((prev) => Math.min(prev + 10, options.length));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? options.find((option) => option.value === value)?.label
            : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder={`Buscar ${placeholder}...`} className="h-9" />
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            <CommandGroup>
              {displayedOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label || ""}
                  onSelect={() => {
                    const newValue = option.value === value ? "" : option.value;
                    setValue(newValue);
                    onChange(newValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      option.value === value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
              {visibleOptions < options.length && (
                <div
                  className="text-center py-2 cursor-pointer text-sm text-blue-500"
                  onClick={handleLoadMore}
                >
                  Cargar más
                </div>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default ComboboxField;
