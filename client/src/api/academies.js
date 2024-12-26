import { SERVER_URL } from '~/config';

export const getClass = {
    url: `${SERVER_URL}/academies/get-class`,
    method: 'GET',
};
export const getSkill = {
    url: `${SERVER_URL}/academies/get-skill`,
    method: 'GET',
};
export const getAcademyById = {
    url: `${SERVER_URL}/academies/get-adcademy-by-id`,
    method: 'GET',
};
export const updateAcademyById = {
    url: `${SERVER_URL}/academies/update-adcademy-by-id`,
    method: 'PUT',
};
export const getClassesByTeacher = {
    url: `${SERVER_URL}/academies/get-classes-by-teacher`,
    method: 'GET',
};
export const getSkilessByTeacher = {
    url: `${SERVER_URL}/academies/get-skilles-by-teacher`,
    method: 'GET',
};

export const getadcademy = {
    url: `${SERVER_URL}/academies/get-adcademy`,
    method: 'GET',
};
export const searchAdcademy = {
    url: `${SERVER_URL}/academies/search-adcademy`,
    method: 'GET',
};
