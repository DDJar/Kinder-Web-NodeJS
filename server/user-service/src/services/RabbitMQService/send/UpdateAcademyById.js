import {channel} from "../init.js";
import {QUEUE_NAME} from "../constantQueueName.js";

export async function RabbitMQ_UpdateAcademyById(type, idAcademy, updateData) {
    try {
        const data = {
            type: type,
            idAcademy: idAcademy,
            updateData: updateData,
        };
        channel.sendToQueue(
            QUEUE_NAME.requestQueueUpdateAcademy,
            Buffer.from(JSON.stringify(data))
        );
    } catch (error) {
        console.error("Error in UpdateAcademyById:", error.message);
    }
}