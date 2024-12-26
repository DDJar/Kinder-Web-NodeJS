import {Router} from "express";
import {
    authMiddleware,
    verifyAdmin,
    verifyRoles,
} from "../middleware/index.js";
import paymentController from "../controllers/paymentController.js";

const paymentRouter = Router();

paymentRouter.get("/tuition-detail", verifyRoles(["USER"]), paymentController.GetTuitionFees);
paymentRouter.get("/children-learn", verifyRoles(["USER"]), paymentController.GetMyChildrenLearn);
export default paymentRouter;