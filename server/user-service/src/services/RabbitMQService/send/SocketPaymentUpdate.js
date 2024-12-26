import {QUEUE_NAME} from "../constantQueueName.js";
import {channel} from "../init.js";

export async function RabbitMQ_SocketPaymentUpdate(data) {
    const payload = {
        data,
    };
    try {
        channel.sendToQueue(
            QUEUE_NAME.requestSocketPaymentUpdate,
            Buffer.from(JSON.stringify(payload))
        );
    } catch (error) {
        console.error("Error in sending socket payment update:", error.message);
    }
}