import { SERVER_URL } from '~/config';

export const _createAcademy = {
    url: `${SERVER_URL}/academies/create`,
    method: 'POST',
};
export const _createCategory = {
    url: `${SERVER_URL}/academies/category`,
    method: 'POST',
};
export const getAllCategory = {
    url: `${SERVER_URL}/academies/get-category`,
    method: 'GET',
};
export const registerClass = {
    url: `${SERVER_URL}/users/register-class`,
    method: 'POST',
};
export const registerSkill = {
    url: `${SERVER_URL}/users/register-skill`,
    method: 'POST',
};
export const getRegisterClass = {
    url: `${SERVER_URL}/users/get-register-class`,
    method: 'GET',
};
export const arrangeChild = {
    url: `${SERVER_URL}/users/arrange-child`,
    method: 'POST',
};
export const changeClassChild = {
    url: `${SERVER_URL}/users/change-class-child`,
    method: 'POST',
};
