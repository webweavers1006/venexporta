import { z } from "zod";

export const verificationCodeSchema = z.object({
  code: z.string().min(1, "El código es requerido"),
  newPassword: z.string()
    .min(8, "La nueva clave debe tener al menos 8 caracteres")
    .regex(/[a-z]/, "La nueva clave debe contener al menos una letra minúscula")
    .regex(/[A-Z]/, "La nueva clave debe contener al menos una letra mayúscula")
    .regex(/[0-9]/, "La nueva clave debe contener al menos un número")
    .regex(/[^a-zA-Z0-9]/, "La nueva clave debe contener al menos un carácter especial"),
});