import { z } from "zod";

const rifRegex = /^[JG][0-9]+$/;

const companySchema = z.object({
  nombreEmpresa: z.string().nonempty("El nombre de la empresa es requerido").min(5, "El nombre de la empresa debe tener al menos 5 caracteres").max(100, "El nombre de la empresa no puede exceder los 100 caracteres"),
  rif: z.string()
    .nonempty("El RIF es requerido")
    .regex(rifRegex, "El RIF debe comenzar con J o G seguido de números")
    .min(8, "El RIF debe tener al menos 8 caracteres")
    .max(12, "El RIF no puede exceder los 12 caracteres"),
  idTipoActividadEmpresarial: z.string().nonempty("El tipo de actividad empresarial es requerido"),
  idTipoPropiedad: z.string().nonempty("El tipo de propiedad es requerido"),
  idPais: z.string().optional(),
  idEstado: z.string().optional(),
  idMunicipio: z.string().optional(),
  idParroquia: z.string().optional(),
  direccion: z.string().nonempty("La dirección es requerida").max(200, "La dirección no puede exceder los 200 caracteres"),
}).superRefine((data, ctx) => {
  if (data.idPais === '95') {
    if (!data.idEstado) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El estado es requerido si el país es Venezuela",
        path: ["idEstado"],
      });
    }
    if (!data.idMunicipio) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El municipio es requerido si el país es Venezuela",
        path: ["idMunicipio"],
      });
    }
    if (!data.idParroquia) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La parroquia es requerida si el país es Venezuela",
        path: ["idParroquia"],
      });
    }
  }
});

export default companySchema;