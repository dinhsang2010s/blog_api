const bcrypt = require("bcrypt");
import jwt from "jsonwebtoken";
import User, { UserModel } from "../models/user";

export const registerUser = async (req: any, res: any) => {
  try {
    const { name, password, displayName } = req.body;

    // Validation
    if (!name || !password)
      return res.status(400).json({ message: "Invalid username or password." });

    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Passwords must be at least 6 characters." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await new User({
      name,
      displayName: displayName ?? name,
      password: hashedPassword,
    }).save();

    res.sendStatus(200).json({ name });
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

    // Validate Request
    if (!name || !password)
      return res.status(400).json({ message: "Please add name and password." });

    const user = await User.findOne<UserModel>({ name });
    if (!user) return res.status(401).json({ message: "User not found." });

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword)
      return res.status(401).json({ message: "Incorrect password." });

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
