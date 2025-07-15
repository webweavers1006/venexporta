import { z } from "zod";

export const categorySchema = z.object({
  nombre: z
    .string()
    .nonempty("El nombre es requerido")
    .min(3, "El nombre debe tener al menos 3 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  codigo_arancelario: z
    .string()
    .nonempty("El código arancelario es requerido")
    .min(10, "El código arancelario debe tener al menos 10 caracteres")
    .max(10, "El código arancelario no puede exceder los 10 caracteres"),
  id_actividad_economica: z
    .string()
    .nonempty("La actividad económica es requerida"),
  id_sector_productivo: z
    .string()
    .nonempty("El sector productivo es requerido"),
  id_sub_sector_productivo: z
    .string()
    .nonempty("El sub-sector productivo es requerido"),
});
