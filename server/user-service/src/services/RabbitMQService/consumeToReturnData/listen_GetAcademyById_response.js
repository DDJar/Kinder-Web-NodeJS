import {QUEUE_NAME} from "../constantQueueName.js";
import {channel, correlationMap} from "../init.js";

async function listen_GetAcademyById_Response() {
    channel.consume(
        QUEUE_NAME.responseQueueGetAcademy,
        (msg) => {
            if (msg) {
                const correlationId = msg.properties.correlationId;
                const data = JSON.parse(msg.content.toString());
                const resolve = correlationMap.get(correlationId);
                if (resolve) {
                    resolve(data);
                    correlationMap.delete(correlationId);
                }
            }
        },
        {noAck: true}
    );
}

export default listen_GetAcademyById_Response;