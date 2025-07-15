import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@src/components/ui/select";

export const SelectField = ({ field, options, placeholder }) => {
  return (
    <Select
      value={field.value || ""} // Asegurar que el valor inicial sea válido
      onValueChange={(value) => {
        field.onChange(value); // Actualizar el valor en el formulario
      }}
    >
      <SelectTrigger>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value.toString()}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
