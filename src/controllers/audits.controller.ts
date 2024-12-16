import type { Request, Response } from "express";
import { createAudit, getAuditsByAuditor } from "../services/audits.service";
import { PrismaClient } from "@prisma/client"; // Prisma Importado

// Inicializa el cliente Prisma
const prisma = new PrismaClient();

// Crear Auditoría
export async function createAuditController(req: Request, res: Response) {
  try {
    const auditorId = req.user?.id;

    if (!auditorId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const { leaderName, auditName, period } = req.body;

    if (!leaderName || !auditName || !period) {
      return res.status(400).json({ error: "Faltan campos" });
    }

    const audit = await createAudit({
      auditorId,
      leaderName,
      auditName,
      period,
    });

    return res.status(201).json({ data: audit });
  } catch (error: any) {
    console.error("Error creando auditoría:", error);
    return res.status(500).json({ error: "Error al crear la auditoría" });
  }
}

// Obtener Auditorías
export async function getAuditsController(req: Request, res: Response) {
  try {
    const auditorId = req.user?.id;

    if (!auditorId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const audits = await getAuditsByAuditor(auditorId);

    return res.status(200).json({ data: audits });
  } catch (error: any) {
    console.error("Error obteniendo auditorías:", error);
    return res.status(500).json({ error: "Error al obtener las auditorías" });
  }
}

export async function deleteAuditController(req: Request, res: Response) {
  try {
    const auditorId = req.user?.id;
    const { auditId } = req.params;

    if (!auditorId) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const audit = await prisma.audit.findUnique({
      where: { id: Number(auditId) },
    });

    if (!audit || audit.auditorId !== auditorId) {
      return res.status(404).json({ error: "Auditoría no encontrada" });
    }

    await prisma.audit.delete({
      where: { id: Number(auditId) },
    });

    return res.status(200).json({ message: "Auditoría eliminada con éxito" });
  } catch (error: any) {
    console.error("Error eliminando auditoría:", error);
    return res.status(500).json({ error: "Error al eliminar la auditoría" });
  }
}
