import { config } from "dotenv";

const configFile = `./.env`;
config({ path: configFile });

const {
  MONGO_URI,
  PORT,
  JWT_SECRET,
  NODE_ENV,
  MESSAGE_BROKER_URL,
  CLIENT_URL,
} = process.env;
const queue = {
  notifications: "NOTIFICATIONS",
  socketNotifications: "SOCKET_NOTIFICATIONS",
  socketPaymentUpdate: "SOCKET_PAYMENT_UPDATE",
  paymentUpdateInUserService: "PAYMENT_UPDATE_IN_USER_SERVICE",
  socketAttendance: "SOCKET_ ATTENDANCE",
};
export default {
  MONGO_URI,
  PORT,
  JWT_SECRET,
  env: NODE_ENV,
  msgBrokerURL: MESSAGE_BROKER_URL,
  queue,
  CLIENT_URL,
};
