import express from "express";
import jwt from "jsonwebtoken";
import {ApiError} from "../utils/apiError.js";
import config from "../config/config.js";

var {Request, Response, NextFunction} = express;
const jwtSecret = config.JWT_SECRET;

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.json({
            status: 401,
            message: "Missing authorization header",
        });
    }
    const [, token] = authHeader.split(" ");
    if (!token) {
        return res.json({
            status: 401,
            message: "Missing Token",
        });
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = {
            _id: decoded._id,
            role: decoded.role,
            firstName: decoded.firstName,
            lastName: decoded.lastName,
            password: "",
        };
        return next();
    } catch (error) {
        return res.json({
            status: 401,
            message: "Wrong token!",
        });
    }
};
const verifyAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.json({
            status: 401,
            message: "Missing authorization header",
        });
    }
    if (req?.user?.role === "ADMIN") {
        req.user = req.user;
        return next();
    } else {
        return res.json({
            status: 403,
            message: "Not permission!",
        });
    }
};

const verifyRoles = (roles) => {
    return (req, res, next) => {
        if (!roles) {
            return next();
        }
        const authHeader = req.headers.authorization;
        let user;
        if (!authHeader) {
            return res.json({
                status: 401,
                message: "Missing authorization header",
            });
        }
        const [, token] = authHeader.split(" ");
        if (!token) {
            return res.json({
                status: 401,
                message: "Missing Token",
            });
        }
        try {
            const decoded = jwt.verify(token, jwtSecret);
            user = {
                _id: decoded._id,
                role: decoded.role,
                firstName: decoded.firstName,
                lastName: decoded.lastName,
                password: "",
            };
        } catch (error) {
            return res.json({
                status: 401,
                message: error.message,
            });
        }

        if (!user) {
            return res.json({
                status: 401,
                message: "Missing authorization header",
            });
        }

        if (user?.role && roles.includes(user?.role)) {
            req.user = user;
            return next();
        } else {
            return res.json({
                status: 403,
                message: "Not permission!",
            });
        }
    };
};
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode =
            error.statusCode ||
            (error instanceof Error
                ? 400 // Bad Request
                : 500); // Internal Server Error
        const message =
            error.message ||
            (statusCode === 400 ? "Bad Request" : "Internal Server Error");
        error = new ApiError(statusCode, message, false, err.stack.toString());
    }
    next(error);
};

const errorHandler = (err, req, res, next) => {
    let {statusCode, message} = err;
    if (process.env.NODE_ENV === "production" && !err.isOperational) {
        statusCode = 500; // Internal Server Error
        message = "Internal Server Error";
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === "development" && {stack: err.stack}),
    };

    if (process.env.NODE_ENV === "development") {
        console.error(err);
    }

    res.status(statusCode).json(response);
    next();
};

export {
    authMiddleware,
    errorConverter,
    errorHandler,
    verifyAdmin,
    verifyRoles,
};
