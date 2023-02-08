import { RequestHandler } from "express";

export const checkAuth: RequestHandler = (req, res, next) => {
  if (!req.session.uid) {
    res.status(401).json({ message: "Not authenticated" });
    return;
  }

  next();
};
