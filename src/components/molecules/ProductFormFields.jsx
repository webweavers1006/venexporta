import { useState, useEffect } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@src/components/ui/form";
import { Input } from "@src/components/ui/input";
import { SelectField } from "./fields/SelectField";
import { CustomField } from "./fields/CustomField";
import productFormConfig from "@src/config/productFormConfig";
import { estados } from "@lib/data/estados";
import { Form } from "@src/components/ui/form";
import { extraerMunicipios } from "@lib/data/municipios";
import { extraerParroquias } from "@lib/data/parroquias";
import { fetchProductCategories, postCategory, fetchUnidadesMedida, fetchRangoTiempo } from "@src/lib/api/apiIndex";
import CategoryForm from "@src/components/molecules/CategoryForm";
import { Button } from "@src/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { productFormSchema } from "@src/schema/productFormSchema";
import { message, Modal } from "antd"; // Importar Modal de Ant Design
import { Plus } from "lucide-react"; // Importar ícono para el botón


const ProductFormFields = ({ submit }) => {
  const [municipios, setMunicipios] = useState([]);
  const [parroquias, setParroquias] = useState([]);
  const [categories, setCategories] = useState([]);
  const [unidadesMedida, setUnidadesMedida] = useState([]);
  const [rangoTiempos, setRangoTiempos] = useState([]); // Add state for rangoTiempos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Estado para controlar el botón

  const form = useForm({
    resolver: zodResolver(productFormSchema),
    defaultValues: Object.fromEntries(
      Object.entries(productFormSchema.shape).map(([key]) => [key, ""])
    ),
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const fetchedCategories = await fetchProductCategories();
        setCategories(fetchedCategories);

        const fetchedUnidadesMedida = await fetchUnidadesMedida();
        setUnidadesMedida(fetchedUnidadesMedida);

        const fetchedRangoTiempos = await fetchRangoTiempo(); // Fetch rangoTiempos
        setRangoTiempos(fetchedRangoTiempos);
      } catch (error) {
        console.error("Error loading initial data:", error);
      }
    };
    loadInitialData();
  }, []);

  const config = productFormConfig(categories, unidadesMedida, rangoTiempos); // Pass rangoTiempos to config

  const handleCategorySelect = (category) => {
    form.setValue("categoria_producto", category.id); // Establecer el ID de la categoría en el formulario
    form.setValue("categoria_producto_label", category.nombre); // Establecer el nombre de la categoría en un campo auxiliar
    setIsModalOpen(false); // Cerrar la Modal
  };

  // Manejo de cambios en el estado seleccionado
  useEffect(() => {
    const estadoSeleccionado = form.watch("id_estado");
    if (estadoSeleccionado) {
      setMunicipios(extraerMunicipios(estadoSeleccionado));
      form.setValue("id_municipio", "");
      form.setValue("id_parroquia", "");
      setParroquias([]);
    }
  }, [form.watch("id_estado")]);

  // Manejo de cambios en el municipio seleccionado
  useEffect(() => {
    const municipioSeleccionado = form.watch("id_municipio");
    if (municipioSeleccionado) {
      setParroquias(extraerParroquias(municipioSeleccionado));
      form.setValue("id_parroquia", "");
    }
  }, [form.watch("id_municipio")]);

  const handleCategoryChange = (value) => {
    if (value === "add_category") {
      setIsModalOpen(true);
    }
  };

  const handleCategorySubmit = async (data) => {
    try {
      await postCategory(data);
      setIsModalOpen(false);
      const updatedCategories = await fetchProductCategories();
      setCategories(updatedCategories);
      message.success("Categoría creada satisfactoriamente"); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al registrar la categoría:", error);
      message.error("Error al registrar la categoría"); // Mostrar mensaje de error
    }
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true); // Deshabilitar el botón
    message.loading({ content: "Se está cargando su producto...", key: "productLoading" }); // Mostrar mensaje de carga
    try {
      await submit(data); // Llamar a la función de envío
      message.success({ content: "Producto guardado exitosamente", key: "productLoading" }); // Mostrar mensaje de éxito
    } catch (error) {
      console.error("Error al guardar el producto:", error);
      message.error({ content: "Error al guardar el producto", key: "productLoading" }); // Mostrar mensaje de error
    } finally {
      setIsSubmitting(false); // Habilitar el botón nuevamente
    }
  };

  return (
    <>
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)} // Cerrar la Modal
        footer={null} // Sin botones en el pie de la Modal
      >
        <CategoryForm onCategorySelect={handleCategorySelect} />
      </Modal>
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
                    <FormLabel
                      className={fieldConfig.type === "custom" ? "mb-2 text-center" : ""}
                    >
                      {fieldConfig.label}
                    </FormLabel>
                    <FormControl>
                      {fieldConfig.name === "categoria_producto" ? (
                        <div className="flex items-center gap-2">
                          <Input
                            {...field}
                            readOnly
                            placeholder="Seleccione una categoría"
                            value={form.watch("categoria_producto_label") || ""} // Mostrar el nombre de la categoría
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className="p-2"
                            onClick={() => setIsModalOpen(true)} // Abrir la Modal al hacer clic
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : fieldConfig.name === "id_estado" ? (
                        <SelectField
                          field={field}
                          options={estados.map((estado) => ({
                            value: estado.id,
                            label: estado.estado,
                          }))}
                          placeholder="Seleccione un Estado"
                        />
                      ) : fieldConfig.name === "id_municipio" ? (
                        <SelectField
                          field={field}
                          options={municipios.map((municipio) => ({
                            value: municipio.id,
                            label: municipio.municipio,
                          }))}
                          placeholder="Seleccione un Municipio"
                        />
                      ) : fieldConfig.name === "id_parroquia" ? (
                        <SelectField
                          field={field}
                          options={parroquias.map((parroquia) => ({
                            value: parroquia.id,
                            label: parroquia.parroquia,
                          }))}
                          placeholder="Seleccione una Parroquia"
                        />
                      ) : fieldConfig.type === "select" ? (
                        <SelectField
                          field={{
                            ...field,
                            value: form.watch(fieldConfig.name) || fieldConfig.value || "",
                            onChange: (value) => {
                              field.onChange(value);
                              form.setValue(fieldConfig.name, value);
                              if (fieldConfig.name === "categoria_producto") {
                                handleCategoryChange(value);
                              }
                            },
                          }}
                          options={fieldConfig.options}
                          placeholder={`Seleccione ${fieldConfig.label}`}
                          getPopupContainer={(triggerNode) => triggerNode.parentNode} // Renderiza el dropdown dentro del contenedor padre
                        />
                      ) : fieldConfig.type === "custom" ? (
                        <CustomField fieldConfig={fieldConfig} field={field} />
                      ) : (
                        <Input {...field} placeholder={fieldConfig.label} />
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <Button
            type="submit"
            className="w-full mt-5"
            disabled={isSubmitting} // Deshabilitar el botón si isSubmitting es true
          >
            Enviar
          </Button>
        </form>
      </Form>
    </>
  );
};

export default ProductFormFields;
