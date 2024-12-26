import academyBusiness from "../../../business/academyBusiness.js";
import {channel} from "../init.js";
import {QUEUE_NAME} from "../constantQueueName.js";

export async function listen_consumeUpdateAcademy() {
    channel.consume(QUEUE_NAME.requestQueueUpdateAcademy, async (msg) => {
        if (msg) {
            try {
                const {type, idAcademy, updateData} = JSON.parse(
                    msg.content.toString()
                );
                await academyBusiness.UpdateAcademies(type, idAcademy, updateData);
                channel.ack(msg);
                console.log("Update processed and message acknowledged");
            } catch (error) {
                console.error("Error processing update academy message:", error);
                channel.ack(msg);
            }
        }
    });
}