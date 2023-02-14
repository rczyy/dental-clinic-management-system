import { RequestHandler } from "express";

export const checkAuth: RequestHandler = (req, res, next) => {
  if (!req.session.uid) {
    const error: ErrorMessage = { message: "Not authenticated" };
    res.status(401).json(error);
    return;
  }

  next();
};
