import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '~/config/configAxios';
import { toast } from 'react-toastify';
import Button from '~/components/Button';
// import Modal from '~/components/Modal';
import { getadcademy, searchAdcademy, updateAcademyById } from '~/api/academies';
import { _getUsers } from '~/api/user';
import useDebounce from '../../../utils/useDebounce';
import { CircleUnlock01Icon, UnavailableIcon, ViewIcon } from 'hugeicons-react';
import Modal from '~/components/Modal';
import SelectGroup from '~/components/Selected';
import { renderEmptyRows } from '~/utils/form';

function Academy() {
    const [academy, setAcademy] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initType = queryParams.get('type');
    const tab = queryParams.get('tab') ? parseInt(queryParams.get('tab')) : 1;
    const [currentPage, setCurrentPage] = useState(tab);
    const [totalPages, setTotalPages] = useState(1);
    const [type, setType] = useState(queryParams.get('type'));
    const selectedStatus = queryParams.get('status') ? queryParams.get('status').toUpperCase() : 'ALL';
    const debouncedValue = useDebounce(searchTerm.trim(), 500);
    const [users, setUsers] = useState([]);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showModal, setShowModal] = useState(false);
    const [selectedAcademy, setSelectedAcademy] = useState(null);
    const [titleModal, setTitleModal] = useState([]);
    const statusList = [
        { value: 'ALL', title: 'Tất cả' },
        { value: 'ACTIVE', title: 'Đang hoạt động' },
        { value: 'FULL', title: 'Đầy hoặc hết kỳ học' },
        { value: 'BLOCKED', title: 'Bị khóa' },
    ];
    useEffect(() => {
        if (!initType || (initType !== 'class' && initType !== 'skill')) {
            navigate(`${location.pathname}?type=class`, { replace: true });
        } else {
            setType(initType);
        }
    }, [location.search, navigate]);
    useEffect(() => {
        if (debouncedValue && debouncedValue.trim() !== '') {
            fetchSearchData();
        } else {
            fetchData();
        }
    }, [debouncedValue, tab, currentPage, location.pathname, type, sortField, sortOrder, selectedStatus]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                let res = await axios({
                    url: _getUsers.url,
                    method: _getUsers.method,
                    params: { role: 'TEACHER' },
                });
                if (res.data.status === 200) {
                    setUsers(res.data.data.users);
                }
            } catch (error) {
                const id = toast.loading('Làm ơn đợi...');
                toast.error(id, {
                    render: `Hiển thị thất bại`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        };
        fetchAllUsers();
    }, []);

    useEffect(() => {
        fetchSearchData();
    }, [debouncedValue]);

    const fetchData = async () => {
        const data = {
            type: type,
            tab: currentPage,
            limit: 5,
            sortField: sortField,
            sortOrder: sortOrder,
            condition: { status: selectedStatus.toUpperCase() },
        };
        try {
            const res = await axios({
                method: getadcademy.method,
                url: getadcademy.url,
                params: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                setAcademy(res.data.data.result);
                setTotalPages(res.data.data.totalPages);
                setCurrentPage(tab);
            }
        } catch (error) {
            const id = toast.loading('Làm ơn đợi...');
            toast.error(id, {
                render: `Hiển thị thất bại`,
                type: 'error',
                isLoading: false,
                autoClose: 500,
                closeOnClick: true,
                closeButton: true,
            });
        }
    };
    const fetchSearchData = async () => {
        let mounted = true;
        const data = {
            type: type,
            tab: currentPage,
            search: debouncedValue,
            limit: 5,
            sortField: sortField,
            sortOrder: sortOrder,
            condition: { status: selectedStatus.toUpperCase() },
        };

        try {
            const res = await axios({
                method: searchAdcademy.method,
                url: searchAdcademy.url,
                params: data,
                withCredentials: true,
            });

            if (mounted) {
                if (res.data.status === 200) {
                    setAcademy(res.data.data.result);
                    setTotalPages(res.data.data.totalPages);
                    setCurrentPage(tab);
                }
            }
        } catch (error) {
            const id = toast.loading('Làm ơn đợi...');
            toast.error(id, {
                render: `Hiển thị thất bại`,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                closeButton: true,
            });
        }
        return () => {
            mounted = false;
        };
    };

    const handleSort = (field) => {
        const isAsc = sortField === field && sortOrder === 'asc';
        setSortOrder(isAsc ? 'desc' : 'asc');
        setSortField(field);
    };
    const handlePageChange = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            navigate(`${location.pathname}?type=${type}&status=${selectedStatus.toLowerCase()}&tab=${newPage}`, {
                replace: true,
            });
        }
    };
    const toggleModal = () => {
        setShowModal(!showModal);
    };
    const handleOpenModal = (academyItem, title) => {
        setTitleModal(title);
        toggleModal();
        setSelectedAcademy(academyItem);
    };

    const handleShowAlert = async () => {
        let data = {};
        if (titleModal === 'Khóa') {
            data = {
                type: type,
                status: 'BLOCKED',
            };
        } else {
            if (new Date(selectedAcademy.endTime) < new Date() || selectedAcademy.availableSeats === 0) {
                data = {
                    type: type,
                    status: 'FULL',
                };
            } else {
                data = {
                    type: type,
                    status: 'ACTIVE',
                };
            }
        }
        try {
            const res = await axios({
                method: updateAcademyById.method,
                url: `${updateAcademyById.url}/${selectedAcademy._id}`,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                setCurrentPage(tab);
                toast.success(`${titleModal} thành công`, {
                    autoClose: 3000,
                    closeOnClick: true,
                });
                fetchData();
                toggleModal();
            }
        } catch (error) {
            toast.error(`${titleModal} thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    const handleStatusChange = (status) => {
        setCurrentPage(1);
        navigate(`/dashboards/academy/view-list?type=${type}&status=${status.toLowerCase()}&tab=1`);
    };
    const handleViewDetail = (academyId) => {
        navigate(`/dashboards/academy/view-detail-academy?academyId=${academyId}&type=${type}`);
    };
    const filteredAcademy = Array.isArray(academy)
        ? selectedStatus.toLocaleUpperCase() === 'ALL'
            ? academy
            : academy.filter((academyes) => academyes.status === selectedStatus.toLocaleUpperCase())
        : [];
    return (
        <div>
            <h1>Quản lý các lớp</h1>
            <div className="container">
                <div className="flex space-x-4 mb-4">
                    <Button
                        outlinePrimary={type !== 'class'}
                        primary={type === 'class'}
                        to={`${location.pathname}?type=class`}
                        roundedMd
                        target="_self"
                    >
                        Lớp học
                    </Button>
                    <Button
                        outlinePrimary={type !== 'skill'}
                        primary={type === 'skill'}
                        to={`${location.pathname}?type=skill`}
                        roundedMd
                        target="_self"
                    >
                        Lớp kĩ năng
                    </Button>
                </div>
            </div>
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
                            <label
                                htmlFor="status-filter"
                                className="block text-xl font-medium text-gray-700 mb-2 mr-3"
                            >
                                Lọc theo trạng thái:
                            </label>
                            <SelectGroup
                                id="status-filter"
                                data={statusList}
                                selectedOption={selectedStatus}
                                setSelectedOption={(e) => handleStatusChange(e)}
                                className="mb-4 text-gray-900 border border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                    <table className="w-full  min-h-100 text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="p-3">
                                    <div className="flex items-center"></div>
                                </th>
                                <th>STT</th>
                                <th className="px-6 py-3 cursor-pointer text-center" onClick={() => handleSort('name')}>
                                    Tên Lớp
                                    {sortField === 'name' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                </th>
                                <th className="px-6 py-3 text-center">Giáo viên</th>
                                <th
                                    className="px-6 py-3 cursor-pointer text-center"
                                    onClick={() => handleSort('tuition')}
                                >
                                    Học phí
                                    {sortField === 'tuition' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                </th>
                                <th
                                    className="px-6 py-3 cursor-pointer text-center"
                                    onClick={() => handleSort('availableSeats')}
                                >
                                    Số lượng khả dụng
                                    {sortField === 'availableSeats' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                </th>
                                <th
                                    className="px-6 py-3 cursor-pointer text-center"
                                    onClick={() => handleSort('startTime')}
                                >
                                    Bắt đầu lớp
                                    {sortField === 'startTime' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                </th>
                                <th
                                    className="px-6 py-3 cursor-pointer text-center"
                                    onClick={() => handleSort('endTime')}
                                >
                                    Kết thúc lớp
                                    {sortField === 'endTime' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                </th>
                                <th
                                    className="px-6 py-3 cursor-pointer text-center"
                                    onClick={() => handleSort('status')}
                                >
                                    Trạng thái
                                    {sortField === 'status' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                </th>
                                <th className="px-6 py-3 text-center">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {academy.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center ">
                                        <div className="w-full justify-center  flex">
                                            <h1 className="text-center  ">Danh sách rỗng</h1>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredAcademy.map((academies, index) => (
                                    <tr
                                        key={academies._id}
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td className="w-3 p-3">
                                            <div className="flex items-center"></div>
                                        </td>
                                        <td className="px-3 py-4  text-center">{index + 1 + (currentPage - 1) * 5}</td>
                                        <td className="px-3 py-4  text-center text-wrap">{academies.name}</td>
                                        <td className="px-6 py-4  text-center">
                                            {users.map((useres) => (
                                                <React.Fragment key={useres._id}>
                                                    {useres._id === academies.teacherId && (
                                                        <>
                                                            {useres.firstName} {useres.lastName}
                                                        </>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4 text-center">{academies.tuition} </td>
                                        <td className="px-6 py-4 text-center">
                                            {academies.availableSeats} / {academies.totalSeats}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {' '}
                                            {new Date(academies.startTime).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {' '}
                                            {new Date(academies.endTime).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
                                        </td>
                                        <td
                                            className={`px-6 py-4 text-center ${academies.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}
                                        >
                                            {academies.status === 'ACTIVE' ? 'Đang hoạt động' : ''}
                                            {academies.status === 'FULL' ? (
                                                <>
                                                    {new Date(academies.endTime) < new Date() ? 'Hết kỳ học' : 'Đã đầy'}
                                                </>
                                            ) : (
                                                ''
                                            )}
                                            {academies.status === 'BLOCKED' ? 'Đã bị khóa' : ''}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {academies.status === 'BLOCKED' ? (
                                                <div className="flex items-center justify-center">
                                                    <Button
                                                        outlineInfo
                                                        icon={
                                                            <CircleUnlock01Icon
                                                                size={24}
                                                                color={'#223dec'}
                                                                variant={'stroke'}
                                                                onClick={() => handleOpenModal(academies, 'Mở khóa')}
                                                            />
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex justify-center">
                                                        <Button
                                                            outlineInfo
                                                            className={'mr-3'}
                                                            icon={
                                                                <ViewIcon
                                                                    size={24}
                                                                    color={'#223dec'}
                                                                    variant={'stroke'}
                                                                    onClick={() => handleViewDetail(academies._id)}
                                                                />
                                                            }
                                                        />
                                                        <Button
                                                            outlineInfo
                                                            icon={
                                                                <UnavailableIcon
                                                                    size={24}
                                                                    color={'#e61010'}
                                                                    variant={'stroke'}
                                                                    onClick={() => handleOpenModal(academies, 'Khóa')}
                                                                />
                                                            }
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                            {academy.length > 0 && renderEmptyRows(5, academy.length, 9)}
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
                                disable={currentPage === totalPages || academy.length < 3}
                                roundedMd
                            >
                                Trang sau
                            </Button>
                        </div>
                    </div>
                </div>
                <Modal
                    title={`${titleModal} thông tin`}
                    _showModal={showModal}
                    onClick={toggleModal}
                    onClickAccept={handleShowAlert}
                >
                    {titleModal === 'Mở khóa' ? (
                        <>
                            <div>
                                <div className="w-full justify-center  flex">
                                    <h1 className="text-center  ">Bạn có muốn mở khóa lớp {selectedAcademy?.name}</h1>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <div className="w-full justify-center  flex">
                                    <h1 className="text-center  ">Bạn có muốn khóa lớp {selectedAcademy?.name}</h1>
                                </div>
                            </div>
                        </>
                    )}
                </Modal>
            </div>
        </div>
    );
}

export default Academy;
