const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";

import { RegisterModel } from "../interfaces";
import User, { UserModel } from "../models/user";

export const registerUser = async (req: any, res: any) => {
  try {
    const user: RegisterModel = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    await new User({
      name: user.name,
      displayName: user.displayName ?? user.name,
      password: hashedPassword,
    }).save();

    res.sendStatus(200).json({ name: user.name });
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};

const generateToken = (payload: any) => {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY as any, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

export const loginUser = async (req: any, res: any) => {
  try {
    const user = await User.findOne<UserModel>({ name: req.body.name });
    if (!user) {
      return res.status(401).json({ message: "User not found!" });
    }

    const password = await bcrypt.compare(req.body.password, user.password);
    if (!password)
      return res.status(401).json({ message: "Incorrect password!" });

    if (user && password) {
      const accessToken = generateToken({ id: user.id });

      res.status(200).json({
        type: "Bearer",
        accessToken,
      });
    }
  } catch (error: any) {
    res.status(500).json(error.message);
  }
};
