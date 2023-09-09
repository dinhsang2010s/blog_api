const jwt = require("jsonwebtoken");

export const verifyAccessToken = (req: any, res: any, next: any) => {
  const token = req.headers["Authorization"]?.split(" ")?.[1];
  jwt.verify(token, process.env.JWT_SECRET, (err: any, user: any) => {
    if (err) {
      res.status(401).json({ message: "Token is not valid." });
      req.user = user;
      next();
    } else res.status(401).json({ message: "You are not authentication." });
  });
};
