import React, { useEffect, useState } from 'react';
import { format, isSameDay } from 'date-fns';
import { vi } from 'date-fns/locale';
import axios from '~/config/configAxios';
import { useParams } from 'react-router-dom';
import { checkInChild, checkOutChild, getChildrenByClassId } from '~/api/user';
import { createHealthLogs } from '~/api/healthLogs';
import Button from '~/components/Button';
import { Home01Icon, CreativeMarketIcon } from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { socket } from '~/services/socket';
import socketMessages from '~/config/configSocketEmit';
import CameraModal from './CameraModal';
import { uploadImage } from '~/utils/uploadFile/uploadImage';
import { getAge } from '~/utils/form';
import Modal from '~/components/Modal';

const ClassDetails = () => {
    const { classId } = useParams();
    const navigate = useNavigate();
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const today = new Date();
    const formattedToday = format(today, 'yyyy-MM-dd', { locale: vi });
    const [selectDate, setSelectDate] = useState(formattedToday);
    const dateObject = new Date(selectDate);
    const displayDate = format(dateObject, "'ngày' dd 'tháng' MM 'năm' yyyy", { locale: vi });
    const [childReceivers, setChildReceivers] = useState({});
    const [showCameraModal, setShowCameraModal] = useState(false);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [photoCaptured, setPhotoCaptured] = useState({});
    const [deviceSize, setDeviceSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const [showHealthLogModal, setShowHealthLogModal] = useState(false);
    const [selectedChild, setSelectedChild] = useState(null);
    const [healthLog, setHealthLog] = useState({
        weight: 0,
        height: 0,
        note: '',
    });
    // Function to toggle health log modal
    const toggleHealthLogModal = (child = null) => {
        setSelectedChild(child);
        setShowHealthLogModal(!showHealthLogModal);
    };
    // Function to handle health log input change
    const handleHealthLogChange = (field, value) => {
        setHealthLog({ ...healthLog, [field]: value });
    };
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const isToday = (date) => {
        const today = new Date();
        return isSameDay(new Date(date), today);
    };
    const filteredChildren = Array.isArray(children)
        ? children.filter(
              (child) =>
                  child.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  child.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
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
        if (classId) {
            fetchChildrenByClass(classId);
        }
    }, [classId, selectDate]);
    useEffect(() => {
        let setTimeOutId = null;
        socket.emit(socketMessages.ATTENDANCE_JOIN_ROOM, 'attendanceClass-123');
        socket.on(socketMessages.ATTENDANCE, (data) => {
            if (data.data.code === '00') {
                const isChildInFilteredChildren = filteredChildren.some(
                    (child) => child._id === data.data.data.childId,
                );
                if (isChildInFilteredChildren) {
                    setTimeOutId = setTimeout(() => {
                        fetchChildrenByClass(classId);
                    }, 1000);
                }
            }
        });
        return () => {
            clearTimeout(setTimeOutId);
            socket.emit(socketMessages.ATTENDANCE_LEAVE_ROOM, 'attendanceClass-123');
            socket.off(socketMessages.ATTENDANCE);
        };
    }, [classId, filteredChildren]);
    const fetchChildrenByClass = async (classId) => {
        try {
            const response = await axios({
                url: getChildrenByClassId.url,
                method: getChildrenByClassId.method,
                params: {
                    classId: classId,
                    attendDay: dateObject.getDate(),
                    attendMonth: dateObject.getMonth() + 1,
                    attendYear: dateObject.getFullYear(),
                },
            });
            setChildren(response.data.data);
            setLoading(false);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    setError('Không có học sinh trong lớp này.');
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
    const handleShowClasses = () => {
        navigate(`/dashboards/my-class`);
    };
    const handleCheckIn = async (childId, isCheckIn) => {
        const data = {
            classId: classId,
            childId: childId,
            isCheckIn: isCheckIn,
        };
        let title = '';
        if (isCheckIn) {
            title = 'Nhận trẻ';
            data.receiver = '';
        } else {
            title = 'Hủy nhận trẻ';
            data.receiver = '';
        }
        try {
            const res = await axios({
                method: checkInChild.method,
                url: checkInChild.url,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                await fetchChildrenByClass(classId);
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
    const handleCheckInParent = async (childId, isCheckIn) => {
        const data = {
            classId: classId,
            childId: childId,
            isCheckIn: isCheckIn,
        };
        let title = '';
        if (isCheckIn) {
            title = 'Nhận trẻ';
            data.receiver = 'USER';
        } else {
            title = 'Hủy nhận trẻ';
            data.receiver = '';
        }
        try {
            const res = await axios({
                method: checkInChild.method,
                url: checkInChild.url,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                await fetchChildrenByClass(classId);
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
            classId: classId,
            childId: childId,
            isCheckOut: isCheckOut,
        };
        let title = '';
        if (isCheckOut) {
            title = 'Trả trẻ';
            data.receiver = childReceivers[childId] || 'USER';
            data.receiverUrl = childData.imageUrl || '';
        } else {
            title = 'Hủy trả trẻ';
            data.receiver = '';
            data.receiverUrl = '';
        }
        try {
            const res = await axios({
                method: checkOutChild.method,
                url: checkOutChild.url,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                setPhotoCaptured((prev) => {
                    const updated = { ...prev };
                    delete updated[childId];
                    return updated;
                });
                await fetchChildrenByClass(classId);
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

    const handleCheckboxChange = (childId) => {
        setChildren((prevChildren) =>
            prevChildren.map((child) =>
                child._id === childId
                    ? {
                          ...child,
                          attendance: {
                              ...child.attendance,
                              first: {
                                  ...child.attendance.first,
                                  isUse: child.attendance.first.isUse === 'NO' ? '' : 'NO',
                              },
                          },
                      }
                    : child,
            ),
        );
    };
    const handleRadioChangeReceiver = (childId, receiver) => {
        setChildReceivers((prevReceivers) => ({
            ...prevReceivers,
            [childId]: receiver,
        }));
    };
    const submitHealthLog = async () => {
        try {
            const response = await axios({
                method: createHealthLogs.method,
                url: createHealthLogs.url,
                data: {
                    childId: selectedChild._id,
                    ...healthLog,
                },
            });
            if (response.data.status === 200) {
                toast.success('Nhật ký sức khoẻ được tạo thành công!');
                setHealthLog({
                    weight: '',
                    height: '',
                    note: '',
                });
                setShowHealthLogModal(false);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            toast.error(`Failed to create health log: ${error.message}`);
        }
    };

    return (
        <div className="w-full p-2 bg-white shadow-md rounded-lg pb-12 text-center">
            <h2 className="text-center pt-12">Danh sách học sinh của lớp {displayDate}</h2>
            <Button
                icon={<Home01Icon />}
                onClick={handleShowClasses}
                className="bg-primary text-white hover:bg-opacity-80 mt-4"
            >
                Quay lại
            </Button>
            <div className="p-10 flex text-left  flex-wrap">
                <div className=" ">
                    <input
                        type="search"
                        placeholder="Tìm kiếm..."
                        value={searchTerm}
                        onChange={handleSearch}
                        className="p-2 w-full max-w-xs border-2 border-blue-500 rounded outline-none text-lg transition duration-300 focus:border-blue-700"
                    />
                </div>
                <div className="flex m-3 flex-col sm:flex-row flex-wrap space-y-4 sm:space-y-0 items-center justify-between pb-4 ml-auto">
                    <label htmlFor="attendance-date">Chọn ngày điểm danh : </label>
                    <input
                        className="mb-4 text-gray-900 border border-gray-300 rounded-lg"
                        id="attendance-date"
                        type="date"
                        max={formattedToday}
                        value={selectDate}
                        onChange={handleDateChange}
                    />
                </div>
            </div>
            {filteredChildren.length === 0 ? (
                <p className="text-center mt-4">Không có học sinh nào trong lớp này.</p>
            ) : (
                <table className="w-full border-collapse mt-5">
                    <thead className="bg-gray-200 border-b border-gray-400">
                        {deviceSize.width >= 500 ? (
                            <>
                                <tr>
                                    <th className="p-2">STT</th>
                                    <th className=" p-2">Ảnh</th>
                                    <th className="p-2">Họ và tên</th>
                                    <th className="p-2">Tuổi</th>
                                    <th className="p-2">Xe đưa đón</th>
                                    <th className="p-2">Nhật ký sức khoẻ</th>
                                    <th className="p-2">Điểm danh</th>
                                </tr>
                            </>
                        ) : (
                            <>
                                <tr>
                                    <th className="px-2 py-3 text-[10] text-center">STT</th>
                                    <th className="px-3 py-3 text-[10] text-center">Thông tin trẻ</th>
                                    <th className="px-2 py-3 text-[10] text-center">Xe</th>
                                    <th className="px-2 py-3 text-center">Điểm danh</th>
                                </tr>
                            </>
                        )}
                    </thead>
                    <tbody>
                        {filteredChildren.map((child, index) => (
                            <tr key={child._id} className="border-b border-gray-300">
                                {deviceSize.width >= 500 ? (
                                    <>
                                        <td className="p-2 border-b border-gray-300 text-center md:text-center">
                                            {index + 1}
                                        </td>
                                        <td className="hidden md:table-cell p-2">
                                            {child.avatar ? (
                                                <img
                                                    className="w-36 h-48 object-cover mx-auto mt-1"
                                                    src={child.avatar}
                                                    alt={`${child.firstName} ${child.lastName}`}
                                                />
                                            ) : (
                                                <img
                                                    src="/img/default-avt.png"
                                                    className="w-36 h-48 object-cover mx-auto mt-1"
                                                    alt="User Avt"
                                                />
                                            )}
                                        </td>
                                        <td className="p-2 border-b border-gray-300 text-center md:text-center">
                                            {child.firstName} {child.lastName}
                                        </td>
                                        <td className=" p-2 border-b border-gray-300 text-center">
                                            {getAge(child.dateOfBirth)}
                                        </td>
                                        <td className=" p-2 border-b border-gray-300 text-center">
                                            {child.transportDetail ? child.transportDetail.name : 'Chưa đăng ký'}
                                        </td>
                                        <td className="p-2 border-b border-gray-300 text-center">
                                            <div className="flex justify-center items-center">
                                                <Button
                                                    outlineInfo
                                                    className="ml-2"
                                                    icon={<CreativeMarketIcon size={24} color={'#007bff'} />}
                                                    onClick={() => toggleHealthLogModal(child)}
                                                />
                                            </div>
                                        </td>
                                        <td className="p-2 text-center w-[20rem]">
                                            <div className="flex items-center justify-center space-x-2 ">
                                                {isToday(selectDate) ? (
                                                    <>
                                                        {child.attendance.first && child.attendance.second ? (
                                                            <div className="grid items-center justify-center flex-wrap gap-2 space-x-1">
                                                                {(child.attendance.first.isUse === '' ||
                                                                    child.attendance.first.isUse === 'NO') &&
                                                                child.attendance.class.isCheckIn === false ? (
                                                                    <>
                                                                        <div className="flex items-center justify-center space-x-2">
                                                                            <input
                                                                                type="checkbox"
                                                                                id={`checkbox-${child._id}`}
                                                                                checked={
                                                                                    child.attendance.first.isUse ===
                                                                                    'NO'
                                                                                }
                                                                                onChange={() =>
                                                                                    handleCheckboxChange(child._id)
                                                                                }
                                                                            />
                                                                            <label htmlFor={`checkbox-${child._id}`}>
                                                                                Phụ huynh
                                                                            </label>
                                                                        </div>
                                                                    </>
                                                                ) : null}

                                                                {child.attendance.first.isCheckOut === true &&
                                                                child.attendance.class.isCheckIn === false &&
                                                                child.attendance.first.isUse === 'YES' ? (
                                                                    <>
                                                                        <Button
                                                                            success
                                                                            onClick={() =>
                                                                                handleCheckIn(child._id, true)
                                                                            }
                                                                        >
                                                                            Nhận trẻ từ tài xế
                                                                        </Button>
                                                                    </>
                                                                ) : null}
                                                                {child.attendance.first.isCheckOut === false &&
                                                                child.attendance.class.isCheckIn === false &&
                                                                child.attendance.first.isUse === 'NO' ? (
                                                                    <>
                                                                        <Button
                                                                            success
                                                                            onClick={() =>
                                                                                handleCheckInParent(child._id, true)
                                                                            }
                                                                        >
                                                                            Nhận trẻ từ phụ huynh
                                                                        </Button>
                                                                    </>
                                                                ) : null}
                                                                {child.attendance.class.isCheckIn === true &&
                                                                child.attendance.class.isCheckOut === false ? (
                                                                    <div className="grid items-center justify-center flex-wrap gap-2 space-x-1">
                                                                        {!photoCaptured[child._id] && (
                                                                            <div className="">
                                                                                <span>Chọn người nhận:</span>
                                                                                <div className="flex gap-2">
                                                                                    <div className="flex items-center justify-center space-x-2">
                                                                                        <input
                                                                                            type="radio"
                                                                                            id={`radio-driver-${child._id}`}
                                                                                            name={`receiver-${child._id}`}
                                                                                            checked={
                                                                                                childReceivers[
                                                                                                    child._id
                                                                                                ] === 'DRIVER'
                                                                                            }
                                                                                            onChange={() =>
                                                                                                handleRadioChangeReceiver(
                                                                                                    child._id,
                                                                                                    'DRIVER',
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`radio-driver-${child._id}`}
                                                                                        >
                                                                                            Tài xế
                                                                                        </label>
                                                                                    </div>
                                                                                    <div className="flex items-center justify-center space-x-2">
                                                                                        <input
                                                                                            type="radio"
                                                                                            id={`radio-user-${child._id}`}
                                                                                            name={`receiver-${child._id}`}
                                                                                            checked={
                                                                                                childReceivers[
                                                                                                    child._id
                                                                                                ] === 'USER'
                                                                                            }
                                                                                            onChange={() =>
                                                                                                handleRadioChangeReceiver(
                                                                                                    child._id,
                                                                                                    'USER',
                                                                                                )
                                                                                            }
                                                                                        />
                                                                                        <label
                                                                                            htmlFor={`radio-user-${child._id}`}
                                                                                        >
                                                                                            Phụ huynh
                                                                                        </label>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        )}

                                                                        {childReceivers[child._id] &&
                                                                            !photoCaptured[child._id] && (
                                                                                <>
                                                                                    <Button
                                                                                        info
                                                                                        disable={
                                                                                            !childReceivers[child._id]
                                                                                                ? true
                                                                                                : false
                                                                                        }
                                                                                        onClick={() =>
                                                                                            handleCapturePhoto(
                                                                                                child._id,
                                                                                            )
                                                                                        }
                                                                                    >
                                                                                        Chụp Ảnh
                                                                                    </Button>
                                                                                </>
                                                                            )}
                                                                        {!childReceivers[child._id] &&
                                                                            !photoCaptured[child._id] && (
                                                                                <>
                                                                                    <Button info disable>
                                                                                        Chụp Ảnh
                                                                                    </Button>
                                                                                </>
                                                                            )}
                                                                        {(childReceivers[child._id] === 'USER' ||
                                                                            childReceivers[child._id] === 'DRIVER') &&
                                                                            photoCaptured[child._id] && (
                                                                                <Button
                                                                                    info
                                                                                    onClick={() =>
                                                                                        handleCheckOut(child._id, true)
                                                                                    }
                                                                                >
                                                                                    Trả trẻ
                                                                                </Button>
                                                                            )}

                                                                        <Button
                                                                            error
                                                                            onClick={() =>
                                                                                handleCheckIn(child._id, false)
                                                                            }
                                                                        >
                                                                            Hủy nhận trẻ
                                                                        </Button>
                                                                    </div>
                                                                ) : null}
                                                                {child.attendance.class.isCheckOut === true &&
                                                                child.attendance.second.isCheckIn === false ? (
                                                                    <>
                                                                        <Button
                                                                            error
                                                                            onClick={() =>
                                                                                handleCheckOut(child._id, false)
                                                                            }
                                                                        >
                                                                            Hủy trả trẻ
                                                                        </Button>
                                                                    </>
                                                                ) : null}
                                                                {(child.attendance.second.isCheckIn === true &&
                                                                    child.attendance.second.isCheckOut === false) ||
                                                                (child.attendance.second.isCheckIn === true &&
                                                                    child.attendance.second.isCheckOut === true) ? (
                                                                    <>
                                                                        <Button disabled>
                                                                            Không thể cập nhật <br />
                                                                            khi đã lên xe
                                                                        </Button>
                                                                    </>
                                                                ) : null}
                                                                {child.attendance.first.isCheckOut === false &&
                                                                child.attendance.class.isCheckIn === false &&
                                                                (child.attendance.first.isUse === '' ||
                                                                    child.attendance.first.isUse === 'YES') ? (
                                                                    <>
                                                                        <Button disabled>
                                                                            Tài xế chưa <br />
                                                                            cho trẻ xuống
                                                                        </Button>
                                                                    </>
                                                                ) : null}
                                                            </div>
                                                        ) : (
                                                            <>
                                                                {child.attendance.class.isCheckIn === false ? (
                                                                    <>
                                                                        <Button
                                                                            success
                                                                            onClick={() =>
                                                                                handleCheckIn(child._id, true)
                                                                            }
                                                                        >
                                                                            Nhận trẻ
                                                                        </Button>
                                                                    </>
                                                                ) : null}
                                                                {child.attendance.class.isCheckIn === true &&
                                                                child.attendance.class.isCheckOut === false ? (
                                                                    <div className="grid items-center justify-center flex-wrap-reverse gap-2 space-x-1">
                                                                        {!photoCaptured[child._id] && (
                                                                            <>
                                                                                <Button
                                                                                    info
                                                                                    onClick={() =>
                                                                                        handleCapturePhoto(child._id)
                                                                                    }
                                                                                >
                                                                                    Chụp Ảnh
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                        {photoCaptured[child._id] && (
                                                                            <>
                                                                                <Button
                                                                                    info
                                                                                    onClick={() =>
                                                                                        handleCheckOut(child._id, true)
                                                                                    }
                                                                                >
                                                                                    Trả trẻ
                                                                                </Button>
                                                                            </>
                                                                        )}
                                                                        <Button
                                                                            error
                                                                            onClick={() =>
                                                                                handleCheckIn(child._id, false)
                                                                            }
                                                                        >
                                                                            Hủy nhận trẻ
                                                                        </Button>
                                                                    </div>
                                                                ) : null}
                                                                {child.attendance.class.isCheckOut === true ? (
                                                                    <>
                                                                        <Button
                                                                            error
                                                                            onClick={() =>
                                                                                handleCheckOut(child._id, false)
                                                                            }
                                                                        >
                                                                            Hủy trả trẻ
                                                                        </Button>
                                                                    </>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        {(child.attendance.class.isCheckIn === true) &
                                                        (child.attendance.class.isCheckOut === true) ? (
                                                            <>
                                                                <Button success disable>
                                                                    Đã đi học
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button error disable>
                                                                    Không đi học
                                                                </Button>
                                                            </>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </>
                                ) : (
                                    <>
                                        <td className="p-3 text-center">{index + 1}</td>
                                        <td className="px-5 py-4  text-[12px]">
                                            {child.avatar ? (
                                                <img
                                                    className="w-20 h-20 object-cover mx-auto mt-1"
                                                    src={child.avatar}
                                                    alt={`${child.firstName} ${child.lastName}`}
                                                />
                                            ) : (
                                                <img
                                                    src="/img/default-avt.png"
                                                    className="w-20 h-20 object-cover mx-auto mt-1"
                                                    alt="User Avt"
                                                />
                                            )}
                                            <p className="text-left">
                                                <span className="font-bold">Họ và tên:</span> {child.firstName}{' '}
                                                {child.lastName}
                                            </p>
                                            <p className="text-left">
                                                {' '}
                                                <span className="font-bold">Tuổi:</span> {getAge(child.dateOfBirth)}
                                            </p>
                                        </td>

                                        <td className=" p-2  text-[12px] border-b border-gray-300 text-center">
                                            {child.transportDetail ? child.transportDetail.name : 'Chưa đăng ký'}
                                        </td>
                                        <td className="p-2 text-center w-[6rem]">
                                            <div className="flex items-center justify-center space-x-2 ">
                                                {isToday(selectDate) ? (
                                                    <>
                                                        {child.attendance.first && child.attendance.second ? (
                                                            <>
                                                                <div className="flex items-center justify-center flex-wrap gap-2">
                                                                    {(child.attendance.first.isUse === '' ||
                                                                        child.attendance.first.isUse === 'NO') &&
                                                                    child.attendance.class.isCheckIn === false ? (
                                                                        <>
                                                                            <div className="flex items-center justify-center gap-1">
                                                                                <input
                                                                                    type="checkbox"
                                                                                    id={`checkbox-${child._id}`}
                                                                                    checked={
                                                                                        child.attendance.first.isUse ===
                                                                                        'NO'
                                                                                    }
                                                                                    className={'text-[10px] px-2 py-2'}
                                                                                    onChange={() =>
                                                                                        handleCheckboxChange(child._id)
                                                                                    }
                                                                                />
                                                                                <label
                                                                                    htmlFor={`checkbox-${child._id}`}
                                                                                    className={
                                                                                        'text-[10px] w-[64px] px-2 py-2'
                                                                                    }
                                                                                >
                                                                                    Phụ huynh
                                                                                </label>
                                                                            </div>
                                                                        </>
                                                                    ) : null}

                                                                    {child.attendance.first.isCheckOut === true &&
                                                                    child.attendance.class.isCheckIn === false &&
                                                                    child.attendance.first.isUse === 'YES' ? (
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
                                                                                Nhận trẻ từ tài xế
                                                                            </Button>
                                                                        </>
                                                                    ) : null}
                                                                    {child.attendance.first.isCheckOut === false &&
                                                                    child.attendance.class.isCheckIn === false &&
                                                                    child.attendance.first.isUse === 'NO' ? (
                                                                        <>
                                                                            <Button
                                                                                success
                                                                                className={
                                                                                    'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                }
                                                                                large
                                                                                onClick={() =>
                                                                                    handleCheckInParent(child._id, true)
                                                                                }
                                                                            >
                                                                                Phụ huynh chở
                                                                            </Button>
                                                                        </>
                                                                    ) : null}
                                                                    {child.attendance.class.isCheckIn === true &&
                                                                    child.attendance.class.isCheckOut === false ? (
                                                                        <div className="flex items-center justify-center flex-wrap gap-2">
                                                                            {!photoCaptured[child._id] && (
                                                                                <div className="">
                                                                                    <span className={'text-[10px]'}>
                                                                                        Chọn người nhận:
                                                                                    </span>
                                                                                    <div className="gird gap-2">
                                                                                        <div className="flex items-center justify-center ">
                                                                                            <input
                                                                                                type="radio"
                                                                                                id={`radio-driver-${child._id}`}
                                                                                                name={`receiver-${child._id}`}
                                                                                                className={
                                                                                                    'text-[10px] '
                                                                                                }
                                                                                                checked={
                                                                                                    childReceivers[
                                                                                                        child._id
                                                                                                    ] === 'DRIVER'
                                                                                                }
                                                                                                onChange={() =>
                                                                                                    handleRadioChangeReceiver(
                                                                                                        child._id,
                                                                                                        'DRIVER',
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                            <label
                                                                                                className={
                                                                                                    'text-[10px] px-2 py-1'
                                                                                                }
                                                                                                htmlFor={`radio-driver-${child._id}`}
                                                                                            >
                                                                                                Tài xế
                                                                                            </label>
                                                                                        </div>
                                                                                        <div className="flex items-center justify-center">
                                                                                            <input
                                                                                                type="radio"
                                                                                                className={
                                                                                                    'text-[10px] px-2 py-2'
                                                                                                }
                                                                                                id={`radio-user-${child._id}`}
                                                                                                name={`receiver-${child._id}`}
                                                                                                checked={
                                                                                                    childReceivers[
                                                                                                        child._id
                                                                                                    ] === 'USER'
                                                                                                }
                                                                                                onChange={() =>
                                                                                                    handleRadioChangeReceiver(
                                                                                                        child._id,
                                                                                                        'USER',
                                                                                                    )
                                                                                                }
                                                                                            />
                                                                                            <label
                                                                                                className={
                                                                                                    'text-[10px] px-2 py-1'
                                                                                                }
                                                                                                htmlFor={`radio-user-${child._id}`}
                                                                                            >
                                                                                                Phụ huynh
                                                                                            </label>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}

                                                                            {childReceivers[child._id] &&
                                                                                !photoCaptured[child._id] && (
                                                                                    <>
                                                                                        <Button
                                                                                            info
                                                                                            className={
                                                                                                'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                            }
                                                                                            large
                                                                                            disable={
                                                                                                !childReceivers[
                                                                                                    child._id
                                                                                                ]
                                                                                                    ? true
                                                                                                    : false
                                                                                            }
                                                                                            onClick={() =>
                                                                                                handleCapturePhoto(
                                                                                                    child._id,
                                                                                                )
                                                                                            }
                                                                                        >
                                                                                            Chụp Ảnh
                                                                                        </Button>
                                                                                    </>
                                                                                )}
                                                                            {!childReceivers[child._id] &&
                                                                                !photoCaptured[child._id] && (
                                                                                    <>
                                                                                        <Button
                                                                                            info
                                                                                            className={
                                                                                                'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                            }
                                                                                            large
                                                                                            disable
                                                                                        >
                                                                                            Chụp Ảnh
                                                                                        </Button>
                                                                                    </>
                                                                                )}
                                                                            {(childReceivers[child._id] === 'USER' ||
                                                                                childReceivers[child._id] ===
                                                                                    'DRIVER') &&
                                                                                photoCaptured[child._id] && (
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
                                                                                        Trả trẻ
                                                                                    </Button>
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
                                                                                Hủy nhận trẻ
                                                                            </Button>
                                                                        </div>
                                                                    ) : null}

                                                                    {(child.attendance.second.isCheckIn === true &&
                                                                        child.attendance.second.isCheckOut === false) ||
                                                                    (child.attendance.second.isCheckIn === true &&
                                                                        child.attendance.second.isCheckOut === true) ? (
                                                                        <>
                                                                            <Button
                                                                                disabled
                                                                                className={
                                                                                    'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                }
                                                                                large
                                                                            >
                                                                                Không thể cập nhật
                                                                            </Button>
                                                                        </>
                                                                    ) : null}
                                                                    {child.attendance.first.isCheckOut === false &&
                                                                    child.attendance.class.isCheckIn === false &&
                                                                    (child.attendance.first.isUse === '' ||
                                                                        child.attendance.first.isUse === 'YES') ? (
                                                                        <>
                                                                            <Button
                                                                                disabled
                                                                                className={
                                                                                    'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                }
                                                                                large
                                                                            >
                                                                                Tài xế chưa trả trẻ
                                                                            </Button>
                                                                        </>
                                                                    ) : null}
                                                                </div>
                                                                {child.attendance.class.isCheckOut === true &&
                                                                child.attendance.second.isCheckIn === false ? (
                                                                    <>
                                                                        <Button
                                                                            error
                                                                            className={
                                                                                'text-[10px] w-full rounded-[16px] px-2 py-1'
                                                                            }
                                                                            large
                                                                            onClick={() =>
                                                                                handleCheckOut(child._id, false)
                                                                            }
                                                                        >
                                                                            Hủy trả trẻ
                                                                        </Button>
                                                                    </>
                                                                ) : null}
                                                            </>
                                                        ) : (
                                                            <>
                                                                {child.attendance.class.isCheckIn === false ? (
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
                                                                            Nhận trẻ
                                                                        </Button>
                                                                    </>
                                                                ) : null}
                                                                {child.attendance.class.isCheckIn === true &&
                                                                child.attendance.class.isCheckOut === false ? (
                                                                    <div className="flex items-center justify-center flex-wrap gap-2">
                                                                        {!photoCaptured[child._id] && (
                                                                            <>
                                                                                <Button
                                                                                    info
                                                                                    className={
                                                                                        'text-[10px] rounded-[16px]  px-2 py-1'
                                                                                    }
                                                                                    large
                                                                                    onClick={() =>
                                                                                        handleCapturePhoto(child._id)
                                                                                    }
                                                                                >
                                                                                    Chụp Ảnh
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
                                                                                        handleCheckOut(child._id, true)
                                                                                    }
                                                                                >
                                                                                    Trả trẻ
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
                                                                            Hủy nhận
                                                                        </Button>
                                                                    </div>
                                                                ) : null}
                                                                {child.attendance.class.isCheckOut === true ? (
                                                                    <>
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
                                                                            Hủy trả trẻ
                                                                        </Button>
                                                                    </>
                                                                ) : null}
                                                            </>
                                                        )}
                                                    </>
                                                ) : (
                                                    <div className="w-[100px]">
                                                        {(child.attendance.class.isCheckIn === true) &
                                                        (child.attendance.class.isCheckOut === true) ? (
                                                            <>
                                                                <Button
                                                                    success
                                                                    className={'text-[10px] rounded-[16px]  px-2 py-1'}
                                                                    large
                                                                    disable
                                                                >
                                                                    Đã đi học
                                                                </Button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Button
                                                                    error
                                                                    className={'text-[10px] rounded-[16px]  px-2 py-1'}
                                                                    large
                                                                    disable
                                                                >
                                                                    Không đi học
                                                                </Button>
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
            <Modal
                title={`Nhật ký sức khoẻ của bé ${selectedChild?.firstName} ${selectedChild?.lastName}`}
                _showModal={showHealthLogModal}
                onClick={toggleHealthLogModal}
                onClickAccept={submitHealthLog}
            >
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="weight" className="font-semibold">
                            Cân nặng (kg):
                        </label>
                        <input
                            type="number"
                            id="weight"
                            value={healthLog.weight}
                            className="border border-gray-600 rounded p-1 w-[50%] text-center"
                            onChange={(e) => handleHealthLogChange('weight', e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <label htmlFor="height" className="font-semibold">
                            Chiều cao (cm):
                        </label>
                        <input
                            type="number"
                            id="height"
                            value={healthLog.height}
                            className="border border-gray-600 rounded p-1 w-[50%] text-center"
                            onChange={(e) => handleHealthLogChange('height', e.target.value)}
                        />
                    </div>

                    <div className="flex justify-between items-center">
                        <label htmlFor="note" className="font-semibold mb-2">
                            Ghi chú:
                        </label>
                        <textarea
                            id="note"
                            value={healthLog.note}
                            className="border border-gray-600 rounded p-2 w-[50%] h-20 resize-none text-start"
                            onChange={(e) => handleHealthLogChange('note', e.target.value)}
                        />
                    </div>
                </div>
            </Modal>
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
    );
};

export default ClassDetails;
