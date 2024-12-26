import socketIoService from "../../SocketIoService.js";
import {QUEUE_NAME} from "../constantQueueName.js";
import {channel} from "../init.js";

export async function listen_consumeSocketAttendance() {
    channel.consume(
        QUEUE_NAME.socketAttendance,
        async (msg) => {
            if (msg) {
                const data = JSON.parse(msg.content.toString());
                socketIoService.emitAttendance(data);
            }
        },
        {
            noAck: true,
        }
    );
}
