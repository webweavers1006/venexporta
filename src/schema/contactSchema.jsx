import { z } from "zod";
export const contactSchema = z.object({
  nombre: z.string().nonempty("Nombre requerido").min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre de la empresa no puede exceder los 100 caracteres"),
  correo: z.string().nonempty("Correo requerido").email("Correo inválido").min(10, "El correo debe tener al menos 10 caracteres").max(100, "El correo no puede exceder los 100 caracteres"),
  idPais: z.string().nonempty("El país es requerido"),
  codigoArea: z.string().nonempty("El código de área es requerido"),
  telefono: z.string().nonempty("Telefono requerido"),
  cargo: z.string().nonempty("Cargo es requerido").min(3, "El cargo debe tener al menos 3 caracteres").max(100, "El cargo no puede exceder los 100 caracteres"),
}).superRefine((data, ctx) => {
  const idPaisValue = data.idPais;
  if (idPaisValue === "95") {
    const len = data.telefono?.length || 0;
    if (len < 10 || len > 11) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "El teléfono debe tener entre 10 y 11 caracteres.",
        path: ["telefono"],
      });
    }
  }
});
