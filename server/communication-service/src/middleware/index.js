import express from "express";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/apiError.js";
import config from "../config/config.js";

var { Request, Response, NextFunction } = express;
const jwtSecret = config.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log (authHeader);
  if (!authHeader) {
    return next(new ApiError(401, "Missing authorization header"));
  }
  const [, token] = authHeader.split(" ");
  try {
    const decoded = jwt.verify(token, jwtSecret);
    console.log(decoded);
    req.user = {
      _id: decoded._id,
      email: decoded.email,
      role: decoded.role,
      createdAt: new Date(decoded.iat * 1000),
      updatedAt: new Date(decoded.exp * 1000),
      name: decoded.name,
      password: "",
    };
    return next();
  } catch (error) {
    console.error(error);
    return next(new ApiError(401, "Invalid token"));
  }
};
const verifyAdmin = async (req, res, next) => {
  if (!req.user) {
    return next(new ApiError(401, "Missing authorization header"));
  }
  if (req?.user?.role === "ADMIN") {
    return next();
  } else {
    return next(new ApiError(401, "Not permission!"));
  }
};
const errorConverter = (err, req, res, next) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error instanceof Error ? 400 : 500);
    const message =
      error.message ||
      (statusCode === 400 ? "Bad Request" : "Internal Server Error");
    error = new ApiError(statusCode, message, false, err.stack.toString());
  }
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;
  if (process.env.NODE_ENV === "production" && !err.isOperational) {
    statusCode = 500;
    message = "Internal Server Error";
  }

  res.locals.errorMessage = err.message;

  const response = {
    code: statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  if (process.env.NODE_ENV === "development") {
    console.error(err);
  }

  res.status(statusCode).json(response);
  next();
};

export { authMiddleware, errorConverter, errorHandler,verifyAdmin };
