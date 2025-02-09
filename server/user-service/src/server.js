import express from "express";
import passport from "passport";
import dotenv from "dotenv";
import session from "express-session";
import {errorConverter, errorHandler} from "./middleware/index.js";
import {connectDB} from "./database/index.js";
import authRouter from "./routes/authRoutes.js"; // Adjust the path
import userRouter from "./routes/userRoutes.js";
import "./services/social/google.js"; // Import Passport configuration
import config from "./config/config.js";
import paymentRouter from "./routes/paymentRoutes.js";
import transportationRouter from "./routes/transportationRoutes.js";
import {initConnectionRabbitMQ} from "./services/RabbitMQService/init.js";
dotenv.config();

const app = express();
let server;
const PORT = process.env.PORT | 8081;
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        cookie: {httpOnly: false, secure: false},
    })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

app.use(authRouter);
app.use(userRouter);
app.use(paymentRouter);
app.use(transportationRouter);
app.use(errorConverter);
app.use(errorHandler);

await connectDB();

server = app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});


//new rabbitmq
await initConnectionRabbitMQ()

const exitHandler = () => {
    if (server) {
        server.close(() => {
            console.info("Server closed");
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    console.error(error);
    exitHandler();
};

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);
export default app;
