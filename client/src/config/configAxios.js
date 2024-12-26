import axios from 'axios';
import Cookies from 'js-cookie';

import { SERVER_URL } from '~/config';

const instance = axios.create({
    baseURL: SERVER_URL,
});

instance.interceptors.request.use((config) => {
    // Initialize headers if not already present
    config.headers = config.headers || {};
    const _authToken = Cookies.get('jwt');
    let authToken = {};
    if (_authToken) {
        authToken = _authToken.replace(/"/g, '');
    }

    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
    } else {
        console.warn('Token is missing. Do something...');
    }

    return config;
});

export default instance;
