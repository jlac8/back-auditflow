import type { Auditor } from "@prisma/client";
import jwt from "jsonwebtoken";
import { SECRET_JWT_KEY } from "../config";

export interface AuthPayload {
  auditorId?: number;
  name?: string;
  email?: string;
}

export const signToken = (payload: AuthPayload): string => {
  return jwt.sign(payload, SECRET_JWT_KEY, { expiresIn: "6h" });
};

export const verifyToken = (token: string): AuthPayload => {
  const result = jwt.verify(token, SECRET_JWT_KEY);
  if (typeof result === "string") {
    throw new Error("Invalid token");
  }
  return result as AuthPayload;
};

export const createAuthResponse = (auditor: Auditor) => {
  const { id, name, email, password, ...otherData } = auditor;

  // Generamos el token utilizando la información del auditor
  const token = signToken({ auditorId: id, name, email });

  return {
    token,
    data: {
      id,
      name,
      email,
      ...otherData,
    },
  };
};
