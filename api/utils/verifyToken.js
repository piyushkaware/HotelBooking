import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token)
    return next(createError(401, "no token you are not authenticated"));

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error) return next(createError(403, "Token not match is invalid"));
    req.user = user;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(
        createError(403, "user not match or not admin is not authorized")
      );
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, next, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(
        createError(403, "user not match or not admin is not authorized")
      );
    }
  });
};
