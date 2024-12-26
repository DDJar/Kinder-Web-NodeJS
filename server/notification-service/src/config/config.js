import {config} from "dotenv";

const configFile = `./.env`;
config({path: configFile});

const {
    PORT,
    JWT_SECRET,
    NODE_ENV,
    MESSAGE_BROKER_URL,
    SENDINBLUE_APIKEY,
    EMAIL_FROM,
    SMTP_HOST,
    SMTP_PORT = 587,
    SMTP_USER,
    SMTP_PASS,
    EMAIL_APP_PASSWORD,
    CLIENT_URL,
} = process.env;

const queue = {
    notifications: "NOTIFICATIONS",
    socketNotifications: "SOCKET_NOTIFICATIONS",
    socketPaymentUpdate: "SOCKET_PAYMENT_UPDATE",
    socketAttendance: "SOCKET_ ATTENDANCE",
};
const socketMessages = {
    RECEIVE_MESSAGE: "receive_message",
    RECEIVE_NOTIFY: "receive_notify",

    //bus-service
    BUS_DRIVER_START_RUN: 'bus_driver_start_run',
    BUS_DRIVER_CANCLE_START_RUN: 'bus_driver_cancle_start_run',
    BUS_JOIN_ROOM: 'bus_join_room',
    BUS_LEAVE_ROOM: 'bus_leave_room',
    BUS_SHARE_LOCATION: 'bus_share_location',
    BUS_LOCATION: 'bus_location',
    BUS_IS_START: 'bus_is_start',
};

export default {
    PORT,
    JWT_SECRET,
    env: NODE_ENV,
    msgBrokerURL: MESSAGE_BROKER_URL,
    SENDINBLUE_APIKEY,
    EMAIL_FROM,
    EMAIL_APP_PASSWORD,
    CLIENT_URL,
    queue,
    socketMessages,
    smtp: {
        host: SMTP_HOST,
        port: Number(SMTP_PORT),
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
};
