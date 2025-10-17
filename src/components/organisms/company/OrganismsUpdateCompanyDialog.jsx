import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import companySchema from '@src/schema/companySchemaUpdate';
import ImageUpload from '@components/molecules/upload/MoleculesImageUpload';
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@src/components/ui/select";
import { updateCompanyData, fetchActividadesEmpresariales, fetchPaises } from "@lib/api/apiIndex";
import { estados } from "@lib/data/estados";
import { extraerMunicipios } from "@lib/data/municipios";
import { extraerParroquias } from "@lib/data/parroquias";
import { propiedad } from "@lib/data/propiedad";
import { useState, useEffect, useCallback } from 'react';
import { Textarea } from "@src/components/ui/textarea";

//✅Components traduction
import { useTranslation } from "react-i18next";

// Hook personalizado para cargar países
function usePaises() {
  const [paises, setPaises] = useState([]);
  useEffect(() => {
    fetchPaises().then(setPaises).catch(() => setPaises([]));
  }, []);
  return paises;
}

// Hook personalizado para cargar actividades empresariales
function useActividadesEmpresariales() {
  const [actividades, setActividades] = useState([]);
  useEffect(() => {
    fetchActividadesEmpresariales().then(setActividades).catch(() => setActividades([]));
  }, []);
  return actividades;
}

// Hook para municipios y parroquias dependientes
function useUbicacionVenezuela(idEstado, idMunicipio, companyData) {
  const [municipios, setMunicipios] = useState([]);
  const [parroquias, setParroquias] = useState([]);

  useEffect(() => {
    if (idEstado) {
      setMunicipios(extraerMunicipios(idEstado));
      setParroquias([]);
    } else {
      setMunicipios([]);
      setParroquias([]);
    }
  }, [idEstado]);

  useEffect(() => {
    if (idMunicipio) {
      setParroquias(extraerParroquias(idMunicipio));
    } else {
      setParroquias([]);
    }
  }, [idMunicipio]);

  return { municipios, parroquias };
}

// Componente reutilizable para campos Select
const SelectField = ({ name, control, label, options, placeholder, getOptionLabel, getOptionValue }) => (
  <FormField
    name={name}
    control={control}
    render={() => (
      <FormItem className="col-span-2 sm:col-span-1">
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Controller
            name={name}
            control={control}
            render={({ field }) => (
              <Select {...field} onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((opt) => (
                    <SelectItem key={getOptionValue(opt)} value={getOptionValue(opt)}>
                      {getOptionLabel(opt)}
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
);


const UpdateCompanyDialog = ({ companyData, onClose, onUpdate, message }) => {
  // Formulario react-hook-form
  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nombreEmpresa: companyData?.empresa || "",
      descripcion: companyData?.descripcion || "",
      rif: companyData?.rif || "",
      direccion: companyData?.direccion || "",
      idTipoActividadEmpresarial: companyData?.id_tipo_actividad_empresarial?.toString() || "",
      idTipoPropiedad: companyData?.id_tipo_propiedad?.toString() || "",
      idPais: companyData?.id_pais?.toString() || "",
      idEstado: companyData?.id_estado?.toString() || "",
      idMunicipio: companyData?.id_municipio?.toString() || "",
      idParroquia: companyData?.id_parroquia?.toString() || "",
    },
  });

  // Hooks personalizados para datos
  const actividadesEmpresariales = useActividadesEmpresariales();
  const idPaisValue = form.watch('idPais');
  const idEstadoValue = form.watch('idEstado');
  const idMunicipioValue = form.watch('idMunicipio');
  const { municipios, parroquias } = useUbicacionVenezuela(idEstadoValue, idMunicipioValue, companyData);

  // Manejo de envío
  const onSubmit = async (data) => {
    const formattedData = {
      nombre_empresa: data.nombreEmpresa,
      descripcion: data.descripcion,
      direccion: data.direccion,
      id_tipo_actividad_empresarial: data.idTipoActividadEmpresarial,
      id_tipo_propiedad: data.idTipoPropiedad,
      id_pais: data.idPais,
      ...(data.idPais === "95" && {
        id_estado: data.idEstado,
        id_municipio: data.idMunicipio,
        id_parroquia: data.idParroquia,
      }),
    };
    try {
      await updateCompanyData(formattedData, companyData.id);
      alert(t("companyForm.success"));
      onUpdate();
      onClose();
    } catch (error) {
      alert(t("companyForm.error"));
    }
  };

// Traducción
  const { t } = useTranslation();

  return (
    <DialogContent className="max-w-3xl w-full">
      <DialogHeader>
        <DialogTitle>{t("companyForm.dialogTitle")}</DialogTitle>
        <DialogDescription>
          {t("companyForm.dialogDescription")}

          {message && (
            <span className="text-red-500 block text-center p-4 bg-red-200 rounded-lg">{message}</span>
          )}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="bg-primary col-span-2 p-4 rounded-lg flex flex-col items-center justify-center">
              <ImageUpload
                companyId={companyData.id}
                fileType={["image/png", "image/jpeg"]}
                fileNameType="PNG - JPG"
                fileNumber={1}
                sendImage={true}
                color={'#fff'}
              />
            </div>
            <FormField
              name="nombreEmpresa"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>{t("companyForm.fields.name")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("companyForm.fields.name")} />
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
                  <FormLabel>{t("companyForm.fields.description")}</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder={t("companyForm.fields.description")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="direccion"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2 sm:col-span-1">
                  <FormLabel>{t("companyForm.fields.address")}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t("companyForm.fields.address")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SelectField
              name="idTipoActividadEmpresarial"
              control={form.control}
              label={t("companyForm.fields.activityType")}
              options={actividadesEmpresariales}
              placeholder={t("companyForm.fields.selectOption")}

              getOptionLabel={opt => opt.tipo_actividad_empresarial}
              getOptionValue={opt => opt.id.toString()}
            />
            <SelectField
              name="idTipoPropiedad"
              control={form.control}
              label={t("companyForm.fields.propertyType")}
              options={propiedad}
              placeholder={t("companyForm.fields.selectOption")}

              getOptionLabel={opt => opt.tipo_propiedad}
              getOptionValue={opt => opt.id}
            />
            {/* Mostrar Estado, Municipio y Parroquia solo si idPais es "95" */}
            {idPaisValue === "95" && (
              <>
                <SelectField
                  name="idEstado"
                  control={form.control}
                  label={t("companyForm.fields.state")}
                  options={estados}
                  placeholder={t("companyForm.fields.selectOption")}

                  getOptionLabel={opt => opt.estado}
                  getOptionValue={opt => opt.id.toString()}
                />
                <SelectField
                  name="idMunicipio"
                  control={form.control}
                  label={t("companyForm.fields.municipality")}
                  options={municipios}
                  placeholder={t("companyForm.fields.selectOption")}

                  getOptionLabel={opt => opt.municipio}
                  getOptionValue={opt => opt.id.toString()}
                />
                <SelectField
                  name="idParroquia"
                  control={form.control}
                  label={t("companyForm.fields.parish")}
                  options={parroquias}
                  placeholder={t("companyForm.fields.selectOption")}

                  getOptionLabel={opt => opt.parroquia}
                  getOptionValue={opt => opt.id}
                />
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit">{t("companyForm.saveButton")}</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
};

export default UpdateCompanyDialog;