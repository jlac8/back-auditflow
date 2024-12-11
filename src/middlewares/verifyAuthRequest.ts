import type { NextFunction, Request, Response } from "express";
import { type AuthPayload, verifyToken } from "../services/auth.services";

export interface AuthRequest extends Request, AuthPayload {}

export const verifyAuthRequest = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      errors: [{ message: "Missing authorization header" }],
    });
    return;
  }

  try {
    const { touristId, travelAgencyId, username, email } = verifyToken(token);

    if (!touristId && !travelAgencyId) {
      throw new Error("No touristId or travelAgencyId");
    }
    req.touristId = touristId;
    req.travelAgencyId = travelAgencyId;
    req.username = username;
    req.email = email;
    next();
  } catch (error) {
    res.status(401).json({
      errors: [{ message: "Unauthorized" }],
    });
  }
};

type OnlyAuthRequest = Omit<AuthRequest, keyof Request>;

export const AuthReqHasValues = (
  req: AuthRequest,
  ...keys: (keyof OnlyAuthRequest)[]
): OnlyAuthRequest => {
  for (const key of keys) {
    if (req[key] === undefined) {
      throw new Error(`${key} is required`);
    }
  }

  const result = keys.reduce((acc, key) => {
    const value = req[key];
    acc[key] = value;
    return acc;
  }, {} as Record<keyof OnlyAuthRequest, unknown>);
  return result as OnlyAuthRequest;
};
