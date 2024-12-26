import PageTitle from '~/common/PageTitle';

import Banner from './Banner';
import TopRatedTeachersCarousel from './TopRatedTeachersCarousel';

import React, { useEffect } from 'react';
import axios from '~/config/configAxios';
import { loginGoogleSucess } from '~/api/user';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import { useNavigate } from 'react-router-dom';
import LandingPage from '~/pages/Landing';

function Home() {
    const navigate = useNavigate();
    const { login, user } = useUserProvider();
    const allowedRoles = ['STAFF', 'ADMIN', 'TEACHER'];
    const getUser = async () => {
        if (!user) {
            try {
                const res = await axios({
                    method: loginGoogleSucess.method,
                    url: loginGoogleSucess.url,
                    withCredentials: true,
                });
                if (res.data.data) {
                    login(res.data.data, res.data.token);
                }
            } catch (error) {
                navigate('/');
            }
        }
    };

    useEffect(() => {
        getUser();
    }, [user]);
    return (
        <>
            {user?._id ? (
                <div>
                    <PageTitle title="Kindergarten | Home" />
                    {/* header */}
                    <Banner />
                    {allowedRoles.includes(user.role) && <TopRatedTeachersCarousel />}
                    <div className="mx-30"></div>
                </div>
            ) : (
                <LandingPage />
            )}
        </>
    );
}

export default Home;
