import academyBusiness from "../../../business/academyBusiness.js";
import {QUEUE_NAME} from "../constantQueueName.js";
import {channel} from "../init.js";


export async function listen_getAcademyById_response() {
    channel.consume(QUEUE_NAME.requestQueueGetAcademy, async (msg) => {
        if (msg) {
            let result = {};
            try {
                const {type, idAcademy} = JSON.parse(msg.content.toString());
                result = await academyBusiness.GetAcademiesById(type, idAcademy);
                channel.sendToQueue(
                    QUEUE_NAME.responseQueueGetAcademy,
                    Buffer.from(JSON.stringify(result)),
                    {correlationId: msg.properties.correlationId}
                );
                channel.ack(msg);
                console.log("GET processed and message acknowledged");
            } catch (error) {
                console.error("Error processing get academy message:", error);
                channel.ack(msg);
            }
        }
    });
}
