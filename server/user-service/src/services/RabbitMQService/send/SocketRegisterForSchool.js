import { channel } from "../init.js";
import { QUEUE_NAME } from "../constantQueueName.js";

export async function RabbitMQ_SocketRegisterForSchool(data) {
  const payload = {
    data,
  };
  try {
    channel.sendToQueue(
      QUEUE_NAME.socketRegisterForSchool,
      Buffer.from(JSON.stringify(payload))
    );
  } catch (error) {
    console.error("Error in sending socket register school:", error.message);
  }
}
