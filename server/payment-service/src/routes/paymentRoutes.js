import {Router} from "express";
import paymentController from "../controllers/paymentController.js";
import {verifyRoles} from "../middleware/index.js";

const routes = Router();

//posOs
routes.post("/create", verifyRoles(["USER"]), paymentController.createTransaction);
routes.post("/receive-hook", paymentController.receiveHook);
routes.get("/histories", verifyRoles(["USER"]), paymentController.getHistory);
routes.get("/all-histories", verifyRoles(["ACCOUNTANT"]), paymentController.getAllHistory);

export default routes;