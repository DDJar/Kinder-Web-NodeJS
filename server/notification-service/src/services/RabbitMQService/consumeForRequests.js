import { listen_consumeNotification } from "./consume/listen_consumeNotification.js";
import { listen_consumeSocketNotification } from "./consume/listen_consumeSocketNotification.js";
import { listen_consumeSocketPaymentUpdate } from "./consume/listen_consumeSocketPaymentUpdate.js";
import { listen_consumeSocketAttendance } from "./consume/listen_consumeSocketAttendance.js";
import { listen_consumeSocketRegisterForSchool } from "./consume/listen_consumeSocketRegisterForSchool.js";
import { listen_consumeSocketRegisterForTransport } from "./consume/listen_consumeSocketRegisterForTransport.js";

export const consumeForRequests = async () => {
  await listen_consumeNotification();
  await listen_consumeSocketNotification();
  await listen_consumeSocketPaymentUpdate();
  await listen_consumeSocketAttendance();
  await listen_consumeSocketRegisterForSchool();
  await listen_consumeSocketRegisterForTransport();
};
