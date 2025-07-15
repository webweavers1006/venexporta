import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage} from "@src/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@src/components/ui/select";
import { fetchPaises } from '@lib/api/apiUser'; // Importa la función fetchPaises
import { Input } from "@src/components/ui/input";

const CompanyFormFields = ({ form }) => {
  const [paises, setPaises] = useState([]); // Estado para almacenar los países

  useEffect(() => {
    const obtenerPaises = async () => {
      try {
        const paisesData = await fetchPaises();
        setPaises(paisesData);
      } catch (error) {
        console.error('Error fetching countries:', error);
      }
    };

    obtenerPaises();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-6">
      <FormField
        name="nombreEmpresa"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-2">
            <FormLabel>Nombre de la Empresa</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Nombre de la Empresa" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="idPais"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>País</FormLabel>
            <FormControl>
              <Controller
                name="idPais"
                control={form.control}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      {paises.map((pais) => (
                        <SelectItem key={pais.id} value={pais.id.toString()}>
                          {pais.pais}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="rif"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>Número de Identificación Fiscal</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Número de Identificación Fiscal" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="codigoArea"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>Codigo de Area</FormLabel>
            <FormControl>
              <Controller
                name="codigoArea"
                control={form.control}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una opción" />
                    </SelectTrigger>
                    <SelectContent>
                      {paises.map((pais) => (
                        <SelectItem key={pais.id} value={pais.id.toString()}>
                          {pais.pais}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="telefono"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-1">
            <FormLabel>Telefono de Contacto</FormLabel>
            <div className="flex items-center gap-2">
              <FormControl>
                <div className="flex items-center border border-gray-300 rounded-md w-20 text-center">
                  <span className="ml-1">+</span>
                  <Input
                    value={
                      paises.find((pais) => pais.id.toString() === form.watch("codigoArea"))?.codigo || ""
                    }
                    readOnly
                    className="text-center border-none focus:ring-0 pl-0"
                  />
                </div>
              </FormControl>
              <div className="flex-1">
                <FormControl>
                  <Input {...field} placeholder="04123456789" />
                </FormControl>
              </div>
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default CompanyFormFields;
