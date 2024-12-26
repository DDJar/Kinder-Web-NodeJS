import {Router} from "express";
import userController from "../controllers/userController.js";
import {
    authMiddleware,
    verifyAdmin,
    verifyRoles,
} from "../middleware/index.js";

const userRouter = Router();

userRouter.put(
    "/profile/change-password",
    authMiddleware,
    userController.changePassword
);

// Define the route to get the image URL by blob name
userRouter.post(
    "/profile/upload-avatar",
    authMiddleware,
    userController.uploadAvatar
);
userRouter.get("/profile/avatar", authMiddleware, userController.getAvatarUrl);
userRouter.post(
    "/profile/children/upload-avatar",
    authMiddleware,
    userController.uploadChildAvatar
);
userRouter.get(
    "/profile/children/:childId/avatar",
    authMiddleware,
    userController.getChildAvatarUrl
);
userRouter.put(
    "/profile/change-password",
    authMiddleware,
    userController.changePassword
);
userRouter.get("/profile", authMiddleware, userController.getProfile);
userRouter.post("/add-child", authMiddleware, userController.addChild);
userRouter.get("/children", userController.getChildren);
userRouter.get("/children/transport-detail", verifyRoles(["USER"]), userController.getChildrenTransportDetail);
userRouter.post(
    "/update-status-academy",
    verifyRoles(["STAFF"]),
    userController.updateAcademyStatus
);
userRouter.get(
  "/children/:childId?",
  verifyRoles(["USER", "STAFF"]),
  userController.getChildById
);
userRouter.post(
    "/healthlog",
    verifyRoles(["STAFF", "TEACHER"]),
    userController.createHealthlog
);
userRouter.get(
    "/children/:childId/class-skill",
    verifyRoles(["USER"]),
    userController.getClassAndSkillInfo
);
userRouter.get(
    "/children/:childId/all",
    authMiddleware,
    userController.getChildAll
);
userRouter.post(
    "/children/:id/register",
    authMiddleware,
    verifyRoles(["USER"]),
    userController.createAdmissionApplication
);
userRouter.post(
    "/register-transport",
    authMiddleware,
    verifyRoles(["USER", "STAFF"]),
    userController.createregistertransport
);
userRouter.get(
    "/get-transport",
    authMiddleware,
    verifyRoles(["USER", "STAFF"]),
    userController.getAllTransportationApplications
);
userRouter.get(
    "/get-all-transport",
    authMiddleware,
    verifyRoles(["STAFF"]),
    userController.getAllTransport
);
userRouter.put(
    "/update-transport",
    authMiddleware,
    verifyRoles(["STAFF", "USER"]),
    userController.updateregistertransport
);
userRouter.get(
    "/children/:id/get-register",
    authMiddleware,
    verifyRoles(["USER"]),
    userController.getRegisterByChildId
);
userRouter.post(
    "/create-child",
    authMiddleware,
    userController.createChildTransport
);
userRouter.put(
    "/children/:id/register/update",
    authMiddleware,
    verifyRoles(["USER"]),
    userController.updateAdmissionApplication
);
userRouter.get(
    "/children/:id/get-upload",
    authMiddleware,
    verifyRoles(["USER"]),
    userController.getAdmissionDocumentsByChildId
);

userRouter.post(
    "/children/:id/upload",
    authMiddleware,
    verifyRoles(["USER"]),
    userController.createAdmissionDocument
);
userRouter.put(
    "/children/:id/upload/update",
    authMiddleware,
    verifyRoles(["USER"]),
    userController.updateAdmissionDocument
);
userRouter.put(
  "/children/:childId?",
  verifyRoles(["USER"]),
  userController.updateChildren
);
userRouter.get(
    "/children/:childId/attendance",
    verifyRoles(["USER"]),
    userController.getAttendance
);
userRouter.get("/get-users", verifyRoles(["ADMIN"]), userController.getUsers);
userRouter.get(
    "/search-users",
    verifyRoles(["ADMIN"]),
    userController.searchUsers
);
userRouter.put(
    "/update-user/:userId?",
    verifyRoles(["ADMIN"]),
    userController.updateUsers
);
userRouter.put(
    "/lock-user/:userId?",
    verifyRoles(["ADMIN"]),
    userController.lockUsers
);

userRouter.put("/update-profile", authMiddleware, userController.updateProfile);
userRouter.get(
  "/get-register-for-school/:id?",
  verifyRoles(["STAFF", "USER"]),
  userController.getDataFormRegister
);
userRouter.post(
    "/process-register-for-school",
    verifyRoles(["STAFF", "USER"]),
    userController.processingDataFormRegister
);
userRouter.get(
    "/get-child-in-academy",
    verifyRoles(["STAFF"]),
    userController.getChildAcademy
);
userRouter.get(
    "/get-child-wait",
    verifyRoles(["STAFF"]),
    userController.getChildWait
);
userRouter.get(
    "/search-child-wait",
    verifyRoles(["STAFF"]),
    userController.searchChildWait
);
userRouter.post(
    "/arrange-child",
    verifyRoles(["STAFF"]),
    userController.arrangeChild
);
userRouter.post(
    "/change-class-child",
    verifyRoles(["STAFF"]),
    userController.changeClassChild
);
userRouter.get(
    "/get-child-by-classes",
    verifyRoles(["TEACHER", "STAFF"]),
    userController.getChildrenByClassId
);
userRouter.get(
    "/children/:childId/health-logs",
    verifyRoles(["USER", "STAFF", "TEACHER"]),
    userController.getChildDevelopment
);

userRouter.get(
    "/get-child-by-skill",
    verifyRoles(["TEACHER"]),
    userController.getChildrenBySkillId
);

userRouter.post(
    "/check-in-child-in-class",
    verifyRoles(["TEACHER"]),
    userController.checkInClassChild
);
userRouter.post(
    "/check-out-child-in-class",
    verifyRoles(["TEACHER"]),
    userController.checkOutClassChild
);
userRouter.post(
    "/get-users/:userId/feedback",
    verifyRoles(["USER"]),
    userController.createFeedback
);
userRouter.get(
    "/get-users/:userId?",
    verifyRoles(["USER", "ADMIN"]),
    userController.getUserById
);
userRouter.get(
    "/get-all-feedback",
    //verifyRoles(["STAFF", "ADMIN"]),
    //authMiddleware,
    userController.getAllFeedbacks
);
userRouter.get(
    "/get-application-school/:id",
    verifyRoles(["USER"]),
    userController.getApplicationbyId
);
export default userRouter;
