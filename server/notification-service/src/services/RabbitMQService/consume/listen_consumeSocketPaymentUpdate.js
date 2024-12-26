import {channel} from "../init.js";
import {QUEUE_NAME} from "../constantQueueName.js";
import socketIoService from "../../SocketIoService.js";

export async function listen_consumeSocketPaymentUpdate() {
    channel.consume(QUEUE_NAME.socketPaymentUpdate, async (msg) => {
        if (msg) {
            const data = JSON.parse(
                msg.content.toString()
            );
            socketIoService.emitPaymentUpdate(data);
            channel.ack(msg);
        }
    });
}