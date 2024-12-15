import type { Request, Response } from "express";
import {
  updateAuditorProfile,
  getAuditorById,
} from "../services/profile.services";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

export async function updateProfile(req: MulterRequest, res: Response) {
  try {
    const auditorId = req.user?.id;
    if (!auditorId) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }

    const { name, teamName, role } = req.body;

    let profilePictureUrl: string | undefined;
    if (req.file) {
      profilePictureUrl = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
    }

    const updatedAuditor = await updateAuditorProfile({
      auditorId,
      name,
      teamName,
      role,
      profilePictureUrl,
    });

    res.status(200).json({ data: updatedAuditor });
    return;
  } catch (error: any) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Error al actualizar el perfil" });
    return;
  }
}

export async function getProfile(req: Request, res: Response) {
  try {
    const auditorId = req.user?.id;
    if (!auditorId) {
      res.status(401).json({ error: "No autorizado" });
      return;
    }

    const auditor = await getAuditorById(auditorId);
    if (!auditor) {
      res.status(404).json({ error: "Auditor no encontrado" });
      return;
    }

    res.status(200).json({ data: auditor });
    return;
  } catch (error: any) {
    console.error("Error getting profile:", error);
    res.status(500).json({ error: "Error al obtener el perfil" });
    return;
  }
}
