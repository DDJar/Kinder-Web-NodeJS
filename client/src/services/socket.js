import { io } from 'socket.io-client';
import { SERVER_URL_USER } from '~/config';

const URL = SERVER_URL_USER;
export const socket = io(URL, {
    autoConnect: false, // Disable auto connect
});
