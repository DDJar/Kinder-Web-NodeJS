import {channel} from "../init.js";
import {QUEUE_NAME} from "../constantQueueName.js";
import {EmailService} from "../../EmailService.js";

const emailService = new EmailService();

export async function listen_consumeNotification() {
    channel.consume(
        QUEUE_NAME.notifications,
        async (msg) => {
            if (msg) {
                const {type, message, userEmail, fromName} = JSON.parse(
                    msg.content.toString()
                );
                switch (type) {
                    case "MESSAGE_RECEIVED_EMAIL":
                        await emailService.sendEmail(
                            userEmail,
                            `New Message from ${fromName}`,
                            message
                        );
                        break;
                    case "MESSAGE_RECEIVED_SMS":
                        break;

                    default:
                        break;
                }
            }
        }, {
            noAck: true,
        })
    ;
}