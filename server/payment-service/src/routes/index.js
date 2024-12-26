import { Router } from "express";
import Controller from "../controllers/index.js";
import { authMiddleware } from "../middleware/index.js";

const routes = Router();
routes.post("/create-transaction", authMiddleware, Controller.newTransaction);
routes.post("/create_payment_url", authMiddleware, Controller.createPaymentUrl);
routes.get("/vnpay_return", authMiddleware, Controller.vnpayReturn);
routes.get("/vnpay_ipn", Controller.vnpayIpn);
routes.get("/salary", authMiddleware, Controller.getSalary);

//posOs
export default routes;
