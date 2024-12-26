import socketIoService from "../../SocketIoService.js";
import {QUEUE_NAME} from "../constantQueueName.js";
import {channel} from "../init.js";

export async function listen_consumeSocketNotification() {
    channel.consume(QUEUE_NAME.socketNotifications, async (msg) => {
            if (msg) {
                const {type, user, message, sender} = JSON.parse(
                    msg.content.toString()
                );
                socketIoService.emitNotification(type, user, message, sender);
            }
        },
        {
            noAck: true,
        }
    );
}
