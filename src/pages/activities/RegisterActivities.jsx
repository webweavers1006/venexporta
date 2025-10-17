import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { message } from 'antd';
import PropTypes from 'prop-types';
import AtomsPanel from '@components/atoms/AtomsPanel';
import MoleculesTable from '@components/molecules/tables/MoleculesTable';
import { getConfigTable } from '../company/config/configTable';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { postStepActivity } from '@src/lib/api/apiIndex';
import { useRegisterActivities } from './hooks/useRegisterActivities';
import { getMaxLength } from './helpers/getMaxLength';

//✅Components traduction
import { useTranslation } from "react-i18next";

/**
 * Componente para registrar actividades económicas de una empresa.
 *
 * @component
 * @example
 * <RegisterActivities />
 *
 * @returns {JSX.Element} Formulario y tabla de actividades económicas.
 */
const activitySchema = z.object({
  idActividadEconomica: z.string().nonempty(('La actividad económica es requerida'),),
  idSectorProductivo: z.string().nonempty('El sector productivo es requerido'),
  idSubSectorProductivo: z.string().nonempty('El sub-sector productivo es requerido'),
});


function RegisterActivities() {
  // Traducción
    const { t } = useTranslation();
  const {
    idCompany,
    activitiesData,
    activities,
    sectors,
    subSectors,
    isLoading,
    setIsLoading,
    loadActivitiesData,
    handleActivityChange,
    handleSectorChange,
    resetSelects,
    configTable,
  } = useRegisterActivities(getConfigTable);

  const form = useForm({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      idActividadEconomica: '',
      idSectorProductivo: '',
      idSubSectorProductivo: '',
    },
  });

  // Manejo de cambios en selects
  const handleChangeActividad = (value) => {
    form.setValue('idActividadEconomica', value);
    handleActivityChange(value);
    form.setValue('idSectorProductivo', '');
    form.setValue('idSubSectorProductivo', '');
    resetSelects();
  };

  const handleChangeSector = (value) => {
    form.setValue('idSectorProductivo', value);
    handleSectorChange(value);
    form.setValue('idSubSectorProductivo', '');
  };

  const handleChangeSubSector = (value) => {
    form.setValue('idSubSectorProductivo', value);
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
        message.success(t("activitiesPanel.messages.success"));
        form.reset();
        resetSelects();
        loadActivitiesData();
      } else {
        message.error(t("activitiesPanel.messages.error"));
      }
    } catch (error) {
      message.error(error?.response?.data?.error?.message || t("activitiesPanel.messages.unknownError"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-label="Registro de actividades económicas">
      <AtomsPanel title={t("activitiesPanel.heading")} subtitle={t("activitiesPanel.subheading")} />
      <div className="flex flex-col gap-6 mt-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("activitiesPanel.form.title")}</CardTitle>
            <CardDescription>{t("activitiesPanel.form.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} aria-label="Formulario de registro de actividad económica">
                <div className="grid gap-6">
                  <FormField
                    name="idActividadEconomica"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="actividad-economica-select">{t("activitiesPanel.fields.activity")}</FormLabel>
                        <FormControl>
                          <Controller
                            name="idActividadEconomica"
                            control={form.control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={handleChangeActividad}
                                aria-label="Seleccionar actividad económica"
                                id="actividad-economica-select"
                              >
                                <SelectTrigger tabIndex={0} aria-label="Actividades económicas">
                                  <SelectValue placeholder={t("activitiesPanel.common.selectOption")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {activities.map((activity) => (
                                    <SelectItem key={activity.id} value={activity.id.toString()} aria-label={activity.actividad_economica}>
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
                        <FormLabel htmlFor="sector-productivo-select">{t("activitiesPanel.fields.sector")}</FormLabel>
                        <FormControl>
                          <Controller
                            name="idSectorProductivo"
                            control={form.control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={handleChangeSector}
                                aria-label="Seleccionar sector productivo"
                                id="sector-productivo-select"
                              >
                                <SelectTrigger tabIndex={0} aria-label="Sectores productivos">
                                  <SelectValue placeholder={t("activitiesPanel.common.selectOption")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {sectors.map((sector) => (
                                    <SelectItem key={sector.id} value={sector.id.toString()} aria-label={sector.sector_productivo}>
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
                        <FormLabel htmlFor="sub-sector-productivo-select">{t("activitiesPanel.fields.subSector")}</FormLabel>
                        <FormControl>
                          <Controller
                            name="idSubSectorProductivo"
                            control={form.control}
                            render={({ field }) => (
                              <Select
                                value={field.value}
                                onValueChange={handleChangeSubSector}
                                aria-label="Seleccionar sub-sector productivo"
                                id="sub-sector-productivo-select"
                              >
                                <SelectTrigger tabIndex={0} aria-label="Sub-sectores productivos">
                                  <SelectValue placeholder={t("activitiesPanel.common.selectOption")} />
                                </SelectTrigger>
                                <SelectContent>
                                  {subSectors.map((subSector) => (
                                    <SelectItem key={subSector.id} value={subSector.id.toString()} aria-label={subSector.sub_sector_productivo}>
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
                  <Button type="submit" className="w-full" disabled={isLoading} aria-busy={isLoading} aria-label="Agregar actividad económica">
                    {isLoading ? <Loader2 className="animate-spin" aria-label="Cargando" /> : t("activitiesPanel.form.submit")}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("activitiesPanel.list.title")}</CardTitle>
            <CardDescription>{t("activitiesPanel.list.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <MoleculesTable config={configTable} />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

RegisterActivities.propTypes = {};

export default RegisterActivities;