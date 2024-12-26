import { SERVER_URL } from '~/config';
export const createTransportationService = {
    url: `${SERVER_URL}/users/create-transportation-service`,
    method: 'POST',
};

export const getTransportationService = {
    url: `${SERVER_URL}/users/get-transportation-service`,
    method: 'GET',
};
export const searchTransportationService = {
    url: `${SERVER_URL}/users/search-transportation-service`,
    method: 'GET',
};
export const updateTransportationServiceById = {
    url: `${SERVER_URL}/users/update-transportation-service`,
    method: 'PUT',
};
export const getChildWaitTransportationService = {
    url: `${SERVER_URL}/users/get-wait-child-transportation-service`,
    method: 'GET',
};
export const searchChildWaitTransportationService = {
    url: `${SERVER_URL}/users/search-wait-child-transportation-service`,
    method: 'GET',
};
export const arrangeChildTransportationService = {
    url: `${SERVER_URL}/users/arrange-child-transportation-service`,
    method: 'POST',
};
export const getChildrenByTransportId = {
    url: `${SERVER_URL}/users/get-child-by-transportation`,
    method: 'GET',
};
export const checkInTransportationChild = {
    url: `${SERVER_URL}/users/check-in-child-in-transportation`,
    method: 'POST',
};
export const checkOutTransportationChild = {
    url: `${SERVER_URL}/users/check-out-child-in-transportation`,
    method: 'POST',
};
export const GetTransportationById = {
    url: `${SERVER_URL}/users/get-transport-id`,
    method: 'GET',
};
export const GetDriverById = {
    url: `${SERVER_URL}/users/get-driver-id`,
    method: 'GET',
};
export const getChildrenByTransport = {
    url: `${SERVER_URL}/users/get-child-in-transportation`,
    method: 'GET',
};
