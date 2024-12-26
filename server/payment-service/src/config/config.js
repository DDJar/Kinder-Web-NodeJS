import {config} from "dotenv";

const configFile = `./.env`;
config({path: configFile});

const {
    MONGO_URI,
    PORT,
    JWT_SECRET,
    NODE_ENV,
    MESSAGE_BROKER_URL,
    vnp_TmnCode,
    vnp_HashSecret,
    vnp_Url,
    vnp_Api,
    vnp_ReturnUrl,
    CLIENT_URL,
    PAYOS_CLIENT_ID,
    PAYOS_API_KEY,
    PAYOS_CHECKSUM_KEY
} = process.env;

const queue = {
    notifications: "NOTIFICATIONS",
    socketPaymentUpdate: "SOCKET_PAYMENT_UPDATE",
    paymentUpdateInUserService: "PAYMENT_UPDATE_IN_USER_SERVICE",
};

export default {
    MONGO_URI,
    PORT,
    JWT_SECRET,
    env: NODE_ENV,
    msgBrokerURL: MESSAGE_BROKER_URL,
    queue,
    vnp_TmnCode,
    vnp_HashSecret,
    vnp_Url,
    vnp_Api,
    vnp_ReturnUrl,
    CLIENT_URL,
    PAYOS_CLIENT_ID,
    PAYOS_API_KEY,
    PAYOS_CHECKSUM_KEY
};
