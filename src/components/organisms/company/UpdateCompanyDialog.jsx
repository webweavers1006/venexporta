import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import companySchema from '@src/schema/companySchemaUpdate';
import ImageUpload from '@components/molecules/upload/ImageUpload';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@src/components/ui/select";
import { updateCompanyData } from "@lib/api/apiUser";
import { estados } from "@lib/data/estados";
import { extraerMunicipios } from "@lib/data/municipios";
import { extraerParroquias } from "@lib/data/parroquias";
import { propiedad } from "@lib/data/propiedad";
import { fetchActividadesEmpresariales } from "@lib/api/apiUser";
import { useState, useEffect } from 'react';
import { fetchPaises } from '@lib/api/apiUser'; // Importa la función fetchPaises

const UpdateCompanyDialog = ({ companyData, onClose, onUpdate }) => {
  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nombreEmpresa: companyData?.empresa || "",
      rif: companyData?.rif || "",
      direccion: companyData?.direccion || "",
      idTipoActividadEmpresarial: companyData?.id_tipo_actividad_empresarial.toString() || "",
      idTipoPropiedad: companyData?.id_tipo_propiedad.toString() || "",
      idPais: companyData?.id_pais.toString() || "",
      idEstado: companyData?.id_estado.toString()  || "",
      idMunicipio: companyData?.id_municipio.toString() || "",
      idParroquia: companyData?.id_parroquia.toString()  || "",
    },
  });

  const [municipios, setMunicipios] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [paises, setPaises] = useState([]); // Estado para almacenar los países
  const [actividadesEmpresariales, setActividadesEmpresariales] = useState([]);

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

  useEffect(() => {
    if (form.watch('idEstado')) {
      setMunicipios(extraerMunicipios(form.watch('idEstado')));
      form.setValue('idMunicipio', companyData?.id_municipio.toString() || '');
      form.setValue('idParroquia', '');
    }
  }, [form.watch('idEstado')]);

  useEffect(() => {
    if (form.watch('idMunicipio')) {
      setParroquias(extraerParroquias(form.watch('idMunicipio')));
      form.setValue('idParroquia', companyData?.id_parroquia.toString() || '');
    }
  }, [form.watch('idMunicipio')]);

  useEffect(() => {
    const obtenerActividadesEmpresariales = async () => {
      try {
        const data = await fetchActividadesEmpresariales();
        setActividadesEmpresariales(data);
      } catch (error) {
        console.error('Error fetching actividades empresariales:', error);
      }
    };

    obtenerActividadesEmpresariales();
  }, []);

  const idPaisValue = form.watch('idPais');

  const onSubmit = async (data) => {
    const formattedData = {
      nombre_empresa: data.nombreEmpresa,
      direccion: data.direccion,
      id_tipo_actividad_empresarial: data.idTipoActividadEmpresarial,
      id_tipo_propiedad: data.idTipoPropiedad,
      id_pais: data.idPais,
      // Solo incluir estos campos si idPais es "95"
      ...(data.idPais === "95" && {
        id_estado: data.idEstado,
        id_municipio: data.idMunicipio,
        id_parroquia: data.idParroquia,
      }),
    };

    try {
      await updateCompanyData(formattedData, companyData.id);
      alert("Empresa actualizada correctamente.");
      onUpdate();
      onClose();
    } catch (error) {
      alert("Error al actualizar la empresa.");
    }
  };

  return (
      <DialogContent className="max-w-3xl w-full">
        <DialogHeader>
          <DialogTitle>Actualizar Empresa</DialogTitle>
          <DialogDescription>
            Actualice la información de la empresa aquí. Haga clic en guardar cuando haya terminado.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="bg-primary col-span-2 sm:col-span-2 p-4 rounded-lg flex flex-col items-center justify-center">
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
                name="direccion"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 sm:col-span-1">
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Dirección" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="idTipoActividadEmpresarial"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 sm:col-span-1">
                    <FormLabel>Tipo de Actividad Empresarial</FormLabel>
                    <FormControl>
                      <Controller
                        name="idTipoActividadEmpresarial"
                        control={form.control}
                        render={({ field }) => (
                          <Select {...field} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una opción" />
                            </SelectTrigger>
                            <SelectContent>
                              {actividadesEmpresariales.map((actividad) => (
                                <SelectItem key={actividad.id} value={actividad.id.toString()}>
                                  {actividad.tipo_actividad_empresarial}
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
                name="idTipoPropiedad"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2 sm:col-span-1">
                    <FormLabel>Tipo de Propiedad</FormLabel>
                    <FormControl>
                      <Controller
                        name="idTipoPropiedad"
                        control={form.control}
                        render={({ field }) => (
                          <Select {...field} onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccione una opción" />
                            </SelectTrigger>
                            <SelectContent>
                              {propiedad.map((prop) => (
                                <SelectItem key={prop.id} value={prop.id}>
                                  {prop.tipo_propiedad}
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
              {/* Mostrar Estado, Municipio y Parroquia solo si idPais es "95" */}
              {idPaisValue === "95" && (
                <>
                  <FormField
                    name="idEstado"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1">
                        <FormLabel>Estado</FormLabel>
                        <FormControl>
                          <Controller
                            name="idEstado"
                            control={form.control}
                            render={({ field }) => (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>
                                <SelectContent>
                                  {estados.map((estado) => (
                                    <SelectItem key={estado.id} value={estado.id.toString()}>
                                      {estado.estado}
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
                    name="idMunicipio"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1">
                        <FormLabel>Municipio</FormLabel>
                        <FormControl>
                          <Controller
                            name="idMunicipio"
                            control={form.control}
                            render={({ field }) => (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>
                                <SelectContent>
                                  {municipios.map((municipio) => (
                                    <SelectItem key={municipio.id} value={municipio.id.toString()}>
                                      {municipio.municipio}
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
                    name="idParroquia"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-2 sm:col-span-1">
                        <FormLabel>Parroquia</FormLabel>
                        <FormControl>
                          <Controller
                            name="idParroquia"
                            control={form.control}
                            render={({ field }) => (
                              <Select {...field} onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>
                                <SelectContent>
                                  {parroquias.map((parroquia) => (
                                    <SelectItem key={parroquia.id} value={parroquia.id}>
                                      {parroquia.parroquia}
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
                </>
              )}
            </div>
            <DialogFooter>
              <Button type="submit">Guardar cambios</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
  );
};

export default UpdateCompanyDialog;