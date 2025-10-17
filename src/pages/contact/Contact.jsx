import { useForm } from "react-hook-form";
// Removed local fetchPaises and state, moved to hook
import { zodResolver } from "@hookform/resolvers/zod";
// message from antd moved to hook
import AtomsPanel from '@components/atoms/AtomsPanel';
import MoleculesTable from "@components/molecules/tables/MoleculesTable";
import appStore from '@store/appStore';
import { contactSchema } from '@src/schema/contactSchema';
import { useStore } from 'zustand';
import { getConfigTable } from "../contact/config/configTable";
// API calls moved to hook
import useContacts from './hooks/useContacts';

import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react"; // Importa el componente Loader2
import columns from './columns/columnsCompanyActivities'; // Importa las columnas

//✅Components traduction
import { useTranslation } from "react-i18next";

const RegisterActivities = () => {  
  // Traducción
  const { t } = useTranslation();
  const idCompany = useStore(appStore, state => state.idCompany);
  const { activitiesData, isLoading, loadActivitiesData, addContact, paises } = useContacts(idCompany);

  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nombre: "",
      correo: "",
      idPais: "",
      codigoArea: "",
      telefono: "",
      cargo: "",
    },
  });

  // loadActivitiesData is invoked within the hook when idCompany changes

  const onSubmit = async (data) => {
    const success = await addContact(data);
    if (success) form.reset();
  };

  const getMaxLength = (name) => {
    const field = contactSchema._def.schema._def.shape()[name];
    return field?._def?.checks?.find(check => check.kind === "max")?.value || 100;

  };

  const configTable = getConfigTable(activitiesData, loadActivitiesData);

  return (
    <>
      <AtomsPanel title={t("contactsPanel.heading")} subtitle={t("contactsPanel.subheading")}
 />
      <div className="flex flex-col gap-6 mt-4">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("contactsPanel.form.title")}</CardTitle>
            <CardDescription>{t("contactsPanel.form.description")}</CardDescription>
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
                        <FormLabel>{t("contactsPanel.fields.name")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder={t("contactsPanel.fields.name")}
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
                        <FormLabel>{t("contactsPanel.fields.email")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder={t("contactsPanel.fields.email")}
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
                  {/* Código de Área con país */}
                  <FormField
                    name="codigoArea"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contactsPanel.fields.areaCode")}</FormLabel>
                        <FormControl>
                          <Select
                            {...field}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const selected = paises.find((p) => p.codigo.toString() === value);
                              if (selected) form.setValue('idPais', selected.id.toString());
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("contactsPanel.fields.areaCodePlaceholder")} />
                            </SelectTrigger>
                            <SelectContent>
                              {paises.map(p => (
                                <SelectItem key={p.id} value={p.codigo.toString()}>
                                  <div className="flex justify-between">
                                    <span>{`+${p.codigo}`}</span>
                                    <span className="text-gray-500">{p.pais}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage>{form.formState.errors.codigoArea?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="telefono"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("contactsPanel.fields.phone")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder={t("contactsPanel.fields.phone")}
                              maxLength={getMaxLength("telefono")}
                            />
                            <span className="absolute right-2 bottom-2 text-sm text-gray-500">
                              {/* {field.value.length}/{getMaxLength("telefono")} */}
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
                        <FormLabel>{t("contactsPanel.fields.position")}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              {...field}
                              placeholder={t("contactsPanel.fields.position")}
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
                    {isLoading ? <Loader2 className="animate-spin" /> : t("contactsPanel.form.submit")}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-xl">{t("contactsPanel.list.title")}</CardTitle>
            <CardDescription>{t("contactsPanel.list.description")}</CardDescription>
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