import express from "express";
import route from "./routes/index.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import { errorConverter, errorHandler } from "./middleware/index.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(route);
app.use(paymentRoutes);
app.use(errorConverter);
app.use(errorHandler);

export default app;
