import { z } from "zod";

export const createEventsSchema = z.object({
  nombre_evento: z
    .string()
    .min(3, "El nombre del evento debe tener al menos 3 caracteres")
    .max(100, "El nombre del evento no puede exceder los 100 caracteres"),
  lugar_evento: z
    .string()
    .min(3, "El lugar del evento debe tener al menos 3 caracteres")
    .max(150, "El lugar del evento no puede exceder los 150 caracteres"),
  fecha_inicio: z
    .string()
    .length(10, "La fecha de inicio debe tener formato YYYY-MM-DD (10 caracteres)"),
  fecha_final: z
    .string()
    .length(10, "La fecha final debe tener formato YYYY-MM-DD (10 caracteres)"),
  fecha_inicial_inscripcion: z
    .string()
    .length(10, "La fecha inicial de inscripción debe tener formato YYYY-MM-DD (10 caracteres)"),
  fecha_final_inscripcion: z
    .string()
    .length(10, "La fecha final de inscripción debe tener formato YYYY-MM-DD (10 caracteres)"),
  mostrar_rueda_negocios: z
    .string()
    .length(1, "Valor inválido para mostrar_rueda_negocios (esperado 1 caracter)"),
  mostrar_citas: z
    .string()
    .length(1, "Valor inválido para mostrar_citas (esperado 1 caracter)"),
  img_evento: z.instanceof(File, "La imagen es obligatoria"),
  descripcion_evento: z
    .string()
    .min(1, "La descripción del evento no puede estar vacía")
    .max(200, "La descripción no puede exceder los 200 caracteres"),
});