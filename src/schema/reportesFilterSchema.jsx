import { z } from 'zod';
// Expresión para RIF: debe comenzar con J o G seguido de números
const rifRegex = /^[JG][0-9]+$/;

// Esquema de validación para filtros de reportes dinámicos
export const reportesFilterSchema = z.object({
  rif: z.string().optional()
    .refine(
      (v) => v === undefined || v === '' || rifRegex.test(v),
      { message: 'El RIF debe comenzar con J o G seguido de números' }
    )
    .refine(
      (v) => v === undefined || v === '' || (v.length >= 8 && v.length <= 12),
      { message: 'El RIF debe tener entre 8 y 12 caracteres' }
    ),
  nombre_empresa: z.string().optional().refine(
    (v) => v === undefined || v === '' || /^[A-Za-z0-9 ]+$/.test(v),
    { message: 'Solo letras, números y espacios' }
  ),
  id_tipo_actividad_empresarial: z.string().optional(),
  id_tipo_propiedad: z.string().optional(),
  id_pais: z.string().optional(),
  id_estado: z.string().optional(),
  id_municipio: z.string().optional(),
  id_parroquia: z.string().optional(),
  id_evento: z.string().optional(),
  id_tipo_participacion: z.string().optional(),
  id_actividad_economica: z.string().optional(),
  id_sector_productivo: z.string().optional(),
  id_sub_sector_productivo: z.string().optional(),
  codigo_arancelario: z.string().optional().refine(
    (v) => v === undefined || v === '' || /^[0-9.]+$/.test(v),
    { message: 'Solo números y puntos' }
  ),
  // Rango de fechas de creación
  created_user_from: z.string().optional(),
  created_user_to: z.string().optional(),
  id_role: z.string().optional(),
});
