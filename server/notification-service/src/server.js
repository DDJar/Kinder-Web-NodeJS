import express from "express";
import {createServer} from "http";
import {errorConverter, errorHandler} from "./middleware/index.js";
import config from "./config/config.js";

import SocketIoService from "./services/SocketIoService.js";
import {initConnectionRabbitMQ} from "./services/RabbitMQService/init.js";

const app = express();
let server;
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(errorConverter);
app.use(errorHandler);

server = createServer(app).listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`);
});

SocketIoService.init(server);

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
