import amqp from "amqplib";
import config from "../../config/config.js";
import {QUEUE_NAME} from "./constantQueueName.js";
import {consumeForRequests} from "./consumeForRequests.js";
import {v4 as uuidv4} from "uuid";

let correlationMap = new Map();
let channel = null

async function init() {
    // Establish connection to RabbitMQ server
    const connection = await amqp.connect(config.msgBrokerURL);
    channel = await connection.createChannel();

    for (const [, value] of Object.entries(QUEUE_NAME)) {
        await channel.assertQueue(value);
    }

    // Start listening for messages on the request queue
    await consumeForRequests();
}

let countReconnections;
countReconnections = 1;

async function initConnectionRabbitMQ() {
    try {
        console.log("RabbitMQ Connecting...");
        await init()
        countReconnections = 0
        console.log("RabbitMQ Connection successfully");
    } catch (err) {
        console.log("ERROR:::", err.message);
        console.log("Reconnect...", countReconnections, "times")
        if (countReconnections <= 5) {
            countReconnections++;
            setTimeout(initConnectionRabbitMQ, 5000);
        }
    }
}

function getUuid() {
    return uuidv4();
}

export {
    initConnectionRabbitMQ,
    getUuid,
    channel,
    correlationMap
}