import {channel} from "../init.js";
import {QUEUE_NAME} from "../constantQueueName.js";

export async function RabbitMQ_PaymentUpdateInUserService(data) {
    const payload = {
        data,
    };
    try {
        channel.sendToQueue(
            QUEUE_NAME.paymentUpdateInUserService,
            Buffer.from(JSON.stringify(payload))
        );
    } catch (error) {
        console.error(
            "Error in sending payment update in user service:",
            error.message
        );
    }
}