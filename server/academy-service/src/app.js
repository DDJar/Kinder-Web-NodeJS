import express from "express";
import route from "./routes/index.js";
import roomRouter from "./routes/roomRoutes.js";
import { errorConverter, errorHandler } from "./middleware/index.js";
import curriculumRoute from "./routes/curriculumRoute.js";

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(route);
app.use(roomRouter);
app.use(curriculumRoute)
app.use(errorConverter);
app.use(errorHandler);

export default app;
