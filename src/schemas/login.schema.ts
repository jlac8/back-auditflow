// src/schemas/login.schema.ts
import { z } from "zod";
import type { Auditor } from "@prisma/client";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "El correo electrónico es obligatorio")
    .email("El correo electrónico debe ser válido"),
  password: z
    .string()
    .min(1, "La contraseña es obligatoria")
    .min(7, "La contraseña debe tener al menos 7 caracteres")
    .max(24, "La contraseña debe tener como máximo 24 caracteres"),
});

export type LoginEntry = z.infer<typeof loginSchema>;

// Si en algún momento necesitas relacionar auditor con audits u otras relaciones,
// podrías definir un tipo AuditorWithRelations. Pero por ahora, no es obligatorio.
export type AuditorWithRelations = Auditor & {
  audits?: Auditor[];
  // Añade otras relaciones si es necesario, por ejemplo riskMatrices o walkthroughs
  // dependiendo de tu lógica interna.
};
