import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '~/config/configAxios';
import { toast } from 'react-toastify';
import Button from '~/components/Button';
// import Modal from '~/components/Modal';
import { _getUsers } from '~/api/user';
import useDebounce from '~/utils/useDebounce';
import { CircleUnlock01Icon, UnavailableIcon, ViewIcon } from 'hugeicons-react';
import Modal from '~/components/Modal';
import SelectGroup from '~/components/Selected';
import { renderEmptyRows } from '~/utils/form';
import {
    getTransportationService,
    searchTransportationService,
    updateTransportationServiceById,
} from '~/api/transportation';

function TransportationService() {
    const [transportation, setTransportation] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab') ? parseInt(queryParams.get('tab')) : 1;
    const [currentPage, setCurrentPage] = useState(tab);
    const [totalPages, setTotalPages] = useState(1);
    const selectedStatus = queryParams.get('status') ? queryParams.get('status').toUpperCase() : 'ALL';
    const debouncedValue = useDebounce(searchTerm.trim(), 500);
    const [users, setUsers] = useState([]);
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [showModal, setShowModal] = useState(false);
    const [selectedTransportation, setSelectedTransportation] = useState(null);
    const [titleModal, setTitleModal] = useState([]);
    const statusList = [
        { value: 'ALL', title: 'Tất cả' },
        { value: 'ACTIVE', title: 'Đang hoạt động' },
        { value: 'FULL', title: 'Đầy' },
        { value: 'BLOCKED', title: 'Bị khóa' },
    ];
    useEffect(() => {
        if (debouncedValue && debouncedValue.trim() !== '') {
            fetchSearchData();
        } else {
            fetchData();
        }
    }, [debouncedValue, tab, currentPage, location.pathname, sortField, sortOrder, selectedStatus]);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                let res = await axios({
                    url: _getUsers.url,
                    method: _getUsers.method,
                    params: { role: 'DRIVER' },
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
            tab: currentPage,
            limit: 5,
            sortField: sortField,
            sortOrder: sortOrder,
            condition: { status: selectedStatus.toUpperCase() },
        };
        try {
            const res = await axios({
                method: getTransportationService.method,
                url: getTransportationService.url,
                params: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                setTransportation(res.data.data.result);
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
            tab: currentPage,
            search: debouncedValue,
            limit: 4,
            sortField: sortField,
            sortOrder: sortOrder,
            condition: { status: selectedStatus.toUpperCase() },
        };

        try {
            const res = await axios({
                method: searchTransportationService.method,
                url: searchTransportationService.url,
                params: data,
                withCredentials: true,
            });

            if (mounted) {
                if (res.data.status === 200) {
                    setTransportation(res.data.data.result);
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
            navigate(`${location.pathname}?status=${selectedStatus.toLowerCase()}&tab=${newPage}`, {
                replace: true,
            });
        }
    };
    const toggleModal = () => {
        setShowModal(!showModal);
    };
    const handleOpenModal = (transportationItem, title) => {
        setTitleModal(title);
        toggleModal();
        setSelectedTransportation(transportationItem);
    };

    const handleShowAlert = async () => {
        let data = {};
        if (titleModal === 'Khóa') {
            data = {
                status: 'BLOCKED',
            };
        } else {
            if (selectedTransportation.availableSeats === 0) {
                data = {
                    status: 'FULL',
                };
            } else {
                data = {
                    status: 'ACTIVE',
                };
            }
        }
        try {
            const res = await axios({
                method: updateTransportationServiceById.method,
                url: `${updateTransportationServiceById.url}/${selectedTransportation._id}`,
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
        navigate(`/dashboards/transportation/view-list?status=${status.toLowerCase()}&tab=1`);
    };
    const handleViewDetailPage = (transportationsId) => {
        navigate(`/dashboards/transportation/view-detail-transportation?transportId=${transportationsId}`);
    };
    const filteredTransportation = Array.isArray(transportation)
        ? selectedStatus.toLocaleUpperCase() === 'ALL'
            ? transportation
            : transportation.filter((transportations) => transportations.status === selectedStatus.toLocaleUpperCase())
        : [];
    return (
        <div>
            <h1>Quản lý các xe</h1>
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
                                <th className="px-6 py-3 cursor-pointer text-center">STT</th>
                                <th className="px-6 py-3 cursor-pointer text-center" onClick={() => handleSort('name')}>
                                    Tên xe
                                    {sortField === 'name' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                </th>
                                <th className="px-6 py-3 text-center">Tài xế</th>

                                <th
                                    className="px-6 py-3 cursor-pointer text-center"
                                    onClick={() => handleSort('availableSeats')}
                                >
                                    Ghế khả dụng
                                    {sortField === 'availableSeats' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                </th>
                                <th
                                    className="px-6 py-3 cursor-pointer text-center"
                                    onClick={() => handleSort('busNumber')}
                                >
                                    Biển số xe
                                    {sortField === 'busNumber' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                </th>
                                <th
                                    className="px-6 py-3 cursor-pointer text-center"
                                    onClick={() => handleSort('status')}
                                >
                                    Trạng thái
                                    {sortField === 'status' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                </th>
                                <th className="px-6 py-3">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transportation.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center ">
                                        <div className="w-full justify-center  flex">
                                            <h1 className="text-center  ">Danh sách rỗng</h1>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransportation.map((transportations, index) => (
                                    <tr
                                        key={transportations._id}
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td className="px-6 py-4  text-center">{index + 1 + (currentPage - 1) * 5}</td>
                                        <td className="px-6 py-4  text-center text-wrap">{transportations.name}</td>
                                        <td className="px-6 py-4  text-center">
                                            {users.map((useres) => (
                                                <React.Fragment key={useres._id}>
                                                    {useres._id === transportations.driverId && (
                                                        <>
                                                            {useres.firstName} {useres.lastName}
                                                        </>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </td>
                                        <td className="px-6 py-4  text-center">
                                            {transportations.availableSeats}/{transportations.totalSeats}
                                        </td>
                                        <td className="px-6 py-4 text-center">{transportations.busNumber}</td>
                                        <td
                                            className={`px-6 py-4 text-center ${transportations.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}
                                        >
                                            {transportations.status === 'ACTIVE' ? 'Đang hoạt động' : ''}
                                            {transportations.status === 'FULL' ? 'Đã đầy' : ''}
                                            {transportations.status === 'BLOCKED' ? 'Đã bị khóa' : ''}
                                        </td>
                                        <td className="px-6 py-4 ">
                                            {transportations.status === 'BLOCKED' ? (
                                                <div className="flex items-center justify-center">
                                                    <Button
                                                        outlineInfo
                                                        icon={
                                                            <CircleUnlock01Icon
                                                                size={24}
                                                                color={'#223dec'}
                                                                variant={'stroke'}
                                                                onClick={() =>
                                                                    handleOpenModal(transportations, 'Mở khóa')
                                                                }
                                                            />
                                                        }
                                                    />
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex">
                                                        <>
                                                            <Button
                                                                outlineInfo
                                                                className={'mr-3'}
                                                                icon={
                                                                    <ViewIcon
                                                                        size={24}
                                                                        color={'#223dec'}
                                                                        variant={'stroke'}
                                                                        onClick={() =>
                                                                            handleViewDetailPage(transportations._id)
                                                                        }
                                                                    />
                                                                }
                                                            />
                                                        </>

                                                        <Button
                                                            outlineInfo
                                                            icon={
                                                                <UnavailableIcon
                                                                    size={24}
                                                                    color={'#e61010'}
                                                                    variant={'stroke'}
                                                                    onClick={() =>
                                                                        handleOpenModal(transportations, 'Khóa')
                                                                    }
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
                            {transportation.length > 0 && renderEmptyRows(5, transportation.length, 6)}
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
                                disable={currentPage === totalPages || transportation.length < 3}
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
                                    <h1 className="text-center  ">
                                        Bạn có muốn mở khóa xe {selectedTransportation?.name}
                                    </h1>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <div>
                                <div className="w-full justify-center  flex">
                                    <h1 className="text-center  ">
                                        Bạn có muốn khóa xe {selectedTransportation?.name}
                                    </h1>
                                </div>
                            </div>
                        </>
                    )}
                </Modal>
            </div>
        </div>
    );
}

export default TransportationService;
