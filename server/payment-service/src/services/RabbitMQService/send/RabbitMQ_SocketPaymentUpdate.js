import {channel} from "../init.js";
import {QUEUE_NAME} from "../constantQueueName.js";

export async function RabbitMQ_SocketPaymentUpdate(data) {
    const payload = {
        data,
    };
    try {
        channel.sendToQueue(
            QUEUE_NAME.socketPaymentUpdate,
            Buffer.from(JSON.stringify(payload))
        );
    } catch (error) {
        console.error("Error in sending socket payment update:", error.message);
    }
}