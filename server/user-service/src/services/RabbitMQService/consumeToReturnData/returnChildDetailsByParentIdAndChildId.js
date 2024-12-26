import userBusiness from "../../../business/userBusiness.js";
import {QUEUE_NAME} from "../constantQueueName.js";
import {channel} from "../init.js";

export async function returnChildDetailsByParentIdAndChildId() {
    channel.consume(
        QUEUE_NAME.requestQueueGetChildDetailsByParentIdAndChildId,
        async (msg) => {
            if (msg) {
                let result = {};
                try {
                    const {parentId, childId} = JSON.parse(msg.content.toString());
                    result =
                        await userBusiness.handleGetChildDetailByParentIdAndChildId(
                            parentId,
                            childId
                        );
                    channel.sendToQueue(
                        QUEUE_NAME.responseQueueGetChildDetailsByParentIdAndChildId,
                        Buffer.from(JSON.stringify(result)),
                        {correlationId: msg.properties.correlationId}
                    );
                    channel.ack(msg);
                    console.log("GET processed and message acknowledged ChildDetailsByParentIdAndChildId");
                } catch (error) {
                    console.error("Error processing ChildDetailsByParentIdAndChildId:", error);
                    channel.ack(msg);
                }
            }
        }
    );
}
