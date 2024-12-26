import { SERVER_URL } from '~/config';

export const createRoom = {
    url: `${SERVER_URL}/academies/create-room`,
    method: 'POST',
};
export const getRoom = {
    url: `${SERVER_URL}/academies/room/:id`,
    method: 'GET',
};
export const updateRoom = {
    url: `${SERVER_URL}/academies/room/:id`,
    method: 'PUT',
};
export const getAllRooms = {
    url: `${SERVER_URL}/academies/room`,
    method: 'GET',
};
export const getRooms = {
    url: `${SERVER_URL}/academies/rooms`,
    method: 'GET',
};
