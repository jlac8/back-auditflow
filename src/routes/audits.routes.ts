import { Router } from "express";
import { verifyAuthRequest } from "../middlewares/verifyAuthRequest";
import {
  createAuditController,
  getAuditsController,
  deleteAuditController,
} from "../controllers/audits.controller";

const router = Router();

router.post("/", verifyAuthRequest, createAuditController);
router.get("/", verifyAuthRequest, getAuditsController);
router.delete("/:auditId", verifyAuthRequest, deleteAuditController);

export default router;
