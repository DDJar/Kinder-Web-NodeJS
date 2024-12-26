import { SERVER_URL } from '~/config';

export const _getUsers = {
    url: `${SERVER_URL}/users/get-by-role`,
    method: 'GET',
};
export const registAccount = {
    url: `${SERVER_URL}/users/register`,
    method: 'POST',
};
export const login = {
    url: `${SERVER_URL}/users/login`,
    method: 'POST',
};
export const loginGoogle = {
    url: `${SERVER_URL}/users/auth/google`,
    method: 'GET',
};
export const _logout = {
    url: `${SERVER_URL}/users/logout`,
    method: 'GET',
};
export const loginGoogleSucess = {
    url: `${SERVER_URL}/users/login/sucess`,
    method: 'GET',
};
export const createListUsers = {
    url: `${SERVER_URL}/users/create-list-users`,
    method: 'POST',
};
export const getUsers = {
    url: `${SERVER_URL}/users/get-users`,
    method: 'GET',
};
export const updateUsers = {
    url: `${SERVER_URL}/users/update-user`,
    method: 'PUT',
};
export const lockUsers = {
    url: `${SERVER_URL}/users/lock-user`,
    method: 'PUT',
};
export const searchUsers = {
    url: `${SERVER_URL}/users/search-users`,
    method: 'GET',
};
export const getProfile = {
    url: `${SERVER_URL}/users/profile`,
    method: 'GET',
};
export const uploadProfileAvatar = {
    url: `${SERVER_URL}/users/profile/upload-avatar`,
    method: 'POST',
};
export const getAvatar = {
    url: `${SERVER_URL}/users/profile/avatar`,
    method: 'GET',
};
export const uploadChildAvatar = {
    url: `${SERVER_URL}/users/profile/children/upload-avatar`,
    method: 'POST',
};
export const getChildAvatar = {
    url: `${SERVER_URL}/users/profile/children/:childId/avatar`,
    method: 'GET',
};
export const updateProfile = {
    url: `${SERVER_URL}/users/update-profile`,
    method: 'PUT',
};
export const sendLink = {
    url: `${SERVER_URL}/users/send-link`,
    method: 'POST',
};
export const resetPassWords = {
    url: `${SERVER_URL}/users/reset-passwords`,
    method: 'POST',
};
export const changePassword = {
    url: `${SERVER_URL}/users/profile/change-password`,
    method: 'PUT',
};
export const addChild = {
    url: `${SERVER_URL}/users/add-child`,
    method: 'POST',
};
export const getChildren = {
    url: `${SERVER_URL}/users/children`,
    method: 'GET',
};
export const updateStatusAcademyById = {
    url: `${SERVER_URL}/users/update-status-academy`,
    method: 'POST',
};
export const getChildById = (childId) => ({
    url: `${SERVER_URL}/users/children/${childId}`,
    method: 'GET',
});
export const getChildAll = (childId) => ({
    url: `${SERVER_URL}/users/children/${childId}/all`,
    method: 'GET',
});
export const updateChildren = (childId) => ({
    url: `${SERVER_URL}/users/children/${childId}`,
    method: 'PUT',
});
export const updateregistertransport = {
    url: `${SERVER_URL}/users/update-transport`,
    method: 'PUT',
};
export const findChildrenByClassId = (classId) => ({
    url: `${SERVER_URL}/users/get-child-by-classes/${classId}`,
    method: 'GET',
});
export const getClassAndSkillInfoByChildId = (childId) => ({
    url: `${SERVER_URL}/users/children/${childId}/class-skill`,
    method: 'GET',
});
export const getAttendance = (childId) => ({
    url: `${SERVER_URL}/users/children/${childId}/attendance`,
    method: 'GET',
});
export const findChildrenRegisterByAdnissionId = (adnissionId) => ({
    url: `${SERVER_URL}/users/get-register-for-school/${adnissionId}`,
    method: 'GET',
});
export const processChildrenRegister = {
    url: `${SERVER_URL}/users/process-register-for-school`,
    method: 'POST',
};
export const createAdmissionApplication = {
    url: `${SERVER_URL}/users/children/:id/register`,
    method: 'POST',
};
export const createregistertransport = {
    url: `${SERVER_URL}/users/register-transport`,
    method: 'POST',
};
export const createAdmissionDocument = {
    url: `${SERVER_URL}/users/children/:id/upload"`,
    method: 'POST',
};
export const getDataFormRegister = () => ({
    url: `${SERVER_URL}/users/get-register-for-school/:id`,
    method: 'GET',
});
export const findChildrenByAcademy = {
    url: `${SERVER_URL}/users/get-child-in-academy`,
    method: 'GET',
};
export const findChildrenToArrange = {
    url: `${SERVER_URL}/users/get-child-wait`,
    method: 'GET',
};
export const searchChildrenToArrange = {
    url: `${SERVER_URL}/users/search-child-wait`,
    method: 'GET',
};
export const getAllTransportationApplications = {
    url: `${SERVER_URL}/users/get-transport`,
    method: 'GET',
};
export const getAllTransport = {
    url: `${SERVER_URL}/users/get-all-transport`,
    method: 'GET',
};
export const getChildrenByClassId = {
    url: `${SERVER_URL}/users/get-child-by-classes`,
    method: 'GET',
};
export const getChildrenBySkillId = {
    url: `${SERVER_URL}/users/get-child-by-skill`,
    method: 'GET',
};
export const checkInChild = {
    url: `${SERVER_URL}/users/check-in-child-in-class`,
    method: 'POST',
};
export const checkOutChild = {
    url: `${SERVER_URL}/users/check-out-child-in-class`,
    method: 'POST',
};
export const updateAdmissionApplication = {
    url: `${SERVER_URL}/users/children/:id/register/update`,
    method: 'PUT',
};
export const updateAdmissionDocument = {
    url: `${SERVER_URL}/users/children/:id/upload/update`,
    method: 'PUT',
};
export const getRegisterByChildId = {
    url: `${SERVER_URL}/users/children/:id/get-register`,
    method: 'GET',
};
export const getUserById = {
    url: `${SERVER_URL}/users/get-users/:userId`,
    method: 'GET',
};
export const createFeedback = {
    url: `${SERVER_URL}/users/get-users/:userId/feedback`,
    method: 'POST',
};
export const getAllFeedbacks = {
    url: `${SERVER_URL}/users/get-all-feedback`,
    method: 'GET',
};
export const viewApplication = {
    url: `${SERVER_URL}/users/get-application-school/:id`,
    method: 'GET',
};
export const getChildrenTransportDetails = {
    url: `${SERVER_URL}/users/children/transport-detail`,
    method: 'GET',
};
