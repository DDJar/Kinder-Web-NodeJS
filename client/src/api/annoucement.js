import { SERVER_URL } from '~/config';

export const getAnnoucement = {
    url: `${SERVER_URL}/communitions/get-annoucement`,
    method: 'GET',
};
export const getAnnoucementById = {
    url: `${SERVER_URL}/communitions/getannoucebyId`, // Adjusted to include proposal ID
    method: 'GET',
};
export const createAnnoucement = {
    url: `${SERVER_URL}/communitions/annoucement`,
    method: 'POST',
};
export const updateAnnoucement = {
    url: `${SERVER_URL}/communitions//updateannoucement`,
    method: 'PUT',
};
