import {createServer} from "http";
import {Server as SocketIOServer} from "socket.io";
import app from "./app.js";
import {connectDB} from "./database/index.js";
import config from "./config/config.js";

let server;
const PORT = config.PORT;
connectDB();

server = createServer(app).listen(PORT, () => {
    console.log(`Gateway is Listening to Port HTTPs ${PORT}`);
});

const io = new SocketIOServer(server);
io.on("connection", (socket) => {
    console.log("Client connected");
    socket.on("disconnect", () => {
        console.log("Client disconnected", socket.id);
    });

    socket.on("sendMessage", (message) => {
        io.emit("receiveMessage", message);
    });

    socket.on("sendMessage", async (data) => {
        const {senderId, receiverId, message} = data;
        const msg = new Message({senderId, receiverId, message});
        await msg.save();

        io.to(receiverId).emit("receiveMessage", msg); // Assuming receiverId is socket ID of the receiver
    });
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
