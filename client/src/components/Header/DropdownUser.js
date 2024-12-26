import { Link, useNavigate } from 'react-router-dom';
import PopoverComp from '../Popover';
import { ArrowDown01Icon, Logout04Icon, UserIcon } from 'hugeicons-react';

import { useUserProvider } from '~/hooks/user/useUserProvider';

const DropdownUser = () => {
    const { logout, user } = useUserProvider();
    const navigate = useNavigate();

    function handleLogout() {
        logout();
        navigate('/login');
    }

    return (
        <PopoverComp
            button={
                <span className="flex items-center gap-4">
                    <span className="text-right lg:block">
                        <span className="block text-fa-xl font-medium text-black">{`${user.firstName} ${user.lastName}`}</span>
                        <span className="block text-sm">{user.role}</span>
                    </span>
                    <span className="rounded-full">
                        {user.avatar ? (
                            <img src={`${user.avatar}`} className="size-12 rounded-full object-cover" alt="User Avt" />
                        ) : (
                            <img src="/img/default-avt.png" className="size-12" alt="User Avt" />
                        )}
                    </span>
                    <ArrowDown01Icon className={`size-6  `} />
                </span>
            }
            notifying={false}
            right
        >
            <div className="px-4 py-1 w-60">
                <ul className="flex flex-col gap-5 border-b border-stroke px-6 py-1">
                    <li className="mt-2">
                        <Link
                            to={`/profile/${user._id}`}
                            className="flex items-center gap-1.5 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                        >
                            <UserIcon className="size-6" />
                            Thông tin cá nhân
                        </Link>
                    </li>
                </ul>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3.5 px-6 py-4 text-sm font-medium duration-300 ease-in-out hover:text-primary lg:text-base"
                >
                    <Logout04Icon className="size-6" />
                    Đăng xuất
                </button>
            </div>
        </PopoverComp>
    );
};

export default DropdownUser;
