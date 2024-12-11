import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import type { TravelAgencyEntry } from "../schemas/agency.schema";
import type { LoginEntry } from "../schemas/login.schema";
import type { TouristEntry } from "../schemas/tourist.schema";
import { createTravelAgency } from "../services/agency.services";
import { createAuthResponse } from "../services/auth.services";
import { sendWelcomeEmail } from "../services/email.services";
import { createTourist } from "../services/tourist.services";
import { findUserByEmail, updateUser } from "../services/user.services";

export const registerTourist = async (req: Request, res: Response) => {
  try {
    const dataNewTourist = req.body as TouristEntry;

    const newTourist = await createTourist(dataNewTourist);

    await sendWelcomeEmail(dataNewTourist.email, dataNewTourist.firstName);

    res.status(201).json({
      message: "Tourist registered successfully!",
      data: newTourist,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ errors: [{ message: "Error at registering the tourist" }] });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as LoginEntry;

    const userFound = await findUserByEmail(email);

    if (!userFound) {
      throw new Error("User not found");
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      userFound.password
    );

    if (!isPasswordCorrect) {
      throw new Error("Incorrect password");
    }

    const user = await updateUser(userFound.userId, { lastLogin: new Date() });

    const resAuth = createAuthResponse(user);
    res.status(200).json({
      message: "User logged in successfully!",
      ...resAuth,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res.status(400).json({
        errors: [{ message: `Error at logging. ${error.message}` }],
      });
    }
  }
};

export const registerTravelAgency = async (req: Request, res: Response) => {
  try {
    const dataNewTravelAgency = req.body as TravelAgencyEntry;

    const newTravelAgency = await createTravelAgency(dataNewTravelAgency);

    res.status(201).json({
      message: "Travel Agency registered successfully!",
      data: newTravelAgency,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      errors: [{ message: "Error at registering the travel agency" }],
    });
  }
};
