import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import type { LoginEntry } from "../schemas/login.schema"; // Asegúrate de que login.schema.ts existe con LoginEntry
import { createAuthResponse } from "../services/auth.services";
import { z } from "zod";
import { PrismaClient } from "@prisma/client"; // Prisma Importado

// Inicializa el cliente Prisma
const prisma = new PrismaClient();

export const registerAuditorSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  email: z.string().email("El correo electrónico debe ser válido"),
  password: z
    .string()
    .min(7, "La contraseña debe tener al menos 7 caracteres")
    .max(24, "La contraseña debe tener como máximo 24 caracteres"),
  teamName: z.string().optional(),
  role: z.string().optional(),
});

export type RegisterAuditorEntry = z.infer<typeof registerAuditorSchema>;

export const registerAuditor = async (req: Request, res: Response) => {
  try {
    const dataNewAuditor = registerAuditorSchema.parse(req.body);

    // Hasheamos la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(dataNewAuditor.password, 10);

    const newAuditor = await prisma.auditor.create({
      data: {
        name: dataNewAuditor.name,
        email: dataNewAuditor.email,
        password: hashedPassword,
        teamName: dataNewAuditor.teamName || undefined,
        role: dataNewAuditor.role || undefined,
      },
    });

    res.status(201).json({
      message: "Auditor registered successfully!",
      data: newAuditor,
    });
  } catch (error: any) {
    console.error(error);
    // Si el error es de validación de Zod, puedes manejarlo así:
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        errors: error.errors.map((e) => ({ message: e.message })),
      });
    }
    res
      .status(500)
      .json({ errors: [{ message: "Error at registering the auditor" }] });
  }
};

export const loginAuditor = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginEntry;

    // Buscamos el auditor por email
    const auditorFound = await prisma.auditor.findUnique({
      where: { email },
    });

    if (!auditorFound) {
      throw new Error("Auditor not found");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      auditorFound.password
    );

    if (!isPasswordCorrect) {
      throw new Error("Incorrect password");
    }

    // Si deseas actualizar campos como lastLogin, primero debes tener esa propiedad en tu modelo Auditor.
    // Por ejemplo, si agregas lastLogin DateTime en schema.prisma:
    // await prisma.auditor.update({
    //   where: { id: auditorFound.id },
    //   data: { lastLogin: new Date() },
    // });

    const resAuth = createAuthResponse(auditorFound);
    res.status(200).json({
      message: "Auditor logged in successfully!",
      ...resAuth,
    });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({
      errors: [{ message: `Error at logging in. ${error.message}` }],
    });
  }
};
