import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import axios from '~/config/configAxios';
import Button from '~/components/Button';
import { _getUsers } from '~/api/user';
import { getAge, renderEmptyRows } from '~/utils/form';
import {
    arrangeChildTransportationService,
    getChildWaitTransportationService,
    searchChildWaitTransportationService,
} from '~/api/transportation';
import useDebounce from '~/utils/useDebounce';

function ArrangeTransportation() {
    const [childTransportation, setChildrenTransportation] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const tab = queryParams.get('tab') ? parseInt(queryParams.get('tab')) : 1;
    const [currentPage, setCurrentPage] = useState(tab);
    const [totalPages, setTotalPages] = useState(1);
    const transportId = queryParams.get('transportId');
    const [users, setUsers] = useState([]);
    const [selectedChildren, setSelectedChildren] = useState([]);
    const debouncedValue = useDebounce(searchTerm.trim(), 500);
    const initialPathname = location.pathname;
    const [isFirstLoad, setIsFirstLoad] = useState(true);
    useEffect(() => {
        const savedSelectedChildren = Cookies.get('selectedChildren');
        if (savedSelectedChildren) {
            setSelectedChildren(JSON.parse(savedSelectedChildren));
        }
    }, []);
    useEffect(() => {
        if (location.pathname !== '/arrange-transportation') {
            Cookies.remove('selectedChildren');
            setSelectedChildren([]);
        }
    }, [location.pathname]);
    useEffect(() => {
        return () => {
            if (location.pathname !== initialPathname) {
                Cookies.remove('selectedChildren');
            }
        };
    }, [location.pathname, initialPathname]);

    useEffect(() => {
        if (debouncedValue && debouncedValue.trim() !== '') {
            fetchSearchData();
        } else {
            fetchData();
        }
    }, [location.pathname, debouncedValue, transportId, tab, currentPage]);

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

    const fetchData = async () => {
        const data = {
            transportId: transportId,
            tab: currentPage,
            limit: 5,
        };
        try {
            const res = await axios({
                url: getChildWaitTransportationService.url,
                method: getChildWaitTransportationService.method,
                params: data,
                withCredentials: true,
            });

            if (res.data.status === 200) {
                setChildrenTransportation(res.data.data.result);
                if (isFirstLoad) {
                    setIsFirstLoad(false);
                }
                if (res.data.data.result.availableSeats === 0) {
                    handleBack();
                }
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
        let data = {
            transportId: transportId,
            tab: currentPage,
            limit: 5,
            condition: debouncedValue,
        };
        try {
            const res = await axios({
                method: searchChildWaitTransportationService.method,
                url: searchChildWaitTransportationService.url,
                params: data,
                withCredentials: true,
            });

            if (mounted) {
                if (res.data.status === 200) {
                    setChildrenTransportation(res.data.data.result);
                    if (isFirstLoad) {
                        setIsFirstLoad(false);
                    }
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
    const handleBack = () => {
        navigate(`/dashboards/transportation/view-detail-transportation?transportId=${transportId}`);
    };
    const handlePageChange = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            navigate(`${location.pathname}?tab=${newPage}&transportId=${transportId}`, {
                replace: true,
            });
        }
    };
    const handleCheckboxChange = (childId) => {
        setSelectedChildren((prevSelected) => {
            let updatedSelection = prevSelected.includes(childId)
                ? prevSelected.filter((id) => id !== childId)
                : [...prevSelected, childId];
            Cookies.set('selectedChildren', JSON.stringify(updatedSelection), { expires: 7 });
            return updatedSelection;
        });
    };
    const handleArrangeChild = async () => {
        try {
            const data = {
                transportId: transportId,
                selectedChildren,
            };
            if (data.selectedChildren.length == 0) {
                toast.warning('Chưa chọn trẻ.');
                return;
            }
            if (data.selectedChildren.length > childTransportation.availableSeats) {
                toast.warning('Số lượng trẻ vượt quá cho phép.');
                return;
            }
            const res = await axios({
                method: arrangeChildTransportationService.method,
                url: arrangeChildTransportationService.url,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                fetchData();
                toast.success(`Xếp trẻ vào xe thành công`, {
                    autoClose: 3000,
                    closeOnClick: true,
                });
            }
        } catch (error) {
            toast.error(`Xếp trẻ vào xe thất bại`, {
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    const handleRemoveSelectChild = async () => {
        Cookies.remove('selectedChildren');
        setSelectedChildren([]);
    };
    return (
        <div>
            <div className="flex">
                <Button text onClick={handleBack} className="text-2xl pt-0">
                    <h1 className="text-2xl font-bold mb-4 text-start text-cyan-600"> Trở về</h1>
                </Button>
                <h1 className="text-2xl font-bold mb-4 text-start">/ Xếp xe </h1>
            </div>
            <h1>Thông tin xe</h1>

            <div className="w-full">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="m-3 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-center pb-4">
                        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th className="p-3">
                                        <div className="flex items-center"></div>
                                    </th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Tên xe</th>
                                    <th className="px-6 py-3">Tài xế</th>
                                    <th className="px-6 py-3 cursor-pointer text-center"> Phí dịch vụ</th>
                                    <th className="px-6 py-4 cursor-pointer text-center">Ghế khả dụng</th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Biển số xe</th>
                                    <th className="px-6 py-3 cursor-pointer text-center">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr
                                    key={childTransportation._id}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    <td className="w-3 p-3">
                                        <div className="flex items-center"></div>
                                    </td>
                                    <td className="px-3 text-wrap text-center">{childTransportation.name}</td>
                                    <td className="px-6 py-4">
                                        {users.map((useres) => (
                                            <React.Fragment key={useres._id}>
                                                {useres._id === childTransportation.driverId && (
                                                    <>
                                                        {useres.firstName} {useres.lastName}
                                                    </>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </td>
                                    <td className="px-6 py-4 text-center">{childTransportation.tuition} </td>
                                    <td className="px-6 py-4 text-center">
                                        {childTransportation.availableSeats}/{childTransportation.totalSeats}
                                    </td>
                                    <td className="px-6 py-4 text-center">{childTransportation.busNumber}</td>
                                    <td className="px-6 py-4 text-center">{childTransportation.status} </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-between p-3">
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
                        </div>
                        <div className="m-3 flex flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4 ml-auto">
                            <Button success={true} onClick={handleArrangeChild} className="mr-3">
                                Thêm
                            </Button>
                            <Button outlineError={true} onClick={() => handleRemoveSelectChild()}>
                                Bỏ chọn tất cả
                            </Button>
                        </div>
                    </div>
                    <h2 className="p-2 text-center">Danh sách trẻ đợi xếp xe</h2>{' '}
                    <table className="w-full  min-h-100 text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3  text-center">STT</th>
                                <th className="px-6 py-3 ">Ảnh đại diện</th>
                                <th className="px-6 py-3 ">Họ</th>
                                <th className="px-6 py-3">Tên</th>
                                <th className="px-6 py-3 ">Tuổi</th>
                                <th className="px-6 py-3 ">Hồ sơ</th>
                                <th className="px-6 py-3 ">Ghi chú</th>
                                <th className="px-6 py-3 text-center">Chọn</th>
                            </tr>
                        </thead>
                        <tbody>
                            {childTransportation.children?.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center ">
                                        <div className="w-full justify-center  flex">
                                            <h1 className="text-center  ">Danh sách rỗng</h1>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                childTransportation.children?.map((child, index) => (
                                    <tr
                                        key={child._id}
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td className="px-6 py-4  text-center">{index + 1 + (currentPage - 1) * 5}</td>
                                        <td className="py-4">
                                            <div className="w-30 h-20 bg-gray-100 border border-gray-300 rounded-md">
                                                {child.avatar ? (
                                                    <img
                                                        src={child.avatar}
                                                        alt="Child"
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                                                        Không có ảnh
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-wrap">{child.firstName}</td>
                                        <td className="px-6 py-4 text-wrap">{child.lastName} </td>
                                        <td className="px-6 py-4 ">{getAge(child.dateOfBirth)}</td>
                                        <td className="px-6 py-4 ">{child.docs.length} </td>
                                        <td className="px-6 py-4 w-10 text-wrap">{child.noteByStaff} </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-center">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedChildren.includes(child._id)}
                                                    onChange={() => handleCheckboxChange(child._id)}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                            {childTransportation.children?.length > 0 &&
                                renderEmptyRows(5, childTransportation.children?.length, 7)}
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
                                disable={currentPage === totalPages || childTransportation.children?.length < 5}
                                roundedMd
                            >
                                Trang sau
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ArrangeTransportation;
