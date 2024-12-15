// src/routes/profile.routes.ts
import { Router } from "express";
import { getProfile, updateProfile } from "../controllers/profile.controller";
import { verifyAuthRequest } from "../middlewares/verifyAuthRequest";
import { upload } from "../middlewares/upload.middleware";

const router = Router();

router.get("/profile", verifyAuthRequest, getProfile);

router.put(
  "/profile",
  verifyAuthRequest,
  upload.single("profilePicture"),
  updateProfile
);

export default router;
