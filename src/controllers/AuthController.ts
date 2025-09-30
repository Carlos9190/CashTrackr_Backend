import type { Request, Response } from "express";
import User from "../models/User";
import { checkPassword, hashPassword } from "../utils/auth";
import { generateToken } from "../utils/token";
import { AuthEmail } from "../emails/AuthEmail";
import { generateJWT } from "../utils/jwt";

export class AuthController {
  static createAccount = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      const error = new Error("A user with that email is already registered");
      res.status(409).json({ error: error.message });
      return;
    }

    try {
      const user = await User.create(req.body);
      user.password = await hashPassword(password);
      const token = generateToken();
      user.token = token;

      if (process.env.NODE_ENV !== "production") {
        globalThis.cashTrackrConfirmationToken = token;
      }

      await user.save();

      await AuthEmail.sendConfirmationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
      });

      res.status(201).json("Account successfully created");
    } catch (error) {
      res.status(500).json({ error: "There was an error" });
    }
  };

  static confirmAccount = async (req: Request, res: Response) => {
    const { token } = req.body;

    const user = await User.findOne({ where: { token } });
    if (!user) {
      const error = new Error("Invalid token");
      res.status(401).json({ error: error.message });
      return;
    }
    user.confirmed = true;
    user.token = null;
    await user.save();

    res.json("Account successfully confirmed");
  };

  static login = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("User not found");
      res.status(404).json({ error: error.message });
      return;
    }

    if (!user.confirmed) {
      const error = new Error("The account has not been confirmed");
      res.status(403).json({ error: error.message });
      return;
    }

    const isPasswordCorrect = await checkPassword(password, user.password);

    if (!isPasswordCorrect) {
      const error = new Error("Incorrect password");
      res.status(401).json({ error: error.message });
      return;
    }

    const token = generateJWT(user.id);
    res.json(token);
  };

  static forgotPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      const error = new Error("User not found");
      res.status(404).json({ error: error.message });
      return;
    }

    user.token = generateToken();
    await user.save();

    await AuthEmail.sendPasswordResetToken({
      name: user.name,
      email: user.email,
      token: user.token,
    });

    res.json("Check your email for instructions");
  };

  static validateToken = async (req: Request, res: Response) => {
    const { token } = req.body;

    const tokenExists = await User.findOne({ where: { token } });
    if (!tokenExists) {
      const error = new Error("Invalid token");
      res.status(404).json({ error: error.message });
      return;
    }

    res.json("Valid token, set a new password");
  };

  static resetPasswordWithToken = async (req: Request, res: Response) => {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({ where: { token } });
    if (!user) {
      const error = new Error("Invalid token");
      res.status(404).json({ error: error.message });
      return;
    }

    user.password = await hashPassword(password);
    user.token = null;
    await user.save();

    res.json("The password was successfully updated");
  };

  static user = async (req: Request, res: Response) => {
    res.json(req.user);
  };

  static updateUser = async (req: Request, res: Response) => {
    const { email, name } = req.body;

    const userExists = await User.findOne({ where: { email } });
    if (userExists && req.user.id !== userExists.id) {
      const error = new Error("A user with that email is already registered");
      res.status(409).json({ error: error.message });
      return;
    }

    try {
      const { id } = req.user;
      await User.update(
        { email, name },
        {
          where: { id },
        }
      );
      res.json("Profile successfully updated");
    } catch (error) {
      res.status(500).json({ error: "There was an error" });
    }
  };

  static updateCurrentUserPassword = async (req: Request, res: Response) => {
    const { password, current_password } = req.body;
    const { id } = req.user;

    const user = await User.findByPk(id);
    const isPasswordCorrect = await checkPassword(
      current_password,
      user.password
    );
    if (!isPasswordCorrect) {
      const error = new Error("Incorrect current password");
      res.status(401).json({ error: error.message });
      return;
    }

    user.password = await hashPassword(password);
    await user.save();

    res.json("The password was changed successfully");
  };

  static checkPassword = async (req: Request, res: Response) => {
    const { password } = req.body;
    const { id } = req.user;

    const user = await User.findByPk(id);
    const isPasswordCorrect = await checkPassword(password, user.password);
    if (!isPasswordCorrect) {
      const error = new Error("Incorrect current password");
      res.status(401).json({ error: error.message });
      return;
    }

    res.json("Correct password");
  };
}
