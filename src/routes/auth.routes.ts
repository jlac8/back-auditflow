import { Router } from "express";
import { loginAuditor, registerAuditor } from "../controllers/auth.controller";
import { validateRequest } from "../middlewares/validateRequest";
import { loginSchema } from "../schemas/login.schema";

const authRouter = Router();

authRouter.post("/register-auditor", registerAuditor);
authRouter.post("/login", validateRequest(loginSchema), loginAuditor);

export default authRouter;
