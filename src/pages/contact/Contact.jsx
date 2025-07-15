import { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { message } from 'antd';
import AtomsPanel from '@components/atoms/AtomsPanel';
import MoleculesTable from "@components/molecules/tables/MoleculesTable";
import appStore from '@store/appStore';
import { contactSchema } from '@src/schema/contactSchema';
import { useStore } from 'zustand';
import { getConfigTable } from "../contact/config/configTable";
import { postStepContact, fetchContactData } from '@src/lib/api/apiUser';
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // Importa el componente Loader2
import columns from './columns/columnsCompanyActivities'; // Importa las columnas

const RegisterActivities = () => {  
  const idCompany = useStore(appStore, state => state.idCompany);
  const [activitiesData, setActivitiesData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nombre: "",
      correo: "",
      telefono: "",
      cargo: "",
    },
  });

  const loadActivitiesData = async () => {
    try {
      const data = await fetchContactData(idCompany);
      setActivitiesData(data);
    } catch (error) {
      console.error('Error fetching activities data:', error);
    }
  };

  useEffect(() => {
    loadActivitiesData();
  }, [idCompany]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await postStepContact({ ...data, id_empresa: idCompany });
      if (response) {
        message.success('Contacto Exitoso');
        form.reset();
        loadActivitiesData();
      } else {
        message.error('Error al enviar el contacto');
      }
    } catch (error) {
      console.error('Error submitting contact:', error);
      message.error(error.response.data.error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getMaxLength = (name) => {
    const field = contactSchema.shape[name];
    return field?._def?.checks?.find(check => check.kind === "max")?.value || 500;
  };

  const configTable = getConfigTable(activitiesData, loadActivitiesData);

  return (
    <>
      <AtomsPanel title={'Contactos'} subtitle={'Información de los contactos'} />
      <div className="flex flex-col gap-6 mt-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Registro de Contacto</CardTitle>
            <CardDescription>Complete los campos requeridos</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <FormField
                    name="nombre"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Nombre"
                              maxLength={getMaxLength("nombre")}
                            />
                            <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                              {field.value.length}/{getMaxLength("nombre")}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage>{form.formState.errors.nombre?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="correo"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Correo"
                              maxLength={getMaxLength("correo")}
                            />
                            <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                              {field.value.length}/{getMaxLength("correo")}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage>{form.formState.errors.correo?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="telefono"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Teléfono"
                              maxLength={getMaxLength("telefono")}
                            />
                            <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                              {field.value.length}/{getMaxLength("telefono")}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage>{form.formState.errors.telefono?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="cargo"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Puesto</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder="Puesto"
                              maxLength={getMaxLength("cargo")}
                            />
                            <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                              {field.value.length}/{getMaxLength("cargo")}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage>{form.formState.errors.cargo?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Agregar contactos'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Lista de Contactos</CardTitle>
            <CardDescription>Información de los contactos registrados</CardDescription>
          </CardHeader>
          <CardContent>
            <MoleculesTable config={configTable} columns={columns(loadActivitiesData)} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default RegisterActivities;