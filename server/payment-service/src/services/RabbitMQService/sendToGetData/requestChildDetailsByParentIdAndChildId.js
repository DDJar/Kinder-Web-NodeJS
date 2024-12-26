import {channel, correlationMap, getUuid} from "../init.js";
import {QUEUE_NAME} from "../constantQueueName.js";

export async function RabbitMQ_requestChildDetailsByParentIdAndChildId(parentId, childId) {
    return new Promise((resolve, reject) => {
        const correlationId = getUuid();
        try {
            const data = {
                parentId: parentId,
                childId: childId,
            };
            correlationMap.set(correlationId, resolve);
            channel.sendToQueue(
                QUEUE_NAME.requestQueueGetChildDetailsByParentIdAndChildId,
                Buffer.from(JSON.stringify(data)),
                {correlationId}
            );
        } catch (error) {
            console.log("Error processing message:", error);
            reject(error);
        }
    });
}