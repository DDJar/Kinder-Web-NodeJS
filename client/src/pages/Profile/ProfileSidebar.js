import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { NavLink, useLocation } from 'react-router-dom';
import { uploadImage } from '~/utils/uploadFile/uploadImage';
import { toast } from 'react-toastify';
import { uploadProfileAvatar } from '~/api/user';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import axios from 'axios';
import Button from '~/components/Button';

const ProfileSidebar = () => {
    const { user, updateProfile } = useUserProvider();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewOpen, setIsViewOpen] = useState(false);
    const [userRole, setUserRole] = useState('');

    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        setUserRole(user.role);
    }, []);

    const renderLinksBasedOnRole = () => {
        switch (userRole) {
            case 'USER':
                return (
                    <ul className="flex flex-col pb-[160px] space-y-4">
                        <NavLink
                            to={`/profile/${user._id}`}
                            className={`flex items-center px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === `/profile/${user._id}` ? 'text-primary' : ''
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#666666"
                                className="mr-2"
                            >
                                <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                            </svg>
                            Thông tin cá nhân
                        </NavLink>
                        <NavLink
                            to="/profile/children"
                            className={`flex items-center px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/profile/children' ? 'text-primary' : ''
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#666666"
                                className="mr-2"
                            >
                                <path d="M580-490q-21 0-35.5-14.5T530-540q0-21 14.5-35.5T580-590q21 0 35.5 14.5T630-540q0 21-14.5 35.5T580-490Zm-200 0q-21 0-35.5-14.5T330-540q0-21 14.5-35.5T380-590q21 0 35.5 14.5T430-540q0 21-14.5 35.5T380-490Zm100 210q-60 0-108.5-33T300-400h360q-23 54-71.5 87T480-280Zm0 160q-75 0-140.5-28.5t-114-77q-48.5-48.5-77-114T120-480q0-75 28.5-140.5t77-114q48.5-48.5 114-77T480-840q75 0 140.5 28.5t114 77q48.5 48.5 77 114T840-480q0 75-28.5 140.5t-77 114q-48.5 48.5-114 77T480-120Zm0-80q116 0 198-82t82-198q0-116-82-198t-198-82h-12q-6 0-12 2-6 6-8 13t-2 15q0 21 14.5 35.5T496-680q9 0 16.5-3t15.5-3q12 0 20 9t8 21q0 23-21.5 29.5T496-620q-45 0-77.5-32.5T386-730v-6q0-3 1-8-83 30-135 101t-52 163q0 116 82 198t198 82Zm0-280Z" />
                            </svg>
                            Thông tin con
                        </NavLink>
                        <NavLink
                            to="/view-transport"
                            className={`flex items-center px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/view-transport' ? 'text-primary' : ''
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#666666"
                                className="mr-2"
                            >
                                <path d="M480-120q-132 0-226-94T160-480q0-132 94-226t226-94q132 0 226 94t94 226q0 132-94 226t-226 94Zm0-80q105 0 177.5-72.5T730-480q0-105-72.5-177.5T480-730q-105 0-177.5 72.5T230-480q0 105 72.5 177.5T480-200ZM440-490v-200h80v150h150v80H440Z" />
                            </svg>
                            Lịch sử đăng ký dịch vụ
                        </NavLink>
                        <NavLink
                            to="/account-security"
                            className={`flex items-center px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/account-security' ? 'text-primary' : ''
                            }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#666666"
                                className="mr-2"
                            >
                                <path d="M480-80q-139-35-229.5-159.5T160-516v-244l320-120 320 120v244q0 152-90.5 276.5T480-80Zm0-84q97-30 162-118.5T718-480H480v-315l-240 90v207q0 7 2 18h238v316Z" />
                            </svg>
                            Bảo mật tài khoản
                        </NavLink>
                    </ul>
                );

            case 'TEACHER':
                return (
                    <ul className="flex flex-col pb-[160px] space-y-4">
                        <NavLink
                            to="/profile"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/profile' ? 'text-primary' : ''
                            }`}
                        >
                            Thông tin cá nhân
                        </NavLink>
                        <NavLink
                            to="/account-security"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/account-security' ? 'text-primary' : ''
                            }`}
                        >
                            Bảo mật tài khoản
                        </NavLink>
                        <NavLink
                            to="/children"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/children' ? 'text-primary' : ''
                            }`}
                        >
                            Thông tin lớp
                        </NavLink>
                        <NavLink
                            to="/proposal"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/proposal' ? 'text-primary' : ''
                            }`}
                        >
                            Đề xuất
                        </NavLink>
                        <NavLink
                            to="/annouce"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/annouce' ? 'text-primary' : ''
                            }`}
                        >
                            Thông báo
                        </NavLink>
                        <NavLink
                            to="/policy"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/privacy' ? 'text-primary' : ''
                            }`}
                        >
                            Chính sách
                        </NavLink>
                    </ul>
                );

            case 'STAFF':
                return (
                    <ul className="flex flex-col pb-[160px] space-y-4">
                        <NavLink
                            to="/profile"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/profile' ? 'text-primary' : ''
                            }`}
                        >
                            Thông tin cá nhân
                        </NavLink>
                        <NavLink
                            to="/account-security"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/account-security' ? 'text-primary' : ''
                            }`}
                        >
                            Bảo mật tài khoản
                        </NavLink>
                        <NavLink
                            to="/children"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/children' ? 'text-primary' : ''
                            }`}
                        >
                            Thông tin trẻ
                        </NavLink>
                        <NavLink
                            to="/proposal"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/proposal' ? 'text-primary' : ''
                            }`}
                        >
                            Đề xuất
                        </NavLink>
                        <NavLink
                            to="/annouce"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/annouce' ? 'text-primary' : ''
                            }`}
                        >
                            Thông báo
                        </NavLink>
                        <NavLink
                            to="/policy"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/privacy' ? 'text-primary' : ''
                            }`}
                        >
                            Chính sách
                        </NavLink>
                    </ul>
                );

            case 'ACCOUNTANT':
                return (
                    <ul className="flex flex-col pb-[160px] space-y-4">
                        <NavLink
                            to="/profile"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/profile' ? 'text-primary' : ''
                            }`}
                        >
                            Thông tin cá nhân
                        </NavLink>
                        <NavLink
                            to="/account-security"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/account-security' ? 'text-primary' : ''
                            }`}
                        >
                            Quản lý học phí
                        </NavLink>
                        <NavLink
                            to="/children"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/children' ? 'text-primary' : ''
                            }`}
                        >
                            Thông tin điểm danh
                        </NavLink>
                        <NavLink
                            to="/proposal"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/proposal' ? 'text-primary' : ''
                            }`}
                        >
                            Quản lý chi tiêu
                        </NavLink>
                        <NavLink
                            to="/annouce"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/annouce' ? 'text-primary' : ''
                            }`}
                        >
                            Thông báo
                        </NavLink>
                        <NavLink
                            to="/policy"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/privacy' ? 'text-primary' : ''
                            }`}
                        >
                            Chính sách
                        </NavLink>
                    </ul>
                );

            default:
                return (
                    <ul className="flex flex-col pb-[160px] space-y-4">
                        <NavLink
                            to="/profile"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/profile' ? 'text-primary' : ''
                            }`}
                        >
                            Thông tin cá nhân
                        </NavLink>
                        <NavLink
                            to="/account-security"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/account-security' ? 'text-primary' : ''
                            }`}
                        >
                            Bảo mật tài khoản
                        </NavLink>
                        <NavLink
                            to="/children"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/children' ? 'text-primary' : ''
                            }`}
                        >
                            Thông tin con
                        </NavLink>
                        <NavLink
                            to="/proposal"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/proposal' ? 'text-primary' : ''
                            }`}
                        >
                            Đề xuất của bạn
                        </NavLink>
                        <NavLink
                            to="/annouce"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/annouce' ? 'text-primary' : ''
                            }`}
                        >
                            Thông báo cho bạn
                        </NavLink>
                        <NavLink
                            to="/policy"
                            className={`block px-4 py-2 hover:bg-gray-300 ${
                                location.pathname === '/privacy' ? 'text-primary' : ''
                            }`}
                        >
                            Chính sách
                        </NavLink>
                    </ul>
                );
        }
    };

    const handleAvatarChange = async (event) => {
        const id = toast.loading('Please wait...');
        const file = event.target.files[0];

        try {
            const url = await uploadImage(file);
            console.log('url', url);
            const token = Cookies.get('jwt');
            const tokenToheader = token.replace(/^"|"$/g, '');
            const headers = {
                Authorization: `Bearer ${tokenToheader}`,
            };
            const payload = {
                avatarFileName: url,
            };
            const res = await axios({
                method: uploadProfileAvatar.method,
                url: uploadProfileAvatar.url,
                data: payload,
                withCredentials: true,
                headers: headers,
            });
            if (res.data.status === 200) {
                const existingUserInfo = Cookies.get('userInfor') ? JSON.parse(Cookies.get('userInfor')) : {};
                const updatedUserInfo = { ...existingUserInfo, avatar: url };
                updateProfile(updatedUserInfo);
                toast.update(id, {
                    render: 'Đổi ảnh đại diện thành công',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
                setIsModalOpen(false);
            } else {
                console.error('Failed to upload', res.data.message);
            }
        } catch (error) {
            toast.update(id, {
                render: `Đổi ảnh đại diện thất bại ${error.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                closeButton: true,
            });
            console.error('Error uploading avatar', error);
        }
    };

    const handleAvatarClick = () => {
        setIsModalOpen(true);
    };

    const handleViewAvatar = () => {
        setIsViewOpen(true);
        setIsModalOpen(false);
    };

    return (
        <div className="w-1/4 pt-7 relative">
            {' '}
            {isOpen && (
                <div
                    className={`fixed top-0 left-0 h-full w-[50%] z-50 bg-white shadow-md transition duration-200 ease-in-out ${
                        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-auto'
                    }`}
                    onClick={toggleSidebar}
                >
                    <div
                        className="flex flex-col h-full px-6 py-4 bg-white overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {' '}
                        <div className="flex flex-col items-center mb-8 md:flex">
                            {' '}
                            <div
                                role="button"
                                tabIndex={0}
                                className="rounded-full w-30 h-30 flex items-center justify-center text-3xl text-white cursor-pointer bg-blue-500 md:bg-transparent"
                                onClick={handleAvatarClick}
                                onKeyPress={(event) => {
                                    if (event.key === 'Enter' || event.key === ' ') {
                                        handleAvatarClick();
                                    }
                                }}
                            >
                                <img
                                    src={user.avatar || '/img/default-avt.png'}
                                    alt="User Avatar"
                                    className="rounded-full object-cover w-full h-full md:w-30 md:h-30"
                                />
                            </div>
                            <h2 className="text-xl font-semibold mt-4 md:mt-0 md:ml-4">{`${user.firstName} ${user.lastName}`}</h2>
                        </div>
                        <div className="md:block">{renderLinksBasedOnRole()}</div>{' '}
                        <Button secondary small onClick={toggleSidebar} className="mt-6 w-full text-center md:hidden">
                            {' '}
                            Đóng
                        </Button>
                    </div>
                </div>
            )}
            <button
                className={`fixed top-[150px] right-3 z-50 bg-white rounded-full shadow-md transition duration-200 ease-in-out hover:bg-gray-200 focus:outline-none focus:ring focus:ring-offset-2 focus:ring-blue-500 md:hidden ${
                    isOpen ? 'hidden' : 'block'
                }`}
                onClick={toggleSidebar}
            >
                <svg
                    className="w-6 h-6 text-blue-500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16v12H4zM4 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4z"
                    />
                </svg>
            </button>
            <div className="hidden md:flex flex-col items-center mb-8">
                <div
                    role="button"
                    tabIndex={0}
                    className="rounded-full w-30 h-30 flex items-center justify-center text-3xl text-white cursor-pointer bg-blue-500"
                    onClick={handleAvatarClick}
                    onKeyPress={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') {
                            handleAvatarClick();
                        }
                    }}
                >
                    <img
                        src={user.avatar || '/img/default-avt.png'}
                        alt="User Avatar"
                        className="rounded-full object-cover w-full h-full"
                    />
                </div>
                <h2 className="text-xl font-semibold mt-4">{`${user.firstName} ${user.lastName}`}</h2>
            </div>
            <div className="hidden md:block">{renderLinksBasedOnRole()}</div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Chọn hành động</h3>
                        <button
                            className="block w-full text-left px-4 py-2 mb-2 hover:bg-gray-200"
                            onClick={handleViewAvatar}
                        >
                            Xem ảnh đại diện
                        </button>
                        <label className="block w-full text-left px-4 py-2 mb-2 hover:bg-gray-200 cursor-pointer">
                            Thay đổi ảnh đại diện
                            <input type={'file'} accept="image/*" onChange={handleAvatarChange} className="hidden" />
                        </label>
                        <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Hủy
                        </button>
                    </div>
                </div>
            )}
            {isViewOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Ảnh đại diện của bạn</h3>
                        <img src={user.avatar} alt="Avatar View" className="w-48 h-48 rounded-full object-cover mb-4" />
                        <button
                            className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                            onClick={() => setIsViewOpen(false)}
                        >
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileSidebar;
