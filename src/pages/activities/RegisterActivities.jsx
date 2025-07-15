import { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { message } from 'antd';
import AtomsPanel from '@components/atoms/AtomsPanel';
import MoleculesTable from "@components/molecules/tables/MoleculesTable";
import appStore from '@store/appStore';
import { useStore } from 'zustand';
import { postStepActivity } from '@src/lib/api/apiUser';
import { getConfigTable } from "../company/config/configTable";
import { fetchActivitiesData, fetchAllActivities, fetchSectors, fetchSubSectors } from '@src/lib/api/apiUser';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // Importa el componente Loader2

const activitySchema = z.object({
  idActividadEconomica: z.string().nonempty("La actividad económica es requerida"),
  idSectorProductivo: z.string().nonempty("El sector productivo es requerido"),
  idSubSectorProductivo: z.string().nonempty("El sub-sector productivo es requerido"),
});

const RegisterActivities = () => {  
  const idCompany = useStore(appStore, state => state.idCompany);
  const [activitiesData, setActivitiesData] = useState([]);
  const [activities, setActivities] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [subSectors, setSubSectors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      idActividadEconomica: "",
      idSectorProductivo: "",
      idSubSectorProductivo: "",
    },
  });

  const loadActivitiesData = async () => {
    try {
      const data = await fetchActivitiesData(idCompany);
      setActivitiesData(data);
    } catch (error) {
      console.error('Error fetching activities data:', error);
    }
  };

  useEffect(() => {
    loadActivitiesData();
  }, [idCompany]);

  useEffect(() => {
    const loadAllActivities = async () => {
      try {
        const data = await fetchAllActivities();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    loadAllActivities();
  }, []);

  useEffect(() => {
    if (form.watch('idActividadEconomica')) {
      const loadSectors = async () => {
        try {
          const data = await fetchSectors(form.watch('idActividadEconomica'));
          setSubSectors([]);
          setSectors(data);
        } catch (error) {
          console.error('Error fetching sectors:', error);
        }
      };

      loadSectors();
    }
  }, [form.watch('idActividadEconomica')]);

  useEffect(() => {
    if (form.watch('idSectorProductivo')) {
      const loadSubSectors = async () => {
        try {
          const data = await fetchSubSectors(form.watch('idSectorProductivo'));
          setSubSectors(data);
        } catch (error) {
          console.error('Error fetching subsectors:', error);
        }
      };

      loadSubSectors();
    }
  }, [form.watch('idSectorProductivo')]);

  const resetFormAndSelects = () => {
    form.reset();
    setSectors([]);
    setSubSectors([]);
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    const datas = [{
      id_actividad_economica: data.idActividadEconomica,
      id_sector_productivo: data.idSectorProductivo,
      id_sub_sector_productivo: data.idSubSectorProductivo,
      id_empresa: idCompany,
  }];
    try {
      const response = await postStepActivity(datas);
  
      if (response) {
        message.success('Actividad agregada correctamente');
        resetFormAndSelects();
        loadActivitiesData();
      } else {
        message.error('Error al agregar actividad económica');
        console.error('Error adding activity');
      }
    } catch (error) {
      message.error(error.response.data.error.message);
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMaxLength = (name) => {
    const field = activitySchema.shape[name];
    return field?._def?.checks?.find(check => check.kind === "max")?.value || 500;
  };

  const configTable = getConfigTable(activitiesData, loadActivitiesData);

  return (
    <>
      <AtomsPanel title={'Actividades Economicas'} subtitle={'Información de las actividades economicas'} />
      <div className="flex flex-col gap-6 mt-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Registro de Actividad Económica</CardTitle>
            <CardDescription>Complete los campos requeridos</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid gap-6">
                  <FormField
                    name="idActividadEconomica"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Actividad Económica</FormLabel>
                        <FormControl>
                          <Controller
                            name="idActividadEconomica"
                            control={form.control}
                            render={({ field }) => (
                              <Select
                              value={field.value}
                              onValueChange={field.onChange}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione una opción" />
                                </SelectTrigger>
                                <SelectContent>
                                  {activities.map((activity) => (
                                    <SelectItem key={activity.id} value={activity.id.toString()}>
                                      {activity.actividad_economica}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FormControl>
                        <FormMessage>{form.formState.errors.idActividadEconomica?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="idSectorProductivo"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sector Productivo</FormLabel>
                        <FormControl>
                          <Controller
                            name="idSectorProductivo"
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
                                  {sectors.map((sector) => (
                                    <SelectItem key={sector.id} value={sector.id.toString()}>
                                      {sector.sector_productivo}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FormControl>
                        <FormMessage>{form.formState.errors.idSectorProductivo?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="idSubSectorProductivo"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sub-Sector Productivo</FormLabel>
                        <FormControl>
                          <Controller
                            name="idSubSectorProductivo"
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
                                  {subSectors.map((subSector) => (
                                    <SelectItem key={subSector.id} value={subSector.id.toString()}>
                                      {subSector.sub_sector_productivo}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            )}
                          />
                        </FormControl>
                        <FormMessage>{form.formState.errors.idSubSectorProductivo?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin" /> : 'Agregar actividad económica'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">Lista de Actividades Económicas</CardTitle>
            <CardDescription>Información de las actividades económicas registradas</CardDescription>
          </CardHeader>
          <CardContent>
            <MoleculesTable config={configTable} />
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export default RegisterActivities;