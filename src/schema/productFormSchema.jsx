import { z } from "zod";

export const productFormSchema = z.object({
  img: z.instanceof(File, "La imagen es obligatoria"), // Cambiado a obligatorio y validado como archivo
  categoria_producto: z.number().min(1, "Seleccione una opción válida"), // Cambiado a número
  nombre_producto: z.string().min(1, "El nombre del producto es obligatorio").max(100, "El nombre del producto no puede exceder los 100 caracteres"),
  id_tipo_unidad_presentacion_producto: z.string().min(1, "Seleccione una opción"),
  unidad_producto: z.string().min(1, "La unidad del producto es obligatoria").max(11, "La unidad del producto no puede exceder los 11 digitos"),
  id_rango_tiempo_export: z.string().min(1, "Seleccione una opción"),
  id_capacidad_exportacion_producto: z.string().min(1, "Seleccione una opción"),
  capacidad_exportacion: z.string().min(1, "La capacidad de exportación es obligatoria").max(11, "La capacidad de exportación no puede exceder los 11 digitos"),
  id_estado: z.string().min(1, "Seleccione un estado"),
  id_municipio: z.string().min(1, "Seleccione un municipio"),
  id_parroquia: z.string().min(1, "Seleccione una parroquia"),
  direccion: z.string().min(1, "La dirección es obligatoria").max(500, "La dirección no puede exceder los 500 caracteres"),
  id_unidad_cap_produccion: z.string().min(1, "Seleccione una opción"),
  cap_produccion: z.string().min(1, "La capacidad de producción es obligatoria").max(11, "La capacidad de producción no puede exceder los 11 digitos"),
});
