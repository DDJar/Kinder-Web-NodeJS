import React from 'react';
import Navbar from './Navbar';
import { NavLink } from 'react-router-dom';
import { Login03Icon } from 'hugeicons-react';
// import DropdownMessage from './DropdownMessage';
import DropdownNotification from './DropdownNotification';
import DropdownUser from './DropdownUser';
import { useUserProvider } from '~/hooks/user/useUserProvider';

const Header = () => {
    const { user } = useUserProvider();

    return (
        <header className="sticky top-0 z-20 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
            <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
                <div className="hidden sm:block ">
                    <Navbar user={user} />
                </div>
                {!user?._id ? (
                    <div className="flex justify-end space-x-4">
                        <NavLink to="/login">
                            <button
                                to="/login"
                                type="submit"
                                className="flex rounded bg-primary px-7 pb-2.5 pt-3 text-sm font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 ease-in-out hover:bg-secondary hover:shadow-primary-2 focus:bg-primary-accent-300 focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
                                data-twe-ripple-init
                                data-twe-ripple-color="light"
                            >
                                <Login03Icon className="size-6 mr-2" />
                                Tham gia ngay!
                            </button>
                        </NavLink>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 2xsm:gap-7">
                        <ul className="flex items-center gap-2 2xsm:gap-4">
                            <DropdownNotification user={user} />
                            {/*<DropdownMessage />*/}
                        </ul>
                        <DropdownUser user={user} />
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;
