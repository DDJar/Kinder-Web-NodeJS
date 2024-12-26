import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { PencilEdit02Icon, UserLock01Icon, UserUnlock01Icon } from 'hugeicons-react';
import Button from '~/components/Button';
import axios from '~/config/configAxios';
import { getUsers, updateUsers, searchUsers, lockUsers } from '~/api/user';
import { toast } from 'react-toastify';
import Modal from '~/components/Modal';
import SelectGroup from '~/components/Selected';
import useDebounce from '~/utils/useDebounce';
import { renderEmptyRows } from '~/utils/form';
const UserPage = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const roleQuery = queryParams.get('role') ? queryParams.get('role') : 'all';
    const role = roleQuery.toUpperCase();
    const tab = queryParams.get('tab') ? parseInt(queryParams.get('tab')) : 1;
    const [currentPage, setCurrentPage] = useState(tab);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const debouncedValue = useDebounce(searchTerm.trim(), 500);
    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        phone: '',
    });
    const roleTab = [
        { value: 'ALL', title: 'Tất cả' },
        { value: 'ADMIN', title: 'ADMIN' },
        { value: 'STAFF', title: 'Nhân viên' },
        { value: 'ACCOUNTANT', title: 'Kế toán' },
        { value: 'TEACHER', title: 'Giáo viên' },
        { value: 'DRIVER', title: 'Tài xế' },
        { value: 'USER', title: 'Người dùng' },
        { value: 'BLOCK', title: 'Bị khóa' },
    ];
    const roleList = [
        { value: 'ADMIN', title: 'ADMIN' },
        { value: 'STAFF', title: 'Nhân viên' },
        { value: 'ACCOUNTANT', title: 'Kế toán' },
        { value: 'TEACHER', title: 'Giáo viên' },
        { value: 'DRIVER', title: 'Tài xế' },
        { value: 'USER', title: 'Người dùng' },
    ];
    const roleTitles = {
        ADMIN: 'ADMIN',
        STAFF: 'Nhân viên',
        ACCOUNTANT: 'Kế toán',
        TEACHER: 'Giáo viên',
        DRIVER: 'Tài xế',
        USER: 'Người dùng',
        BLOCK: 'Bị khóa',
    };
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        if (debouncedValue && debouncedValue.trim() !== '') {
            fetchSearchData();
        } else {
            fetchData();
        }
    }, [debouncedValue, role, tab, currentPage, location.pathname]);
    useEffect(() => {
        if (selectedUser) {
            setSelectedRole(selectedUser.role);
        }
    }, [selectedUser]);
    useEffect(() => {
        fetchSearchData();
    }, [debouncedValue]);

    const fetchData = async () => {
        const data = {
            role: role,
            tab: currentPage,
        };
        try {
            const res = await axios({
                method: getUsers.method,
                url: getUsers.url,
                params: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                setUsers(res.data.data.users);
                setTotalPages(res.data.data.totalPages);
                setCurrentPage(tab);
            }
        } catch (error) {
            toast.error(`Hiển thị thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    const fetchSearchData = async () => {
        let mounted = true;
        const data = {
            role: role,
            tab: currentPage,
            search: debouncedValue,
        };
        try {
            const res = await axios({
                method: searchUsers.method,
                url: searchUsers.url,
                params: data,
                withCredentials: true,
            });

            if (mounted) {
                if (res.data.status === 200) {
                    setUsers(res.data.data.users);
                    setTotalPages(res.data.data.totalPages);
                    setCurrentPage(tab);
                } else {
                    console.error('error');
                }
            }
        } catch (error) {
            toast.error(`Hiển thị thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
        return () => {
            mounted = false;
        };
    };

    const filteredUsers = Array.isArray(users)
        ? role === 'ALL'
            ? users
            : users.filter((user) => user.role === role)
        : [];

    const validation = (value) => {
        return (
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
            /^(09|03|07|08|05)\d{8}$/.test(value) ||
            /^[A-Za-zÀÁÂÃÈÉÊÌÍÎÏÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíîïòóôõùúăđĩũơƯĂẠ-ỹ\s'-]+$/i.test(value)
        );
    };
    const validationPhone = (value) => {
        return /^(09|03|07|08|05)\d{8}$/.test(value);
    };
    const handleInputChange = (field, value) => {
        setSelectedUser({ ...selectedUser, [field]: value });
        switch (field) {
            case 'firstName':
                setErrors({
                    ...errors,
                    firstName: validation(value) ? '' : 'Họ không được để trống hoặc có kí tự đặc biệt!',
                });
                break;
            case 'lastName':
                setErrors({
                    ...errors,
                    lastName: validation(value) ? '' : 'Tên không được để trống hoặc có kí tự đặc biệt!',
                });
                break;
            case 'username':
                setErrors({
                    ...errors,
                    username: value ? '' : 'Tên người dùng không được để trống!',
                });
                break;
            case 'email':
                setErrors({
                    ...errors,
                    email: validation(value) || selectedUser.email ? '' : 'Email không hợp lệ!',
                });
                break;

            case 'phone':
                setErrors({
                    ...errors,
                    phone:
                        value.length < 10 || !validationPhone(value) || !selectedUser.phone
                            ? 'Số điện thoại không hợp lệ! (Phải có đủ 10 chữ số)'
                            : '',
                });
                break;

            default:
                break;
        }
    };
    const handlePageChange = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            navigate(`/dashboards/users/view-list?role=${role.toLowerCase()}&tab=${newPage}`);
        }
    };

    const toggleModal = () => {
        setShowModal(!showModal);
        setErrors('');
    };
    const handleShowAlert = async () => {
        const hasErrors = Object.values(errors).some((error) => error !== '');
        const isMissingDetail =
            !selectedUser.firstName ||
            !selectedUser.lastName ||
            !selectedUser.username ||
            !selectedUser.email ||
            !selectedUser.phone;
        if (hasErrors || isMissingDetail) {
            toast.warning('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        try {
            const data = {
                lastName: selectedUser.lastName,
                firstName: selectedUser.firstName,
                email: selectedUser.email,
                username: selectedUser.username,
                phone: selectedUser.phone,
                role: selectedRole,
            };
            const res = await axios({
                method: updateUsers.method,
                url: `${updateUsers.url}/${selectedUser._id}`,
                data: data,
                withCredentials: true,
            });
            console.log(res.data);
            if (res.data.status === 200) {
                setCurrentPage(tab);
                toast.success('Cập nhật thành công', {
                    autoClose: 3000,
                    closeOnClick: true,
                });
                fetchData();
                toggleModal();
                setSelectedRole('');
            } else if (res.data.status === 400 && res.data.message === 'Duplicate username') {
                toast.warning('Tên người dùng đã tồn tại.Vui lòng chọn tên khác');
            } else if (res.data.status === 400 && res.data.message === 'Duplicate email.') {
                toast.warning('Email đã tồn tại.Vui lòng chọn email.');
            } else if (res.data.status === 400 && res.data.message === 'Duplicate phone.') {
                toast.warning('Số điện thoại đã tồn tại.Vui lòng chọn số khác.');
            }
        } catch (error) {
            toast.error(`Cập nhật thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    const handleOpenModal = (userItem) => {
        toggleModal();
        setSelectedUser(userItem);
    };
    const handleRoleChange = (role) => {
        setCurrentPage(1);
        navigate(`/dashboards/users/view-list?role=${role.toLowerCase()}&tab=1`);
    };
    const handlockUser = async (value, title, _id) => {
        try {
            const data = {
                role: value,
            };
            const res = await axios({
                method: lockUsers.method,
                url: `${lockUsers.url}/${_id}`,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                setCurrentPage(tab);
                toast.success(`${title} thành công`, {
                    autoClose: 3000,
                    closeOnClick: true,
                });
                fetchData();
            }
            setSelectedRole('');
        } catch (error) {
            toast.error(`${title} thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    return (
        <div>
            <h1>Quản lý người dùng</h1>
            <div className="container"></div>
            <div className="w-full">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="flex">
                        <div className="m-3 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4">
                            <label htmlFor="table-search" className="sr-only">
                                Tìm kiếm
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 flex items-center ps-3 pointer-events-none">
                                    <svg
                                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                                        aria-hidden="true"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    id="table-search"
                                    className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Nhập vào ô tìm kiếm..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="m-3 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4 ml-auto">
                            <label htmlFor="role-filter" className="block text-xl font-medium text-gray-700 mb-2 mr-3">
                                Lọc theo chức vụ:
                            </label>
                            <SelectGroup
                                id="role-filter"
                                data={roleTab}
                                selectedOption={role}
                                setSelectedOption={(e) => handleRoleChange(e)}
                                className="mb-4 text-gray-900 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>

                    <table className="w-full  min-h-100 text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3 text-center">STT</th>
                                <th className="px-6 py-3 ">Họ</th>
                                <th className="px-6 py-3">Tên</th>
                                <th className="px-6 py-3">Tên người dùng</th>
                                <th className="px-6 py-3">Email</th>
                                <th className="px-6 py-3">Số điện thoại</th>
                                <th className="px-6 py-3">Vai trò </th>
                                <th className="px-6 py-3">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center ">
                                        <div className="w-full justify-center  flex">
                                            <h1 className="text-center  ">Danh sách rỗng</h1>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user, index) => (
                                    <tr
                                        key={user._id}
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td className="px-6 py-4  text-center">{index + 1 + (currentPage - 1) * 5}</td>
                                        <td className="px-6 py-4 text-wrap">{user.firstName}</td>
                                        <td className="px-6 py-4">{user.lastName}</td>
                                        <td className="px-6 py-4">{user.username}</td>
                                        <td className="px-6 py-4">{user.email}</td>
                                        <td className="px-6 py-4">{user.phone}</td>
                                        <td
                                            className={`px-6 py-4 w-[130px]  ${user.role === 'BLOCK' ? 'text-red-500' : 'text-green-500'}`}
                                        >
                                            {roleTitles[user.role] || 'Không xác định'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex">
                                                {user.role == 'BLOCK' ? (
                                                    <>
                                                        <Button
                                                            outlineInfo
                                                            icon={
                                                                <UserUnlock01Icon
                                                                    size={24}
                                                                    color={'#e61010'}
                                                                    variant={'stroke'}
                                                                    onClick={() =>
                                                                        handlockUser('USER', 'Mở khóa', user._id)
                                                                    }
                                                                />
                                                            }
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <Button
                                                            outlineInfo
                                                            className={'mr-3'}
                                                            icon={
                                                                <PencilEdit02Icon
                                                                    size={24}
                                                                    color={'#223dec'}
                                                                    variant={'stroke'}
                                                                    onClick={() => handleOpenModal(user)}
                                                                />
                                                            }
                                                        />
                                                        <Button
                                                            outlineInfo
                                                            icon={
                                                                <UserLock01Icon
                                                                    size={24}
                                                                    color={'#e61010'}
                                                                    variant={'stroke'}
                                                                    onClick={() =>
                                                                        handlockUser('BLOCK', 'Khóa', user._id)
                                                                    }
                                                                />
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {users.length > 0 && renderEmptyRows(5, filteredUsers.length, 7)}
                        </tbody>
                    </table>
                    <div className="justify-center flex mb-4">
                        <div className="flex justify-between mt-4 w-122 items-center">
                            <Button
                                primary
                                onClick={() => handlePageChange(currentPage - 1)}
                                disable={currentPage === 1}
                                roundedMd
                            >
                                Trang trước
                            </Button>
                            <span>Trang {currentPage}</span>
                            <Button
                                primary
                                onClick={() => handlePageChange(currentPage + 1)}
                                disable={currentPage === totalPages || filteredUsers.length < 3}
                                roundedMd
                            >
                                Trang sau
                            </Button>
                        </div>
                    </div>
                </div>

                <Modal
                    title={'Cập nhật thông tin người dùng'}
                    _showModal={showModal}
                    onClick={toggleModal}
                    onClickAccept={handleShowAlert}
                >
                    {selectedUser ? (
                        <form>
                            <div className="grid gap-2">
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Họ:</p>
                                    <div className="grid ">
                                        <input
                                            type="text"
                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                            value={selectedUser.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                        />
                                        <span className=" left-0 top-full text-red-500 text-xs">
                                            {errors.firstName}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Tên:</p>
                                    <div className="grid">
                                        <input
                                            type="text"
                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded "
                                            value={selectedUser.lastName}
                                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        />
                                        <span className="text-center left-0 top-full text-red-500 text-xs">
                                            {errors.lastName}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Tên người dùng:</p>
                                    <div className="grid">
                                        <input
                                            type="text"
                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                            value={selectedUser.username}
                                            onChange={(e) => handleInputChange('username', e.target.value)}
                                        />
                                        <span className="text-center left-0 top-full text-red-500 text-xs">
                                            {errors.username}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Email:</p>
                                    <div className="grid">
                                        <input
                                            type="email"
                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                            value={selectedUser.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                        />
                                        <span className=" left-0 text-center top-full text-red-500 text-xs">
                                            {errors.email}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Số điện thoại:</p>
                                    <div className="grid">
                                        <input
                                            type="tel"
                                            className="mb-0 w-60 text-center pt-2 border border-gray-600 rounded"
                                            value={selectedUser.phone}
                                            onChange={(e) => handleInputChange('phone', e.target.value.trim())}
                                        />
                                        <span className="text-center left-0 top-full text-red-500 text-xs">
                                            {errors.phone}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex">
                                    <p className="mb-0 pt-2 w-80">Vai trò:</p>
                                    <div className="w-[240px] items-center border border-gray-600 rounded">
                                        <SelectGroup
                                            data={roleList}
                                            selectedOption={selectedRole}
                                            setSelectedOption={setSelectedRole}
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    ) : (
                        <></>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default UserPage;
