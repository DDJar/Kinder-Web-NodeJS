import {channel, correlationMap, getUuid} from "../init.js";
import {QUEUE_NAME} from "../constantQueueName.js";

export async function RabbitMq_GetAcademyById(type, idAcademy) {
    return new Promise((resolve, reject) => {
        const correlationId = getUuid();
        try {
            const data = {
                type: type,
                idAcademy: idAcademy,
            };
            correlationMap.set(correlationId, resolve);
            channel.sendToQueue(
                QUEUE_NAME.requestQueueGetAcademy,
                Buffer.from(JSON.stringify(data)),
                {correlationId}
            );
        } catch (error) {
            reject(error);
        }
    })
}