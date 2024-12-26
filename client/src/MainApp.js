import React, { useCallback, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import { publicRoutes } from '~/routes';
import { DefaultLayout } from './layout';
import { Fragment } from 'react';
import ToastNotification from './components/Notification';
import { useUserProvider } from './hooks/user/useUserProvider';

function MainApp() {
    const { user } = useUserProvider();
    const location = useLocation();
    const isPermitted = useCallback(
        (route) => {
            if (route.allowedRoles) {
                if (!user) {
                    return false;
                }
            }
            if (user && route.allowedRoles) {
                return route.allowedRoles.includes(user.role);
            }
            return true; // If no role is specified, allow access
        },
        [user], // Dependencies for the useCallback hook
    );
    useEffect(() => {
        if (
            location.pathname !== '/dashboards/academy/arrange-academy' ||
            location.pathname !== 'dashboards/transportation/arrange-transportation'
        ) {
            Cookies.remove('selectedChildren', { path: '/' });
        }
    }, [location.pathname]);
    return (
        <div className="App">
            <Routes>
                {publicRoutes.map((route, index) => {
                    let Layout = DefaultLayout;
                    if (route.layout) {
                        Layout = route.layout;
                    } else if (route.layout === null) {
                        Layout = Fragment;
                    }
                    const Page = route.component;

                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={
                                isPermitted(route) ? (
                                    <Layout>
                                        <Page />
                                    </Layout>
                                ) : (
                                    <Navigate to="/unauthorized" />
                                )
                            }
                        />
                    );
                })}
            </Routes>
            <ToastNotification />
        </div>
    );
}

export default MainApp;
