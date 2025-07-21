// import React from 'react';  // Not needed with new JSX transform
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@src/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { ChevronsUpDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import PropTypes from 'prop-types';
import { SelectField } from '@components/molecules/fields/SelectField';
import { Input } from '@/components/ui/input';

const FiltersGroup = ({ group, control, values, setValue, isLast, onEstadoChange, onMunicipioChange, onActividadChange, onSectorChange }) => {
  const activeCount = group.fields.filter((f) => {
    const v = values[f.name];
    return v !== undefined && v !== '';
  }).length;

  return (
    <Collapsible defaultOpen>
      <div className="flex items-center justify-between relative">
        <div className="flex items-center gap-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="absolute left-1/2 transform -translate-x-1/2 px-0 text-sm text-zinc-900 font-semibold">
              {group.title}
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon">
            <ChevronsUpDown />
            <span className="sr-only">Toggle {group.title}</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      {activeCount > 0 && (
        <div className="flex justify-center mb-4 space-x-2">
          <Badge className="bg-green text-primary font-bold">Filtros aplicados: {activeCount}</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => group.fields.forEach(f => setValue(f.name, ''))}
          >
            Limpiar
          </Button>
        </div>
      )}
      <CollapsibleContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {group.fields.map((input) => (
            <FormField
              key={input.name}
              control={control}
              name={input.name}
              render={({ field }) => {
                // Detectar selects de estado y municipio para disparar handlers
                const handleChange = (value) => {
                  field.onChange(value);
                  // Estado -> Municipios
                  if (input.name === 'id_estado' && typeof onEstadoChange === 'function') {
                    onEstadoChange(value);
                    setValue('id_municipio', '');
                    setValue('id_parroquia', '');
                  }
                  // Municipio -> Parroquias
                  if (input.name === 'id_municipio' && typeof onMunicipioChange === 'function') {
                    onMunicipioChange(value);
                    setValue('id_parroquia', '');
                  }
                  // Actividad económica -> Sector productivo
                  if (input.name === 'id_actividad_economica' && typeof onActividadChange === 'function') {
                    onActividadChange(value);
                    setValue('id_sector_productivo', '');
                    setValue('id_sub_sector_productivo', '');
                  }
                  // Sector productivo -> Subsector productivo
                  if (input.name === 'id_sector_productivo' && typeof onSectorChange === 'function') {
                    onSectorChange(value);
                    setValue('id_sub_sector_productivo', '');
                  }
                };
                return (
                  <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                      {input.type === 'select' ? (
                        <SelectField
                          field={{
                            ...field,
                            onChange: handleChange,
                          }}
                          options={input.options}
                          placeholder={input.placeholder}
                        />
                      ) : (
                        <Input
                          type={input.type}
                          placeholder={input.placeholder}
                          {...field}
                        />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default FiltersGroup;
/**
 * Prop types validation for FiltersGroup
 */
FiltersGroup.propTypes = {
  group: PropTypes.shape({
    title: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        label: PropTypes.string,
        type: PropTypes.string,
        placeholder: PropTypes.string,
        options: PropTypes.array,
      })
    ).isRequired,
  }).isRequired,
  control: PropTypes.object.isRequired,
  values: PropTypes.object.isRequired,
  setValue: PropTypes.func.isRequired,
  isLast: PropTypes.bool,
  onEstadoChange: PropTypes.func,
  onMunicipioChange: PropTypes.func,
  onActividadChange: PropTypes.func,
  onSectorChange: PropTypes.func,
};
FiltersGroup.defaultProps = {
  isLast: false,
  onEstadoChange: undefined,
  onMunicipioChange: undefined,
  onActividadChange: undefined,
  onSectorChange: undefined,
};
