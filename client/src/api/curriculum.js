import { SERVER_URL } from '~/config';

export const createCurriculumApi = {
    url: `${SERVER_URL}/academies/create-curriculum`,
    method: 'POST',
};

export const getAllCurriculumApi = {
    url: `${SERVER_URL}/academies/getAllCurriculum`,
    method: 'GET',
};
