import {channel} from "../init.js";
import {QUEUE_NAME} from "../constantQueueName.js";

export async function RabbitMQ_SocketAttendance(data) {
    const payload = {
        data,
    };
    try {
        channel.sendToQueue(
            QUEUE_NAME.socketAttendance,
            Buffer.from(JSON.stringify(payload))
        );
    } catch (error) {
        console.error("Error in sending socket attendance:", error.message);
    }
}
