import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from '~/config/configAxios';
import { toast } from 'react-toastify';
import Button from '~/components/Button';
// import Modal from '~/components/Modal';
import useDebounce from '~/utils/useDebounce';
import { ViewIcon } from 'hugeicons-react';
import SelectGroup from '~/components/Selected';
import { renderEmptyRows } from '~/utils/form';
import { getTransportationService, searchTransportationService } from '~/api/transportation';
import { useUserProvider } from '~/hooks/user/useUserProvider';

function MyTransportationService() {
    const { user } = useUserProvider();
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
    const [sortField, setSortField] = useState('');
    const [sortOrder, setSortOrder] = useState('asc');
    const [deviceSize, setDeviceSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
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
        fetchSearchData();
    }, [debouncedValue]);
    useEffect(() => {
        const handleResize = () => {
            setDeviceSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    const fetchData = async () => {
        const data = {
            tab: currentPage,
            limit: 4,
            sortField: sortField,
            sortOrder: sortOrder,
            condition: { driverId: user._id, status: selectedStatus.toUpperCase() },
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
            condition: { driverId: user._id, status: selectedStatus.toUpperCase() },
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

    const handleStatusChange = (status) => {
        setCurrentPage(1);
        navigate(`/dashboards/driver/transportation-by-driver?status=${status.toLowerCase()}&tab=1`);
    };
    const handleViewDetail = (transportationsId) => {
        navigate(`/dashboards/driver/transportation-detail-by-driver/${transportationsId}`);
    };
    const filteredTransportation = Array.isArray(transportation)
        ? selectedStatus.toLocaleUpperCase() === 'ALL'
            ? transportation
            : transportation.filter((transportations) => transportations.status === selectedStatus.toLocaleUpperCase())
        : [];
    return (
        <div>
            <h1>Quản lý các xe của tài xế</h1>
            <div className="container"></div>
            <div className="w-full">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="flex flex-wrap">
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
                            {deviceSize.width >= 500 ? (
                                <>
                                    {' '}
                                    <tr>
                                        <th className="px-6 py-3 cursor-pointer text-center">STT</th>
                                        <th
                                            className="px-6 py-3 cursor-pointer text-center"
                                            onClick={() => handleSort('name')}
                                        >
                                            Tên xe
                                            {sortField === 'name' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th
                                            className="px-6 py-3 cursor-pointer text-center"
                                            onClick={() => handleSort('tuition')}
                                        >
                                            Phí dịch vụ
                                            {sortField === 'tuition' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
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
                                        <th className="px-6 py-3 text-center">Chức năng</th>
                                    </tr>
                                </>
                            ) : (
                                <>
                                    {' '}
                                    <tr>
                                        <th className="px-2 py-3  cursor-pointer text-center">STT</th>
                                        <th
                                            className="px-2 py-3  cursor-pointer text-center"
                                            onClick={() => handleSort('name')}
                                        >
                                            Tên xe
                                            {sortField === 'name' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th
                                            className="px-2 py-3  cursor-pointer text-center"
                                            onClick={() => handleSort('busNumber')}
                                        >
                                            Biển số xe
                                            {sortField === 'busNumber' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>{' '}
                                        <th
                                            className="px-2 py-3  cursor-pointer text-center"
                                            onClick={() => handleSort('status')}
                                        >
                                            Trạng thái
                                            {sortField === 'status' && (sortOrder === 'asc' ? ' 🔼' : ' 🔽')}
                                        </th>
                                        <th className="px-2 py-3  text-center">Chức năng</th>
                                    </tr>
                                </>
                            )}
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
                                        {deviceSize.width >= 500 ? (
                                            <>
                                                {' '}
                                                <td className="px-3 py-4  text-center">
                                                    {index + 1 + (currentPage - 1) * 4}
                                                </td>
                                                <td className="px-3 py-4 text-center text-wrap">
                                                    {transportations.name}
                                                </td>
                                                <td className="px-6 py-4 text-center">{transportations.tuition} </td>
                                                <td className="px-6 py-4 text-center">
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
                                                <td className="px-6 py-4 text-center items-center">
                                                    <>
                                                        <div className="flex justify-center">
                                                            {transportations.status === 'ACTIVE' ? (
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
                                                                                    handleViewDetail(
                                                                                        transportations._id,
                                                                                    )
                                                                                }
                                                                            />
                                                                        }
                                                                    />
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                    </>
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                {' '}
                                                <td className="px-2 py-4  text-center">
                                                    {index + 1 + (currentPage - 1) * 4}
                                                </td>
                                                <td className="px-2 py-4 text-center text-wrap">
                                                    {transportations.name}
                                                </td>
                                                <td className="px-2 py-4 text-center">{transportations.busNumber}</td>
                                                <td
                                                    className={`px-2 py-4 text-center ${transportations.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'}`}
                                                >
                                                    {transportations.status === 'ACTIVE' ? 'Đang hoạt động' : ''}
                                                    {transportations.status === 'FULL' ? 'Đã đầy' : ''}
                                                    {transportations.status === 'BLOCKED' ? 'Đã bị khóa' : ''}
                                                </td>
                                                <td className="px-2 py-4 text-center items-center">
                                                    <>
                                                        <div className="flex justify-center">
                                                            {transportations.status === 'ACTIVE' ? (
                                                                <>
                                                                    <Button
                                                                        outlineInfo
                                                                        icon={
                                                                            <ViewIcon
                                                                                size={24}
                                                                                color={'#223dec'}
                                                                                variant={'stroke'}
                                                                                onClick={() =>
                                                                                    handleViewDetail(
                                                                                        transportations._id,
                                                                                    )
                                                                                }
                                                                            />
                                                                        }
                                                                    />
                                                                </>
                                                            ) : (
                                                                <></>
                                                            )}
                                                        </div>
                                                    </>
                                                </td>
                                            </>
                                        )}
                                    </tr>
                                ))
                            )}
                            {deviceSize.width >= 500
                                ? transportation.length > 0 && renderEmptyRows(4, transportation.length, 6)
                                : transportation.length > 0 && renderEmptyRows(4, transportation.length, 4)}
                        </tbody>
                    </table>
                    {deviceSize.width >= 500 ? (
                        <>
                            {' '}
                            <div className="justify-center flex mb-4">
                                <div className="flex justify-between mt-4 w-122 items-center gap-2">
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
                        </>
                    ) : (
                        <>
                            <div className="justify-center flex mb-4">
                                <div className="flex justify-between mt-4 items-center gap-1">
                                    <Button
                                        primary
                                        className=" text-[12px]"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disable={currentPage === 1}
                                        roundedMd
                                    >
                                        Trang trước
                                    </Button>
                                    <span>Trang {currentPage}</span>
                                    <Button
                                        primary
                                        className=" text-[12px]"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disable={currentPage === totalPages || transportation.length < 3}
                                        roundedMd
                                    >
                                        Trang sau
                                    </Button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MyTransportationService;
