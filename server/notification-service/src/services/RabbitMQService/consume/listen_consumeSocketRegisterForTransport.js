import socketIoService from "../../SocketIoService.js";
import { QUEUE_NAME } from "../constantQueueName.js";
import { channel } from "../init.js";

export async function listen_consumeSocketRegisterForTransport() {
  channel.consume(
    QUEUE_NAME.socketRegisterForTransport,
    async (msg) => {
      if (msg) {
        const data = JSON.parse(msg.content.toString());
        socketIoService.emitRegisterForTransport(data);
      }
    },
    {
      noAck: true,
    }
  );
}
