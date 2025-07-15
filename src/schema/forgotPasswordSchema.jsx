import * as z from "zod";

export const forgotPasswordSchema = z.object({
  correo: z.string().email("Correo inválido"),
});