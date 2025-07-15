import { z } from "zod";

export const docCompaniesSchema = z.object({
  tipo: z.string().nonempty("Debe seleccionar una opción"),
  archivo: z
    .any()
    .refine((file) => file instanceof File && file.type === "application/pdf", {
      message: "Debe seleccionar un archivo PDF",
    }),
});
