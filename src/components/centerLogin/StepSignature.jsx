import { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import companySchema from '@src/schema/companySchema';
import { Input } from "../ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "../ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { fetchActividadesEmpresariales, postStepSignature, fetchPaises } from '@lib/api/apiUser'; // Importa la función fetchPaises
import { propiedad } from '@lib/data/propiedad';
import { estados } from '@lib/data/estados';
import { extraerMunicipios } from '@lib/data/municipios';
import { extraerParroquias } from '@lib/data/parroquias';
import { Loader2 } from "lucide-react"; // Importa el componente Loader2
import useAuthStore from '@src/store/authStore'; // Importa el hook de authStore
import { useStore } from 'zustand';
import appStore from '@store/appStore';
import { useNavigate } from 'react-router'; // Importa el hook useNavigate

const StepSignature = () => {
  const { idUser } = useAuthStore(); // Obtén el idUser desde authStore
  const setCompany = useStore(appStore, state => state.setCompany);
  const navigate = useNavigate(); // Inicializa el hook useNavigate
  const form = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nombreEmpresa: "",
      rif: "",
      idTipoActividadEmpresarial: "",
      idTipoPropiedad: "",
      idPais: "",
      idEstado: "",
      idMunicipio: "",
      idParroquia: "",
      direccion: "",
    },
  });

  const [municipios, setMunicipios] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showLocationFields, setShowLocationFields] = useState(false);
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

  useEffect(() => {
    if (form.watch('idEstado')) {
      setMunicipios(extraerMunicipios(form.watch('idEstado')));
      form.setValue('idMunicipio', '');
      form.setValue('idParroquia', '');
    }
  }, [form.watch('idEstado')]);

  useEffect(() => {
    if (form.watch('idMunicipio')) {
      setParroquias(extraerParroquias(form.watch('idMunicipio')));
      form.setValue('idParroquia', '');
    }
  }, [form.watch('idMunicipio')]);

  useEffect(() => {
    setShowLocationFields(form.watch('idPais') === '95');
  }, [form.watch('idPais')]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
        const response = await postStepSignature({
            nombre_empresa: data.nombreEmpresa,
            rif: data.rif,
            id_tipo_actividad_empresarial: data.idTipoActividadEmpresarial,
            id_tipo_propiedad: data.idTipoPropiedad,
            id_pais: data.idPais,
            id_estado: data.idEstado,
            id_municipio: data.idMunicipio,
            id_parroquia: data.idParroquia,
            direccion: data.direccion,
            id_user: idUser, // Usa el idUser obtenido de authStore
        });
        setCompany(response.empresas_id, data.nombreEmpresa);
        navigate('/company'); // Redirige a /company después de guardar la empresa
    } catch (error) {
        alert('Error al enviar los datos');
    } finally {
        setIsLoading(false);
    }
  };

  const getMaxLength = (name) => {
    const field =companySchema.sourceType()._def.shape()[name];
    if (field && field._def.checks) {
      const maxCheck = field._def.checks.find(check => check.kind === "max");
      return maxCheck ? maxCheck.value : 500;
    }
    return 500;
  };

  return (
    <div className="flex flex-col gap-6 mt-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Registro de Empresa</CardTitle>
          <CardDescription>Complete los campos requeridos</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="grid gap-6">
                <FormField
                  name="nombreEmpresa"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Empresa</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Nombre de la Empresa"
                            maxLength={getMaxLength("nombreEmpresa")}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                          <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                            {field.value.length}/{getMaxLength("nombreEmpresa")}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage>{form.formState.errors.nombreEmpresa?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="rif"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>RIF</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="RIF"
                            maxLength={getMaxLength("rif")}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                          <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                            {field.value.length}/{getMaxLength("rif")}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage>{form.formState.errors.rif?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="idTipoActividadEmpresarial"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
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
                                  <SelectItem key={actividad.id} value={actividad.id}>
                                    {actividad.tipo_actividad_empresarial}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </FormControl>
                      <FormMessage>{form.formState.errors.idTipoActividadEmpresarial?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="idTipoPropiedad"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
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
                      <FormMessage>{form.formState.errors.idTipoPropiedad?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  name="idPais"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>País</FormLabel>
                      <FormControl>
                        <Controller
                          name="idPais"
                          control={form.control}
                          render={({ field }) => (
                            <Select                               
                              value={field.value}
                              onValueChange={field.onChange}
                              >
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
                      <FormMessage>{form.formState.errors.idPais?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                {showLocationFields && (
                  <>
                    <FormField
                      name="idEstado"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
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
                                      <SelectItem key={estado.id} value={estado.id}>
                                        {estado.estado}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </FormControl>
                          <FormMessage>{form.formState.errors.idEstado?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="idMunicipio"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
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
                                      <SelectItem key={municipio.id} value={municipio.id}>
                                        {municipio.municipio}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            />
                          </FormControl>
                          <FormMessage>{form.formState.errors.idMunicipio?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                    <FormField
                      name="idParroquia"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
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
                          <FormMessage>{form.formState.errors.idParroquia?.message}</FormMessage>
                        </FormItem>
                      )}
                    />
                  </>
                )}
                <FormField
                  name="direccion"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            placeholder="Dirección"
                            maxLength={getMaxLength("direccion")}
                            onChange={(e) => {
                              field.onChange(e);
                            }}
                          />
                          <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                            {field.value.length}/{getMaxLength("direccion")}
                          </span>
                        </div>
                      </FormControl>
                      <FormMessage>{form.formState.errors.direccion?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? <Loader2 className="animate-spin" /> : 'Enviar'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StepSignature;