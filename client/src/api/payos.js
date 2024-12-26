import axios from 'axios';
import { LISTS_BANK_URL } from '~/config';

export async function getListBank() {
    try {
        const res = await axios({
            method: 'GET',
            url: LISTS_BANK_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log(res.data);
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}
