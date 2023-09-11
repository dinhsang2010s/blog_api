const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
import User, { UserModel } from "../models/user";

export const registerUser = async (req: any, res: any) => {
  try {
    const { name, password, displayName } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.findOne<UserModel>({ name });
    if (user?.name)
      return res.status(500).json({ message: "User already registered" });

    await new User({
      name,
      displayName: displayName ?? name,
      password: hashedPassword,
    }).save();

    res.status(200).json({ name });
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
    const { name, password } = req.body;
    const user = await User.findOne<UserModel>({ name });
    if (!user)
      return res.status(401).json({ message: `User ${name} not found` });

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword)
      return res.status(401).json({ message: "Incorrect password" });

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
