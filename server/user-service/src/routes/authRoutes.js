import {Router} from "express";
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import {
    authMiddleware,
    verifyAdmin,
    verifyRoles,
} from "../middleware/index.js";
import passport from "passport";
import config from "../config/config.js";

const userRouter = Router();

userRouter.post("/register", authController.register);
userRouter.post("/login", authController.login);

userRouter.post(
    "/create-list-users",
    verifyRoles(["ADMIN"]),
    authController.createListUsers
);

userRouter.post(
    "/register-class",
    authMiddleware,
    userController.registerClass
);
userRouter.post(
    "/register-skill",
    authMiddleware,
    userController.registerSkill
);
userRouter.post("/send-link", authController.sendLinkEmail);
userRouter.post(
    "/reset-passwords",
    authMiddleware,
    authController.updatePassword
);
userRouter.get("/get-by-role", userController.getAllUsers);
userRouter.get(
    "/get-classes-by-teacher",
    userController.getClassesByTeacherFromAcademy
);

userRouter.get(
    "/get-register-class",
    userController.findUsersWithRegisteredChildren
);
userRouter.get(
    "/auth/google",
    passport.authenticate("google", {scope: ["profile", "email"]})
);
userRouter.get(
    "/auth/google/callback",
    passport.authenticate("google", {
        successRedirect: config.CLIENT_URL,
        failureRedirect: `${config.CLIENT_URL}/login`,
    })
);
userRouter.get("/login/sucess", authController.loginWithGG);
userRouter.get("/logout", authController.logout);
export default userRouter;
