import { z } from "zod";

const identificationRegex = /^[VEP][0-9]{8,}$/;
const rifRegex = /^[JG][0-9]+$/;
const rifPais95Regex = /^[A-Z0-9]{7,}$/; // Ejemplo de otro regex para rif con idPais 95

export const registerSchema = z.object({
  name: z.string().nonempty("El nombre es requerido").max(100, "El nombre no puede tener más de 100 caracteres"),
  email: z.string().nonempty("El correo es requerido").email("Correo inválido").max(100, "El correo no puede tener más de 100 caracteres"),
  telefono: z.string().nonempty("Telefono requerido").min(8, "El telefono debe tener al menos 8 caracteres").max(16, "El telefono no puede exceder los 15 caracteres"),
  nombreEmpresa: z.string().nonempty("El nombre de la empresa es requerido").min(5, "El nombre de la empresa debe tener al menos 5 caracteres").max(100, "El nombre de la empresa no puede exceder los 100 caracteres"),
  rif: z.string()
    .nonempty("El Numero de Identificación Fiscal es requerido"),
  identification: z.string()
    .nonempty("La identificación es requerida"),
  idPais: z.string("requerido").nonempty("El tipo de propiedad es requerido"),
  codigoArea: z.string("requerido").nonempty("El tipo de propiedad es requerido"),
  pass: z.string()
    .nonempty("La contraseña es requerida")
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .regex(/[A-Z]/, "La contraseña debe tener al menos una letra mayúscula")
    .regex(/[!@#$%^&*(),.?":{}|<>]/, "La contraseña debe tener al menos un carácter especial"),
}).superRefine((data, ctx) => {
  const idPaisValue = data.idPais; // Accede al valor de idPais
  const codigoAreaValue = data.codigoArea; // Accede al valor de codigoArea

  if (idPaisValue === "95") {
    if (!rifRegex.test(data.rif)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El Numero de Identificación Fiscal debe comenzar con J o G seguido de números.",
        path: ["rif"],
      });
    }
    if (data.rif.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El Numero de Identificación Fiscal debe tener al menos 8 caracteres.",
        path: ["rif"],
      });
    }
    if (data.rif.length > 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El Numero de Identificación Fiscal no puede exceder los 12 caracteres.",
        path: ["rif"],
      });
    }
    if (!identificationRegex.test(data.identification)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La identificación debe comenzar con V, E o P seguido de al menos 8 números.",
        path: ["identification"],
      });
    }
    if (data.identification.length < 8) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La identificación debe tener al menos 8 caracteres.",
        path: ["identification"],
      });
    }
    if (data.identification.length > 15) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La identificación no puede tener más de 15 caracteres.",
        path: ["identification"],
      });
    }
  } else {
    if (data.rif.length < 5 || data.rif.length > 15) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El Numero de Identificación Fiscal debe tener entre 5 y 15 caracteres.",
        path: ["rif"],
      });
    }
    if (data.identification.length < 5 || data.identification.length > 15) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La identificación debe tener entre 5 y 15 caracteres.",
        path: ["identification"],
      });
    }
  }

  if (codigoAreaValue === "95") {
    if (data.telefono.length < 10 || data.telefono.length > 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El teléfono debe 11 caracteres.",
        path: ["telefono"],
      });
    }
  }
});