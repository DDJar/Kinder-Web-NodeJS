import Cookies from 'js-cookie';
import React, { createContext, useCallback, useState } from 'react';
import axios from '~/config/configAxios';
import { _logout } from '~/api/user';

export const UserProviderContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(initUser());
    const [isLogin, setIsLogin] = useState(user !== null);

    function initUser() {
        const savedUser = Cookies.get('userInfor');
        if (savedUser) {
            return JSON.parse(savedUser);
        } else return null;
    }

    const login = useCallback((userInfor, jwt) => {
        setUser(userInfor);
        Cookies.set('userInfor', JSON.stringify(userInfor), { expires: 1 });
        Cookies.set('jwt', JSON.stringify(jwt), { expires: 1 });
        setIsLogin(true);
    }, []);
    const logout = useCallback(async () => {
        setUser(null);
        Cookies.remove('userInfor');
        Cookies.remove('jwt');
        Cookies.remove('connect.sid');
        await axios({
            method: _logout.method,
            url: _logout.url,
        });
        setIsLogin(false);
    }, []);

    const updateProfile = useCallback((userInfor) => {
        setUser(userInfor);
        Cookies.set('userInfor', JSON.stringify(userInfor), { expires: 7 });
    }, []);

    const contextValue = {
        user,
        isLogin,
        login,
        logout,
        updateProfile,
    };

    return <UserProviderContext.Provider value={contextValue}>{children}</UserProviderContext.Provider>;
};
