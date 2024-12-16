import type { NextFunction, Request, Response, RequestHandler } from "express";
import { verifyToken, type AuthPayload } from "../services/auth.services";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        name?: string;
        email?: string;
      };
    }
  }
}

export const verifyAuthRequest: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      errors: [{ message: "Missing authorization header" }],
    });
    return; // No se retorna Response, solo se hace return vacío (void)
  }

  try {
    const payload = verifyToken(token) as AuthPayload;
    const { auditorId, name, email } = payload;

    if (!auditorId) {
      throw new Error("No auditorId found in token");
    }

    // Ahora req.user está definido globalmente, no necesitamos `AuthRequest`
    req.user = {
      id: auditorId,
      name,
      email,
    };

    next();
  } catch (error) {
    console.error("Error in verifyAuthRequest:", error);
    res.status(401).json({
      errors: [{ message: "Unauthorized" }],
    });
    return; // Detenemos la ejecución con un return vacío.
  }
};

export const AuthReqHasValues = (
  req: Request,
  ...keys: (keyof NonNullable<Request["user"]>)[]
) => {
  if (!req.user) {
    throw new Error("No user in request");
  }

  for (const key of keys) {
    if (req.user[key] === undefined) {
      throw new Error(`${String(key)} is required`);
    }
  }

  return req.user; // Ahora req.user existe y tiene las keys requeridas
};
