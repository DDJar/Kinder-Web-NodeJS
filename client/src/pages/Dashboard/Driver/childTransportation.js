import React, { useEffect, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import axios from '~/config/configAxios';
import { useLocation, useParams } from 'react-router-dom';
import Button from '~/components/Button';
import { Home01Icon } from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    checkInTransportationChild,
    checkOutTransportationChild,
    getChildrenByTransportId,
} from '~/api/transportation';
import socketMessages from '~/config/configSocketEmit';
import { socket } from '~/services/socket';
import CameraModal from '~/pages/Employee/CameraModal';
import { uploadImage } from '~/utils/uploadFile/uploadImage';
import DriverMap from '~/pages/Dashboard/Driver/DriverMap';

const TransportationDetails = () => {
    const { transportId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const attendanceType = queryParams.get('type') ? queryParams.get('type').toUpperCase() : 'FIRST';
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const today = new Date();
    const formattedToday = format(today, 'yyyy-MM-dd', { locale: vi });
    const [selectDate, setSelectDate] = useState(formattedToday);
    const dateObject = new Date(selectDate);
    const displayDate = format(dateObject, "'ngày' dd 'tháng' MM 'năm' yyyy", { locale: vi });
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [photoCaptured, setPhotoCaptured] = useState({});
    const [deviceSize, setDeviceSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const handleAttendanceTypeChange = (e) => {
        navigate(
            `/dashboards/driver/transportation-detail-by-driver/${transportId}?type=${e.target.value.toLowerCase()}`,
        );
    };
    const isToday = (date) => {
        const today = new Date();
        return isSameDay(new Date(date), today);
    };
    const filteredChildren = Array.isArray(children)
        ? children.filter(
              (child) =>
                  (child && child?.firstName && child?.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                  (child?.lastName && child?.lastName.toLowerCase().includes(searchTerm.toLowerCase())),
          )
        : [];
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
    useEffect(() => {
        if (transportId) {
            fetchChildrenByTransport(transportId);
        }
    }, [transportId, selectDate, attendanceType]);
    useEffect(() => {
        let setTimeOutId = null;
        socket.emit(socketMessages.ATTENDANCE_JOIN_ROOM, 'attendanceTransport-123');
        socket.on(socketMessages.ATTENDANCE, (data) => {
            if (data.data.code === '00') {
                const isChildInFilteredChildren = filteredChildren.some(
                    (child) => child._id === data.data.data.childId,
                );
                if (isChildInFilteredChildren) {
                    setTimeOutId = setTimeout(() => {
                        fetchChildrenByTransport(transportId);
                    }, 1000);
                }
            }
        });
        return () => {
            clearTimeout(setTimeOutId);
            socket.emit(socketMessages.ATTENDANCE_LEAVE_ROOM, 'attendanceTransport-123');
            socket.off(socketMessages.ATTENDANCE);
        };
    }, [transportId, filteredChildren]);
    const fetchChildrenByTransport = async (transportId) => {
        try {
            const response = await axios({
                url: getChildrenByTransportId.url,
                method: getChildrenByTransportId.method,
                params: {
                    transportId: transportId,
                    attendDay: dateObject.getDate(),
                    attendMonth: dateObject.getMonth() + 1,
                    attendYear: dateObject.getFullYear(),
                    type: attendanceType,
                },
            });

            setChildren(response.data.data);
            setLoading(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setError('Không có học sinh trong xe này.');
                } else {
                    setError(error.response.data.message || 'Đã xảy ra lỗi');
                }
            } else {
                setError(error.message || 'Đã xảy ra lỗi không xác định');
            }
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    const handleBack = () => {
        navigate(`/dashboards/driver/transportation-by-driver`);
    };
    const handleCheckIn = async (childId, isCheckIn) => {
        const data = {
            transportId: transportId,
            childId: childId,
            isCheckIn: isCheckIn,
            type: attendanceType,
        };
        let title = '';
        if (isCheckIn) {
            title = 'Trẻ lên xe';
            data.isUse = 'YES';
        } else {
            title = 'Hủy trẻ lên xe';
            data.isUse = '';
        }
        try {
            const res = await axios({
                method: checkInTransportationChild.method,
                url: checkInTransportationChild.url,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                fetchChildrenByTransport(transportId);
            }
        } catch (error) {
            toast.error(`${title} thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    const handleCheckInParent = async (childId, isCheckIn, isUse) => {
        const data = {
            transportId: transportId,
            childId: childId,
            isCheckIn: isCheckIn,
            type: attendanceType,
            isUse: isUse,
        };
        let title = '';
        if (isUse === 'NO') {
            title = 'Xác nhận phụ huynh chở';
        } else {
            title = 'Hủy xác nhận phụ huynh chở';
        }
        try {
            const res = await axios({
                method: checkInTransportationChild.method,
                url: checkInTransportationChild.url,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                fetchChildrenByTransport(transportId);
            }
        } catch (error) {
            toast.error(`${title} thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    const handleCapturePhoto = (childId) => {
        setSelectedChildId(childId);
        setShowCameraModal(true);
    };
    const handleConfirm = async (imageUrl) => {
        try {
            const imgUrl = await uploadImage(imageUrl);
            setPhotoCaptured((prev) => ({
                ...prev,
                [selectedChildId]: {
                    imageUrl: imgUrl,
                    isCaptured: true,
                },
            }));
            setShowCameraModal(false);
        } catch (error) {
            console.error('Lỗi khi lưu ảnh:', error);
        }
    };
    const handleCheckOut = async (childId, isCheckOut) => {
        const childData = photoCaptured[childId] || {};
        const data = {
            transportId: transportId,
            childId: childId,
            isCheckOut: isCheckOut,
            type: attendanceType,
        };
        let title = '';
        if (isCheckOut) {
            title = 'Trẻ xuống xe';
            data.isUse = 'YES';
            data.receiverUrl = childData.imageUrl || '';
        } else {
            title = 'Hủy trẻ xuống xe';
            data.isUse = '';
            data.receiverUrl = '';
        }
        try {
            const res = await axios({
                method: checkOutTransportationChild.method,
                url: checkOutTransportationChild.url,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                setPhotoCaptured((prev) => {
                    const updated = { ...prev };
                    delete updated[childId];
                    return updated;
                });
                fetchChildrenByTransport(transportId);
            }
        } catch (error) {
            toast.error(`${title} thất bại`, {
                render: `${error.message}`,
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };
    const handleDateChange = (e) => {
        setSelectDate(e.target.value);
    };
    return (
        <div>
            <h2 className="text-center pt-12">Danh sách học sinh của xe ngày {displayDate}</h2>
            <div className="flex justify-between items-center">
                <Button
                    icon={<Home01Icon />}
                    onClick={handleBack}
                    className="bg-primary text-white hover:bg-opacity-80 mt-4 mb-5"
                >
                    Quay lại
                </Button>
                <DriverMap />
            </div>

            <div className="container">
                <div className="w-full">
                    <div className="overflow-x-auto shadow-md sm:rounded-lg">
                        <div className="py-4 flex text-left flex-wrap">
                            <div className=" ">
                                <input
                                    type="search"
                                    placeholder="Tìm kiếm..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="p-2 w-full max-w-xs border-2 border-blue-500 rounded outline-none text-lg transition duration-300 focus:border-blue-700"
                                />
                            </div>
                            <div className="flex flex-col items-center gap-4 ml-auto flex-wrap">
                                <div className="flex items-center flex-wrap">
                                    <label htmlFor="attendance-date" className="mr-2">
                                        Chọn ngày điểm danh:
                                    </label>
                                    <input
                                        className="text-gray-900 border border-gray-300 rounded-lg"
                                        id="attendance-date"
                                        type="date"
                                        max={formattedToday}
                                        value={selectDate}
                                        onChange={handleDateChange}
                                    />
                                </div>
                                <div className="flex justify-between ">
                                    <label className="flex items-center mr-2">
                                        <input
                                            type="radio"
                                            value="FIRST"
                                            checked={attendanceType === 'FIRST'}
                                            onChange={handleAttendanceTypeChange}
                                            className="mr-2"
                                        />
                                        Lượt đi
                                    </label>
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            value="SECOND"
                                            checked={attendanceType === 'SECOND'}
                                            onChange={handleAttendanceTypeChange}
                                            className="mr-2"
                                        />
                                        Lượt về
                                    </label>
                                </div>
                            </div>
                        </div>
                        {filteredChildren.length === 0 ? (
                            <p className="text-center mt-4">Không có học sinh nào trong xe này.</p>
                        ) : (
                            <table className="w-full  min-h-100 text-sm text-left text-gray-500 dark:text-gray-400">
                                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    {deviceSize.width >= 500 ? (
                                        <>
                                            {' '}
                                            <tr>
                                                <th className=" px-6 py-3 text-center">STT</th>
                                                <th className=" px-6 py-3 text-center">Ảnh</th>
                                                <th className="px-6 py-3 text-center">Họ và tên</th>
                                                <th className="px-6 py-3 text-center">Phụ huynh</th>
                                                <th className="px-6 py-3 text-center">Số điện thoại</th>
                                                <th className=" px-6 py-3 text-center">Địa chỉ</th>
                                                <th className="px-6 py-3 text-center">Điểm danh</th>
                                            </tr>
                                        </>
                                    ) : (
                                        <>
                                            <tr>
                                                <th className="px-2 py-3 text-center">STT</th>
                                                <th className="px-2 py-3 text-center">Thông tin trẻ</th>
                                                <th className="px-2 py-3 text-center">Thông tin phụ huynh</th>
                                                <th className="px-2 py-3 text-center">Điểm danh</th>
                                            </tr>
                                        </>
                                    )}
                                </thead>
                                <tbody>
                                    {filteredChildren.map((child, index) => (
                                        <tr
                                            key={child._id}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        >
                                            {deviceSize.width >= 500 ? (
                                                <>
                                                    <td className="w-3 p-3 text-center">{index + 1}</td>
                                                    <td className="p-2">
                                                        {child.avatar ? (
                                                            <img
                                                                className="w-36 h-36 object-cover mx-auto mt-1"
                                                                src={child.avatar}
                                                                alt={`${child.firstName} ${child.lastName}`}
                                                            />
                                                        ) : (
                                                            <img
                                                                src="/img/default-avt.png"
                                                                className="w-36 h-36 object-cover mx-auto mt-1"
                                                                alt="User Avt"
                                                            />
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 text-center">
                                                        {child.firstName} {child.lastName}
                                                    </td>
                                                    <td className="px-6 py-4 border-b border-gray-300 text-center md:text-center">
                                                        {child.parentName}
                                                    </td>
                                                    <td className="px-6 py-4border-b border-gray-300 text-center md:text-center">
                                                        {child.phoneNumber}
                                                    </td>
                                                    <td className="px-6 py-4 flex-wrap md:table-cell  border-b border-gray-300 text-center">
                                                        {child.address ? child.address : 'Chưa có thông tin'}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-center space-x-2 w-[13rem]">
                                                            {isToday(selectDate) ? (
                                                                attendanceType === 'FIRST' ? (
                                                                    <>
                                                                        {child.attendance.first.isCheckIn === false &&
                                                                        child.attendance.first.isUse === '' &&
                                                                        child.attendance.class.isCheckIn === false ? (
                                                                            <div className="flex items-center justify-center flex-wrap gap-2 ">
                                                                                <Button
                                                                                    success
                                                                                    onClick={() =>
                                                                                        handleCheckIn(child._id, true)
                                                                                    }
                                                                                >
                                                                                    Lên xe
                                                                                </Button>
                                                                                <Button
                                                                                    info
                                                                                    onClick={() =>
                                                                                        handleCheckInParent(
                                                                                            child._id,
                                                                                            false,
                                                                                            'NO',
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Phụ huynh
                                                                                </Button>
                                                                            </div>
                                                                        ) : null}
                                                                        {child.attendance.first.isUse === 'NO' &&
                                                                        child.attendance.class.isCheckIn === false ? (
                                                                            <div className="flex items-center justify-center flex-wrap gap-2 ">
                                                                                <Button
                                                                                    error
                                                                                    onClick={() =>
                                                                                        handleCheckInParent(
                                                                                            child._id,
                                                                                            false,
                                                                                            '',
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Hủy phụ huynh đưa
                                                                                </Button>
                                                                            </div>
                                                                        ) : null}

                                                                        {child.attendance.first.isCheckIn === true &&
                                                                        child.attendance.first.isCheckOut === false ? (
                                                                            <div className="flex items-center justify-center flex-wrap gap-2 ">
                                                                                <Button
                                                                                    info
                                                                                    onClick={() =>
                                                                                        handleCheckOut(child._id, true)
                                                                                    }
                                                                                >
                                                                                    Xuống xe
                                                                                </Button>
                                                                                <Button
                                                                                    error
                                                                                    onClick={() =>
                                                                                        handleCheckIn(child._id, false)
                                                                                    }
                                                                                >
                                                                                    Hủy lên xe
                                                                                </Button>
                                                                            </div>
                                                                        ) : null}
                                                                        {child.attendance.class.isCheckIn === true ? (
                                                                            <div>
                                                                                {child.attendance.first.isUse ===
                                                                                    'NO' &&
                                                                                child.attendance.class.isCheckIn ===
                                                                                    true ? (
                                                                                    <Button disabled>
                                                                                        Trẻ đã được phụ huynh đưa tới
                                                                                        trường.
                                                                                    </Button>
                                                                                ) : (
                                                                                    <Button disabled>
                                                                                        Không thể cập nhật khi giáo viên
                                                                                        đã nhận.
                                                                                    </Button>
                                                                                )}
                                                                            </div>
                                                                        ) : child.attendance.first.isCheckOut ===
                                                                          true ? (
                                                                            <Button
                                                                                error
                                                                                onClick={() =>
                                                                                    handleCheckOut(child._id, false)
                                                                                }
                                                                            >
                                                                                Hủy xuống xe
                                                                            </Button>
                                                                        ) : null}
                                                                    </>
                                                                ) : attendanceType === 'SECOND' &&
                                                                  child.attendance.class.isCheckOut === true &&
                                                                  child.attendance.class.receiver === 'DRIVER' ? (
                                                                    <>
                                                                        {child.attendance.second.isCheckIn === false ? (
                                                                            <div className="flex items-center justify-center flex-wrap gap-2">
                                                                                <Button
                                                                                    success
                                                                                    onClick={() =>
                                                                                        handleCheckIn(child._id, true)
                                                                                    }
                                                                                >
                                                                                    Lên xe về
                                                                                </Button>
                                                                            </div>
                                                                        ) : null}
                                                                        {child.attendance.second.isCheckIn === true &&
                                                                        child.attendance.second.isCheckOut === false ? (
                                                                            <div className="flex items-center justify-center flex-wrap gap-2 ">
                                                                                {!photoCaptured[child._id] && (
                                                                                    <>
                                                                                        <Button
                                                                                            info
                                                                                            onClick={() =>
                                                                                                handleCapturePhoto(
                                                                                                    child._id,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Chụp vị trí xuống xe
                                                                                        </Button>
                                                                                    </>
                                                                                )}
                                                                                {photoCaptured[child._id] && (
                                                                                    <>
                                                                                        <Button
                                                                                            info
                                                                                            onClick={() =>
                                                                                                handleCheckOut(
                                                                                                    child._id,
                                                                                                    true,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Xuống xe
                                                                                        </Button>
                                                                                    </>
                                                                                )}

                                                                                <Button
                                                                                    error
                                                                                    onClick={() =>
                                                                                        handleCheckIn(child._id, false)
                                                                                    }
                                                                                >
                                                                                    Hủy lên xe
                                                                                </Button>
                                                                            </div>
                                                                        ) : null}
                                                                        {child.attendance.second.isCheckOut === true ? (
                                                                            <Button
                                                                                error
                                                                                onClick={() =>
                                                                                    handleCheckOut(child._id, false)
                                                                                }
                                                                            >
                                                                                Hủy xuống xe
                                                                            </Button>
                                                                        ) : null}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {child.attendance.class.receiver === 'USER' &&
                                                                        child.attendance.class.isCheckOut === true ? (
                                                                            <Button disabled>
                                                                                Trẻ đã được phụ huynh đón tại trường
                                                                            </Button>
                                                                        ) : (
                                                                            <Button disabled>
                                                                                Trẻ chưa được giáo viên trả lại xe
                                                                            </Button>
                                                                        )}
                                                                    </>
                                                                )
                                                            ) : (
                                                                <>
                                                                    {attendanceType === 'FIRST' ? (
                                                                        <>
                                                                            {child.attendance.first.isCheckIn ===
                                                                                true &&
                                                                            child.attendance.first.isCheckOut ===
                                                                                true ? (
                                                                                <>
                                                                                    <Button success disable>
                                                                                        Đã đi
                                                                                    </Button>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Button
                                                                                        error
                                                                                        className={'w-35'}
                                                                                        disable
                                                                                    >
                                                                                        Không đi
                                                                                    </Button>
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {child.attendance.second.isCheckIn ===
                                                                                true &&
                                                                            child.attendance.second.isCheckOut ===
                                                                                true ? (
                                                                                <>
                                                                                    <Button success disable>
                                                                                        Đã đi
                                                                                    </Button>
                                                                                </>
                                                                            ) : (
                                                                                <div>
                                                                                    <Button
                                                                                        error
                                                                                        className={'w-35'}
                                                                                        disable
                                                                                    >
                                                                                        Không đi
                                                                                    </Button>
                                                                                </div>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className=" p-3 text-center">{index + 1}</td>
                                                    <td className="p-2">
                                                        {child.avatar ? (
                                                            <img
                                                                className="w-10 h-10 object-cover mx-auto mt-1"
                                                                src={child.avatar}
                                                                alt={`${child.firstName} ${child.lastName}`}
                                                            />
                                                        ) : (
                                                            <img
                                                                src="/img/default-avt.png"
                                                                className="w-10 h-10 object-cover mx-auto mt-1"
                                                                alt="User Avt"
                                                            />
                                                        )}
                                                        <br />
                                                        <p className="text-[12px]">
                                                            {child.firstName} {child.lastName}
                                                        </p>
                                                    </td>

                                                    <td className="px-2 py-2 border-b border-gray-300 text-left ">
                                                        <p className="text-[12px]">
                                                            <span className="font-bold">Họ và tên:</span>
                                                            {child.parentName}
                                                        </p>
                                                        <p className="text-[12px]">
                                                            {' '}
                                                            <span className="font-bold">Sđt:</span> {child.phoneNumber}
                                                        </p>
                                                        <p className="text-[12px]">
                                                            <span className="font-bold"> Địa chỉ:</span>
                                                            {child.address ? child.address : 'Chưa có thông tin'}
                                                        </p>
                                                    </td>
                                                    <td className="px-2 py-4">
                                                        <div className="flex items-center justify-center space-x-2 w-[6rem]">
                                                            {isToday(selectDate) ? (
                                                                attendanceType === 'FIRST' ? (
                                                                    <>
                                                                        {child.attendance.first.isCheckIn === false &&
                                                                        child.attendance.first.isUse === '' &&
                                                                        child.attendance.class.isCheckIn === false ? (
                                                                            <div className="flex items-center justify-center flex-wrap gap-2 ">
                                                                                <Button
                                                                                    success
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    onClick={() =>
                                                                                        handleCheckIn(child._id, true)
                                                                                    }
                                                                                >
                                                                                    Lên xe
                                                                                </Button>
                                                                                <Button
                                                                                    info
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    onClick={() =>
                                                                                        handleCheckInParent(
                                                                                            child._id,
                                                                                            false,
                                                                                            'NO',
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Phụ huynh
                                                                                </Button>
                                                                            </div>
                                                                        ) : null}
                                                                        {child.attendance.first.isUse === 'NO' &&
                                                                        child.attendance.class.isCheckIn === false ? (
                                                                            <div className="flex items-center justify-center flex-wrap gap-2 ">
                                                                                <Button
                                                                                    error
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    onClick={() =>
                                                                                        handleCheckInParent(
                                                                                            child._id,
                                                                                            false,
                                                                                            '',
                                                                                        )
                                                                                    }
                                                                                >
                                                                                    Hủy phụ huynh đưa
                                                                                </Button>
                                                                            </div>
                                                                        ) : null}

                                                                        {child.attendance.first.isCheckIn === true &&
                                                                        child.attendance.first.isCheckOut === false ? (
                                                                            <div className="flex items-center justify-center flex-wrap gap-2 ">
                                                                                <Button
                                                                                    info
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    onClick={() =>
                                                                                        handleCheckOut(child._id, true)
                                                                                    }
                                                                                >
                                                                                    Xuống xe
                                                                                </Button>
                                                                                <Button
                                                                                    error
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    onClick={() =>
                                                                                        handleCheckIn(child._id, false)
                                                                                    }
                                                                                >
                                                                                    Hủy lên xe
                                                                                </Button>
                                                                            </div>
                                                                        ) : null}
                                                                        {child.attendance.class.isCheckIn === true ? (
                                                                            <div>
                                                                                {child.attendance.first.isUse ===
                                                                                    'NO' &&
                                                                                child.attendance.class.isCheckIn ===
                                                                                    true ? (
                                                                                    <Button
                                                                                        disabled
                                                                                        className={
                                                                                            'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                        }
                                                                                        large
                                                                                    >
                                                                                        Trẻ đã được phụ huynh đưa tới
                                                                                        trường.
                                                                                    </Button>
                                                                                ) : (
                                                                                    <Button
                                                                                        disabled
                                                                                        className={
                                                                                            'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                        }
                                                                                        large
                                                                                    >
                                                                                        Không thể cập nhật khi giáo viên
                                                                                        đã nhận.
                                                                                    </Button>
                                                                                )}
                                                                            </div>
                                                                        ) : child.attendance.first.isCheckOut ===
                                                                          true ? (
                                                                            <div className="w-24">
                                                                                <Button
                                                                                    error
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    onClick={() =>
                                                                                        handleCheckOut(child._id, false)
                                                                                    }
                                                                                >
                                                                                    Hủy xuống xe
                                                                                </Button>
                                                                            </div>
                                                                        ) : null}
                                                                    </>
                                                                ) : attendanceType === 'SECOND' &&
                                                                  child.attendance.class.isCheckOut === true &&
                                                                  child.attendance.class.receiver === 'DRIVER' ? (
                                                                    <>
                                                                        {child.attendance.second.isCheckIn === false ? (
                                                                            <>
                                                                                <Button
                                                                                    success
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    onClick={() =>
                                                                                        handleCheckIn(child._id, true)
                                                                                    }
                                                                                >
                                                                                    Lên xe về
                                                                                </Button>
                                                                            </>
                                                                        ) : null}
                                                                        {child.attendance.second.isCheckIn === true &&
                                                                        child.attendance.second.isCheckOut === false ? (
                                                                            <div className="flex items-center justify-center flex-wrap gap-2 ">
                                                                                {!photoCaptured[child._id] && (
                                                                                    <>
                                                                                        <Button
                                                                                            info
                                                                                            className={
                                                                                                'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                            }
                                                                                            large
                                                                                            onClick={() =>
                                                                                                handleCapturePhoto(
                                                                                                    child._id,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Chụp vị trí
                                                                                        </Button>
                                                                                    </>
                                                                                )}
                                                                                {photoCaptured[child._id] && (
                                                                                    <>
                                                                                        <Button
                                                                                            info
                                                                                            className={
                                                                                                'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                            }
                                                                                            large
                                                                                            onClick={() =>
                                                                                                handleCheckOut(
                                                                                                    child._id,
                                                                                                    true,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Xuống xe
                                                                                        </Button>
                                                                                    </>
                                                                                )}

                                                                                <Button
                                                                                    error
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    onClick={() =>
                                                                                        handleCheckIn(child._id, false)
                                                                                    }
                                                                                >
                                                                                    Hủy lên xe
                                                                                </Button>
                                                                            </div>
                                                                        ) : null}
                                                                        {child.attendance.second.isCheckOut === true ? (
                                                                            <div className="w-24">
                                                                                <Button
                                                                                    error
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-6 py-1'
                                                                                    }
                                                                                    large
                                                                                    onClick={() =>
                                                                                        handleCheckOut(child._id, false)
                                                                                    }
                                                                                >
                                                                                    Hủy xuống
                                                                                </Button>
                                                                            </div>
                                                                        ) : null}
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        {child.attendance.class.receiver === 'USER' &&
                                                                        child.attendance.class.isCheckOut === true ? (
                                                                            <Button
                                                                                className={
                                                                                    'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                }
                                                                                large
                                                                                disabled
                                                                            >
                                                                                Trẻ đã được phụ huynh đón tại trường
                                                                            </Button>
                                                                        ) : (
                                                                            <Button
                                                                                className={
                                                                                    'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                }
                                                                                large
                                                                                disabled
                                                                            >
                                                                                Trẻ chưa được giáo viên trả lại xe
                                                                            </Button>
                                                                        )}
                                                                    </>
                                                                )
                                                            ) : (
                                                                <div className="w-[100px]">
                                                                    {attendanceType === 'FIRST' ? (
                                                                        <>
                                                                            {child.attendance.first.isCheckIn ===
                                                                                true &&
                                                                            child.attendance.first.isCheckOut ===
                                                                                true ? (
                                                                                <Button
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    success
                                                                                    disable
                                                                                >
                                                                                    Đã đi
                                                                                </Button>
                                                                            ) : (
                                                                                <Button
                                                                                    error
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    disable
                                                                                >
                                                                                    Không đi
                                                                                </Button>
                                                                            )}
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            {child.attendance.second.isCheckIn ===
                                                                                true &&
                                                                            child.attendance.second.isCheckOut ===
                                                                                true ? (
                                                                                <Button
                                                                                    success
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    disable
                                                                                >
                                                                                    Đã đi
                                                                                </Button>
                                                                            ) : (
                                                                                <Button
                                                                                    error
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    disable
                                                                                >
                                                                                    Không đi
                                                                                </Button>
                                                                            )}
                                                                        </>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        {showCameraModal && (
                            <CameraModal
                                onConfirm={handleConfirm}
                                onClose={() => {
                                    setShowCameraModal(false);
                                }}
                                isOpen={showCameraModal}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransportationDetails;
