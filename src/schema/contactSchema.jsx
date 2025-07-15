import { z } from "zod";
export const contactSchema = z.object({
  nombre: z.string().nonempty("Nombre requerido").min(3, "El nombre debe tener al menos 3 caracteres").max(100, "El nombre de la empresa no puede exceder los 100 caracteres"),
  correo: z.string().nonempty("Correo requerido").email("Correo inválido").min(10, "El correo debe tener al menos 10 caracteres").max(100, "El correo no puede exceder los 100 caracteres"),
  telefono: z.string().nonempty("Telefono requerido").min(10, "El telefono debe tener al menos 10 caracteres").max(11, "El telefono no puede exceder los 100 caracteres"),
  cargo: z.string().nonempty("Cargo es requerido").min(3, "El cargo debe tener al menos 3 caracteres").max(100, "El cargo no puede exceder los 100 caracteres"),

});
