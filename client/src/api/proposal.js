import { SERVER_URL } from '~/config';

export const getProposal = {
    url: `${SERVER_URL}/communitions/get-proposal`,
    method: 'GET',
};
export const createProposal = {
    url: `${SERVER_URL}/communitions/proposal`,
    method: 'POST',
};
export const getProposalById = {
    url: `${SERVER_URL}/communitions/getproposalbyId`, // Adjusted to include proposal ID
    method: 'GET',
};
export const deleteProposal = {
    url: `${SERVER_URL}/communitions/deletebyId`, // Adjusted to include proposal ID
    method: 'DELETE',
};
export const updateProposal = {
    url: `${SERVER_URL}/communitions//updateproposal`,
    method: 'PUT',
};
export const getVote = {
    url: `${SERVER_URL}/communitions/get-vote`,
    method: 'GET',
};
export const updateVote = {
    url: `${SERVER_URL}/communitions//updatevote`,
    method: 'PUT',
};
export const createVote = {
    url: `${SERVER_URL}/communitions/vote`,
    method: 'POST',
};
