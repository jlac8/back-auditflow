import type { User } from "@prisma/client";
import { z } from "zod";

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

export type UserWithRelations = User & {
  auditor?: Auditor;
};
