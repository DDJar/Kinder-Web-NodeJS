import {Router} from "express";
import roomController from "../controllers/roomController.js";
import {verifyRoles} from "../middleware/index.js";

const userRouter = Router();

userRouter.post(
    "/create-room",
    verifyRoles(["STAFF"]),
    roomController.createRoom
);
userRouter.get("/room/:roomId", verifyRoles(["STAFF", "USER"]), roomController.getRoom);
userRouter.put("/room/:roomId", verifyRoles(["STAFF"]), roomController.updateRoom);
userRouter.get("/room", verifyRoles(["STAFF"]), roomController.getAllRooms);
userRouter.get("/rooms", verifyRoles(["STAFF", "USER"]), roomController.getRooms);

export default userRouter;
