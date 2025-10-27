import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { SelectField } from "./fields/SelectField";
import { CustomField } from "./fields/CustomField";
import eventFormConfig from "@src/config/eventFormConfig";
import { Form } from "@src/components/ui/form";
import { Textarea } from "@src/components/ui/textarea";
import { Button } from "@src/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createEventsSchema } from "@src/schema/CreateEventsSchema";
import { message } from "antd";

import PropTypes from 'prop-types';

const EventFormFields = ({ submit, initialValues }) => {
  const config = eventFormConfig();

  const form = useForm({
    resolver: zodResolver(createEventsSchema),
    defaultValues: Object.fromEntries(
      Object.entries(createEventsSchema.shape).map(([key]) => [key, ""])
    ),
  });

  // Cuando llegan initialValues (detalles de evento), reseteamos el formulario
  useEffect(() => {
    if (!initialValues) return;
    const values = Object.fromEntries(
      Object.entries(createEventsSchema.shape).map(([key]) => {
        let v = initialValues[key];
        if (v === null || v === undefined) v = "";
        // Normalizar números a strings (flags como mostrar_citas pueden venir como 0/1)
        if (typeof v === 'number') v = String(v);
        return [key, v];
      })
    );
    form.reset(values);
  }, [initialValues, form]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    message.loading({ content: "Se está cargando su evento...", key: "eventLoading" });
    try {
      await submit(data);
      message.success({ content: "Evento guardado exitosamente", key: "eventLoading" });
    } catch (error) {
      console.error("Error al guardar el evento:", error);
      message.error({ content: "Error al guardar el evento", key: "eventLoading" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="grid grid-cols-2 gap-6">
          {Object.entries(config).map(([key, fieldConfig]) => (
            <FormField
              key={key}
              name={fieldConfig.name}
              control={form.control}
              render={({ field }) => (
                <FormItem
                  className={
                    fieldConfig.fullWidth
                      ? "col-span-2"
                      : fieldConfig.type === "custom"
                      ? "col-span-2 flex flex-col items-center"
                      : "col-span-2 sm:col-span-1"
                  }
                >
                  <FormLabel className={fieldConfig.type === "custom" ? "mb-2 text-center" : ""}>
                    {fieldConfig.label}
                  </FormLabel>
                  <FormControl>
                    {fieldConfig.type === "select" ? (
                      <SelectField
                        field={{
                          ...field,
                          value: form.watch(fieldConfig.name) || fieldConfig.value || "",
                          onChange: (value) => {
                            field.onChange(value);
                            form.setValue(fieldConfig.name, value);
                          },
                        }}
                        options={fieldConfig.options}
                        placeholder={`Seleccione ${fieldConfig.label}`}
                        getPopupContainer={(triggerNode) => triggerNode.parentNode}
                      />
                    ) : fieldConfig.type === "custom" ? (
                      <CustomField fieldConfig={fieldConfig} field={field} />
                    ) : fieldConfig.type === "textarea" ? (
                      <Textarea {...field} placeholder={fieldConfig.label} rows={fieldConfig.rows || 4} />
                    ) : (
                      <Input {...field} type={fieldConfig.inputType || 'text'} placeholder={fieldConfig.label} />
                    )}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
        </div>

        <Button type="submit" className="w-full mt-5" disabled={isSubmitting}>
          Guardar
        </Button>
      </form>
    </Form>
  );
};

export default EventFormFields;

EventFormFields.propTypes = {
  submit: PropTypes.func,
  initialValues: PropTypes.object,
};
