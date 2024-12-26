import {QUEUE_NAME} from "../constantQueueName.js";
import {channel, correlationMap} from "../init.js";

async function listen_requestChildDetailsByParentIdAndChildId_response() {
    channel.consume(
        QUEUE_NAME.responseQueueGetChildDetailsByParentIdAndChildId,
        (msg) => {
            if (msg) {
                const correlationId = msg.properties.correlationId;
                const data = JSON.parse(msg.content.toString());
                const resolve = correlationMap.get(correlationId);
                if (resolve) {
                    resolve(data);
                    correlationMap.delete(correlationId);
                }
                channel.ack(msg);
            }
        }
    );
}

export default listen_requestChildDetailsByParentIdAndChildId_response;