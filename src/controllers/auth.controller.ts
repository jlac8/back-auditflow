import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import type { LoginEntry } from "../schemas/login.schema";
import { createAuthResponse } from "../services/auth.services";
import { z } from "zod";
import { PrismaClient } from "@prisma/client";

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

export const registerAuditor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const dataNewAuditor = registerAuditorSchema.parse(req.body);

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
  } catch (error) {
    console.error(error);
    if (error instanceof z.ZodError) {
      res.status(400).json({
        errors: error.errors.map((e) => ({ message: e.message })),
      });
      return;
    }
    res.status(500).json({
      errors: [{ message: "Error at registering the auditor" }],
    });
  }
};

export const loginAuditor = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body as LoginEntry;

    const auditorFound = await prisma.auditor.findUnique({
      where: { email },
    });

    if (!auditorFound) {
      res.status(404).json({ errors: [{ message: "Auditor not found" }] });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      auditorFound.password
    );

    if (!isPasswordCorrect) {
      res.status(401).json({ errors: [{ message: "Incorrect password" }] });
      return;
    }

    const resAuth = createAuthResponse(auditorFound);
    res.status(200).json({
      message: "Auditor logged in successfully!",
      ...resAuth,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      errors: [{ message: `Error at logging in. ${error.message}` }],
    });
  }
};
