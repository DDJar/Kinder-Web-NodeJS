import {QUEUE_NAME} from "../constantQueueName.js";
import {channel} from "../init.js";

const returnUserData = async () => {
    channel.consume(QUEUE_NAME.requestUserDetails, async (msg) => {
        if (msg && msg?.content) {
            const {userId} = JSON.parse(msg.content.toString());
            // const userDetails = await getUserDetails(userId);
            const userDetails = {
                _id: userId,
                name: "Hoang y"
            };

            // Send the user details response
            channel.sendToQueue(
                QUEUE_NAME.responseUserDetails,
                Buffer.from(JSON.stringify(userDetails)),
                {correlationId: msg.properties.correlationId}
            );

            // Acknowledge the processed message
            channel.ack(msg);
        }
    });
}

export default returnUserData;