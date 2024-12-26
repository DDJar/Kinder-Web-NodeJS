import socketIoService from "../../SocketIoService.js";
import { QUEUE_NAME } from "../constantQueueName.js";
import { channel } from "../init.js";

export async function listen_consumeSocketRegisterForSchool() {
  channel.consume(
    QUEUE_NAME.socketRegisterForSchool,
    async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        socketIoService.emitRegisterForSchool(data);
      }
    },
    {
      noAck: true,
    }
  );
}
