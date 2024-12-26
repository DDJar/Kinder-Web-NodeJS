import express from "express";
import proxy from "express-http-proxy";
import cors from "cors";
import { createServer } from "http";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT | 85;

const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://kindergartenabc.netlify.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);

      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

const users = proxy(process.env.USER_PROXY_URL, {
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.rejectUnauthorized = false;
    return proxyReqOpts;
  },
});
const messages = proxy(process.env.MESSAGES_PROXY_URL, {
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.rejectUnauthorized = false;
    return proxyReqOpts;
  },
});
const notifications = proxy(process.env.NOTIFICATIONS_PROXY_URL, {
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.rejectUnauthorized = false;
    return proxyReqOpts;
  },
});
const academies = proxy(process.env.ACADEMIES_PROXY_URL, {
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.rejectUnauthorized = false;
    return proxyReqOpts;
  },
});
const communitions = proxy(process.env.COMMUNITIONS_PROXY_URL, {
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.rejectUnauthorized = false;
    return proxyReqOpts;
  },
});
const payment = proxy(process.env.PAYMENT_PROXY_URL, {
  proxyReqOptDecorator: function (proxyReqOpts, srcReq) {
    proxyReqOpts.rejectUnauthorized = false;
    return proxyReqOpts;
  },
});

app.use("/users", users);
app.use("/messages", messages);
app.use("/notifications", notifications);
app.use("/academies", academies);
app.use("/communitions", communitions);
app.use("/payments", payment);
const server = createServer(app).listen(PORT, () => {
  console.log(`Gateway is Listening to Port HTTPs ${PORT}`);
});
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
