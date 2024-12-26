import {QUEUE_NAME} from "../constantQueueName.js";
import {channel} from "../init.js";

export async function RabbitMQ_notifyReceiver(
    receiverId,
    receiverEmail,
    messageContent,
    senderEmail,
    senderName
) {
    let notificationPayload;
    notificationPayload = {
        type: "MESSAGE_RECEIVED_EMAIL",
        userId: receiverId,
        userEmail: receiverEmail,
        message: messageContent,
        from: senderEmail,
        fromName: senderName,
    };
    try {
        channel.sendToQueue(
            QUEUE_NAME.requestSendMail,
            Buffer.from(JSON.stringify(notificationPayload))
        );
    } catch (error) {
        console.error("Error in sending notification:", error.message);
    }
}