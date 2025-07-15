import { z } from "zod";

export const loginSchema = z.object({
  user: z.string().email("Correo inválido"),
  pass: z.string().nonempty("La contraseña no puede estar vacia"),
});