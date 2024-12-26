import { SERVER_URL } from '~/config';

export const registerSkill = {
    url: `${SERVER_URL}/payments/create-transaction`,
    method: 'POST',
};
export const getSalary = {
    url: `${SERVER_URL}/payments/salary`,
    method: 'GET',
};

export const getTuitionFees = {
    url: `${SERVER_URL}/users/get-tuition-fees`,
    method: 'GET',
};
export const createPaymen = {
    url: `${SERVER_URL}/payments/create`,
    method: 'POST',
};
export const getTuitionDetail = {
    url: `${SERVER_URL}/users/tuition-detail`,
    method: 'GET',
};
export const getMyChildrenLearn = {
    url: `${SERVER_URL}/users/children-learn`,
    method: 'GET',
};
export const getHistoryPayment = {
    url: `${SERVER_URL}/payments/histories`,
    method: 'GET',
};

export const getAllHistoryPayment = {
    url: `${SERVER_URL}/payments/all-histories`,
    method: 'GET',
};
