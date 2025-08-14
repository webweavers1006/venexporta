import { useState, useEffect } from "react";
import { Controller } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage} from "@src/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@src/components/ui/select";
import { fetchPaises } from '@lib/api/apiIndex'; // Importa la función fetchPaises
import { Input } from "@src/components/ui/input";
import { Textarea } from "@src/components/ui/textarea";

//✅Components traduction
import { useTranslation } from "react-i18next";

const CompanyFormFields = ({ form }) => {
  const { t } = useTranslation();
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
            <FormLabel>{t("company_name_label")}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("company_name_placeholder")} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        name="descripcion"
        control={form.control}
        render={({ field }) => (
          <FormItem className="col-span-2 sm:col-span-2">
            <FormLabel>{t("company_description_label")}</FormLabel>
            <FormControl>
              <Textarea {...field} placeholder={t("company_description_placeholder")} />
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
            <FormLabel>{t("company_country_label")}</FormLabel>
            <FormControl>
              <Controller
                name="idPais"
                control={form.control}
                render={({ field }) => (
                  <Select {...field} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("company_country_placeholder")} />
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
            <FormLabel>{t("company_rif_label")}</FormLabel>
            <FormControl>
              <Input {...field} placeholder={t("company_rif_placeholder")} />
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
            <FormLabel>{t("company_area_code_label")}</FormLabel>
            <FormControl>
              <Controller
                name="idPaisCodigo"
                control={form.control}
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => {
                      const paisSeleccionado = paises.find((pais) => pais.id.toString() === value);
                      form.setValue('codigoArea', paisSeleccionado?.codigo.toString() || "");
                      field.onChange(value);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("company_area_code_placeholder")} />
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
            <FormLabel>{t("company_phone_label")}</FormLabel>
            <div className="flex items-center gap-2">
              <FormControl>
                <div className="flex items-center border border-gray-300 rounded-md w-20 text-center">
                  <span className="ml-1">+</span>
                  <Input
                    value={
                      paises.find((pais) => pais.id.toString() === form.watch("idPaisCodigo"))?.codigo || ""
                    }
                    readOnly
                    className="text-center border-none focus:ring-0 pl-0"
                  />
                </div>
              </FormControl>
              <div className="flex-1">
                <FormControl>
                  <Input {...field} placeholder={t("company_phone_placeholder")} />
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
