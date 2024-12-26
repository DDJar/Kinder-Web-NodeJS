import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import config from "../config/config.js";
class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const encryptPassword = async (password) => {
  const encryptedPassword = await bcrypt.hash(password, 12);
  return encryptedPassword;
};
export function generateRandomPassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
}
const isPasswordMatch = async (password, userPassword) => {
  const result = await bcrypt.compare(password, userPassword);
  return result;
};
const jwtSecret = config.JWT_SECRET;
const COOKIE_EXPIRATION_DAYS = 90; // cookie expiration in days
const expirationDate = new Date(
  Date.now() + COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000
);
const cookieOptions = {
  expires: expirationDate,
  httpOnly: true,
  sameSite: "None",
  partitioned: true,
};
const createSendToken = async (user, expiresIn = "1d") => {
  const { _id, firstName, lastName, role } = user;
  const token = jwt.sign({ _id, firstName, lastName, role }, jwtSecret, {
    expiresIn: expiresIn,
  });
  if (config.env === "production") cookieOptions.secure = true;
  return token;
};

export { ApiError, encryptPassword, isPasswordMatch, createSendToken };
