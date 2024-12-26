import {channel} from "../init.js";
import {QUEUE_NAME} from "../constantQueueName.js";

export async function RabbitMQ_SocketNotifyUsers(user, message, sender) {
    const notificationPayload = {
        type: "MESSAGE_RECEIVED_EMAIL",
        user,
        message,
        sender,
    };
    try {
        channel.sendToQueue(
            QUEUE_NAME.requestSocketNotifications,
            Buffer.from(JSON.stringify(notificationPayload))
        );
    } catch (error) {
        console.error("Error in sending socket notification:", error.message);
    }
}