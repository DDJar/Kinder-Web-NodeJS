import { SERVER_URL } from '~/config';

export const createHealthLogs = {
    url: `${SERVER_URL}/users/healthlog`,
    method: 'POST',
};
export const getHealthLogs = (childId) => ({
    url: `${SERVER_URL}/users/children/${childId}/health-logs`,
    method: 'GET',
});
