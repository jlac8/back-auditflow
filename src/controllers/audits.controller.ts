import type { Request, Response } from "express";
import { createAudit, getAuditsByAuditor } from "../services/audits.service";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear Auditoría
export async function createAuditController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const auditorId = req.user?.id;

    if (!auditorId) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }

    const { leaderName, auditName, period } = req.body;

    if (!leaderName || !auditName || !period) {
      res.status(400).json({ error: "Faltan campos" });
      return;
    }

    const audit = await createAudit({
      auditorId,
      leaderName,
      auditName,
      period,
    });

    res.status(201).json({ data: audit });
  } catch (error) {
    console.error("Error creando auditoría:", error);
    res.status(500).json({ error: "Error al crear la auditoría" });
  }
}

// Obtener Auditorías
export async function getAuditsController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const auditorId = req.user?.id;

    if (!auditorId) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }

    const audits = await getAuditsByAuditor(auditorId);

    res.status(200).json({ data: audits });
  } catch (error) {
    console.error("Error obteniendo auditorías:", error);
    res.status(500).json({ error: "Error al obtener las auditorías" });
  }
}

// Eliminar Auditoría
export async function deleteAuditController(
  req: Request,
  res: Response
): Promise<void> {
  try {
    const auditorId = req.user?.id;
    const { auditId } = req.params;

    if (!auditorId) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }

    const audit = await prisma.audit.findUnique({
      where: { id: Number(auditId) },
    });

    if (!audit || audit.auditorId !== auditorId) {
      res.status(404).json({ error: "Auditoría no encontrada" });
      return;
    }

    await prisma.audit.delete({
      where: { id: Number(auditId) },
    });

    res.status(200).json({ message: "Auditoría eliminada con éxito" });
  } catch (error) {
    console.error("Error eliminando auditoría:", error);
    res.status(500).json({ error: "Error al eliminar la auditoría" });
  }
}
