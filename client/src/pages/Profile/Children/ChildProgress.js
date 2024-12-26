import React, { useEffect, useState } from 'react';
import Sidebar from '../ProfileSidebar';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from '~/config/configAxios';
import { toast } from 'react-toastify';
import { getClassAndSkillInfoByChildId, getChildById, getAttendance } from '~/api/user';
import { getHealthLogs } from '~/api/healthLogs';
import { getRooms } from '~/api/room';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const ChildProgress = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [childData, setChildData] = useState({
        class: null,
        skill: null,
    });
    const [attendanceDays, setAttendanceDays] = useState([]);
    const [chartDataHeight, setChartDataHeight] = useState(null);
    const [chartDataWeight, setChartDataWeight] = useState(null);
    const [childInfo, setChildInfo] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        height: '',
        weight: '',
        healthStatus: '',
    });
    const [healthLogsData, setHealthLogsData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);
    const [rooms, setRooms] = useState([]);

    const handleOpenModal = () => {
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setZoomLevel(1);
        document.body.style.overflow = 'auto';
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };

    const fetchHealthLogs = async (childId) => {
        try {
            const response = await axios({
                method: getHealthLogs(childId).method,
                url: getHealthLogs(childId).url,
                withCredentials: true,
            });
            setHealthLogsData(response.data.data);
        } catch (error) {
            console.error('Error fetching health logs', error);
        }
    };

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                let res = await axios({
                    url: getRooms.url,
                    method: getRooms.method,
                });
                if (res.data.status === 200) {
                    setRooms(res.data.data);
                } else {
                    let id = toast.loading('Làm ơn chờ...');
                    toast.update(id, {
                        render: `Fetch phòng  thất bại`,
                        type: 'error',
                        isLoading: false,
                        autoClose: 3000,
                        closeOnClick: true,
                        closeButton: true,
                    });
                }
            } catch (error) {
                let id = toast.loading('Làm ơn chờ...');
                toast.update(id, {
                    render: `Fetch phòng  thất bại`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        };

        fetchRoom();
    }, []);

    const fetchChildAttendanceData = async (childId) => {
        try {
            const res = await axios({
                method: getAttendance(childId).method,
                url: getAttendance(childId).url,
            });
            if (res.data.status === 200) {
                const attendance = res.data.data;
                setAttendanceDays(attendance);
            } else {
                console.error('Failed to fetch attendance data', res.data.message);
            }
        } catch (error) {
            toast.error('Error fetching attendance data.');
            console.error(error);
        }
    };

    const fetchChildLearningData = async (childId) => {
        try {
            const res = await axios({
                method: getClassAndSkillInfoByChildId(childId).method,
                url: getClassAndSkillInfoByChildId(childId).url,
            });
            if (res.data.status === 200) {
                const { class: classInfo, skill } = res.data.data;
                setChildData({
                    class: classInfo,
                    skill: skill,
                });
            } else {
                console.error('Failed to fetch child data', res.data.message);
            }
        } catch (error) {
            toast.error('Error fetching child development data.');
            console.error(error);
        }
    };
    const fetchChildData = async (childId) => {
        try {
            const res = await axios({
                method: getChildById(childId).method,
                url: getChildById(childId).url,
            });
            if (res.data.status === 200) {
                const childInfo = res.data.data;
                setChildInfo({
                    firstName: childInfo.firstName,
                    lastName: childInfo.lastName,
                    dateOfBirth: formatDate(childInfo.dateOfBirth),
                    height: childInfo.height || 100,
                    weight: childInfo.weight || 25,
                    healthStatus: childInfo.healthStatus || 'Tốt',
                });
            } else {
                console.error('Failed to fetch child info', res.data.message);
            }
        } catch (error) {
            toast.error('Error fetching child information.');
            console.error(error);
        }
    };

    // Helper function to format the date for comparison
    const formatAttendanceDate = (attendance) => {
        return new Date(attendance.attendYear, attendance.attendMonth - 1, attendance.attendDay);
    };

    const tileClassName = ({ date, view }) => {
        if (view === 'month') {
            const startTime = childData?.class?.startTime ? new Date(childData.class.startTime) : null;
            const lastAttendanceDate = attendanceDays.length
                ? new Date(
                      attendanceDays[attendanceDays.length - 1].attendYear,
                      attendanceDays[attendanceDays.length - 1].attendMonth - 1,
                      attendanceDays[attendanceDays.length - 1].attendDay,
                  )
                : null;

            if (startTime && date < startTime) {
                return null;
            }

            if (
                attendanceDays.some((att) => {
                    const attDate = formatAttendanceDate(att);
                    return (
                        attDate.getFullYear() === date.getFullYear() &&
                        attDate.getMonth() === date.getMonth() &&
                        attDate.getDate() === date.getDate()
                    );
                })
            ) {
                return 'bg-green-200';
            }

            if (lastAttendanceDate && date < lastAttendanceDate) {
                return 'bg-pink-200';
            }
        }

        return null;
    };

    const handleWheel = (e) => {
        e.preventDefault();

        if (e.deltaY < 0) {
            setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 3));
        } else {
            setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 1));
        }
    };

    useEffect(() => {
        fetchHealthLogs(id);
        fetchChildData(id);
        fetchChildLearningData(id);
        fetchChildAttendanceData(id);
    }, [id]);

    useEffect(() => {
        if (healthLogsData.length > 0) {
            const lastFiveLogs = healthLogsData.slice(-5);
            const labels = lastFiveLogs.map((log) => {
                const date = new Date(log.createdAt);
                return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
            });
            const heightData = lastFiveLogs.map((log) => log.height);
            const weightData = lastFiveLogs.map((log) => log.weight);
            setChartDataWeight({
                labels: labels,
                datasets: [
                    {
                        label: 'Cân nặng (kg)',
                        data: weightData,
                        backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    },
                ],
            });

            setChartDataHeight({
                labels: labels,
                datasets: [
                    {
                        label: 'Chiều cao (cm)',
                        data: heightData,
                        backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    },
                ],
            });
        }
    }, [healthLogsData]);

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-3/4 bg-white p-6 shadow-md rounded-md">
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold mb-6">Tiến trình của trẻ</h2>
                        <div onClick={() => navigate(-1)} className="flex items-center gap-2 hover:text-">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#666666"
                                className="hover:fill-blue-500"
                            >
                                <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
                            </svg>
                            trở về trang thông tin trẻ
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="block font-semibold text-gray-600 mb-2">Họ và tên:</p>
                            <p className="w-full p-2 border border-gray-300 rounded-md">
                                {childInfo.firstName} {childInfo.lastName}
                            </p>
                        </div>
                        <div>
                            <p className="block font-semibold text-gray-600 mb-2">Ngày sinh:</p>
                            <p className="w-full p-2 border border-gray-300 rounded-md">{childInfo.dateOfBirth}</p>
                        </div>
                        {healthLogsData?.length > 0 ? (
                            <>
                                <div>
                                    <p className="block font-semibold text-gray-600 mb-2">Chiều cao(cm):</p>
                                    <p className="w-full p-2 border border-gray-300 rounded-md">
                                        {healthLogsData[healthLogsData?.length - 1]?.height}
                                    </p>
                                </div>
                                <div>
                                    <p className="block font-semibold text-gray-600 mb-2">Cân nặng(kg):</p>
                                    <p className="w-full p-2 border border-gray-300 rounded-md">
                                        {healthLogsData[healthLogsData?.length - 1]?.weight}
                                    </p>
                                </div>
                                <div className="mt-4">
                                    <p className="block font-semibold text-gray-600 mb-2">Ghi chú:</p>
                                    <p className="w-full p-2 border border-gray-300 rounded-md">
                                        {healthLogsData[healthLogsData?.length - 1]?.note}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p>Không có dữ liệu sức khoẻ.</p>
                        )}
                    </div>

                    <div className="mt-6">
                        <h3 className="text-xl font-bold mb-4">Biểu đồ chiều cao và cân nặng</h3>

                        <div className="flex">
                            {chartDataHeight && (
                                <div className="h-auto flex-1">
                                    <Bar
                                        data={chartDataHeight}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { position: 'top' },
                                                tooltip: { enabled: true },
                                            },
                                            scales: {
                                                x: {
                                                    title: {
                                                        display: true,
                                                        text: 'Ngày kiểm tra',
                                                        font: { weight: 'bold' },
                                                    },
                                                },
                                                y: {
                                                    title: { display: true, text: 'Giá trị', font: { weight: 'bold' } },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            )}
                            {chartDataWeight && (
                                <div className="h-auto flex-1">
                                    <Bar
                                        data={chartDataWeight}
                                        options={{
                                            responsive: true,
                                            plugins: {
                                                legend: { position: 'top' },
                                                tooltip: { enabled: true },
                                            },
                                            scales: {
                                                x: {
                                                    title: {
                                                        display: true,
                                                        text: 'Ngày kiểm tra',
                                                        font: { weight: 'bold' },
                                                    },
                                                },
                                                y: {
                                                    title: { display: true, text: 'Giá trị', font: { weight: 'bold' } },
                                                },
                                            },
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                        {healthLogsData?.length > 0 ? (
                            <>
                                <div className="mt-4">
                                    <p className="block font-semibold text-gray-600 mb-2">
                                        Nhận xét: Trẻ đã phát triển hơn so với lần đo trước:{' '}
                                        {(
                                            healthLogsData[healthLogsData?.length - 1]?.height -
                                            healthLogsData[healthLogsData?.length - 2]?.height
                                        ).toFixed(1)}{' '}
                                        cm và{' '}
                                        {(
                                            healthLogsData[healthLogsData?.length - 1]?.weight -
                                            healthLogsData[healthLogsData?.length - 2]?.weight
                                        ).toFixed(2)}{' '}
                                        kg
                                    </p>
                                    <p className="text-gray-600">
                                        (*)Nhận xét được đưa ra bởi kết quả của 2 lần đo gần nhất
                                    </p>
                                </div>
                            </>
                        ) : (
                            <p>Không có dữ liệu sức khoẻ.</p>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="">
                            <div>
                                <h3 className="text-xl font-bold mt-6 mb-4">Lớp của con</h3>
                                {childData.class ? (
                                    <div className="border border-gray-200 p-4 rounded-md mb-4">
                                        <p>
                                            <strong>Tên lớp:</strong> {childData.class?.name}
                                        </p>
                                        <p>
                                            <strong>Thời gian bắt đầu:</strong> {formatDate(childData.class?.startTime)}
                                        </p>
                                        <p>
                                            <strong>Thời gian kết thúc:</strong> {formatDate(childData.class?.endTime)}
                                        </p>
                                        <p>
                                            <strong>Giáo viên:</strong>
                                            <Link to={`/children/${id}/teacher`} className="font-bold text-gray-600">
                                                {`${childData.class?.teacher.firstName} ${childData.class?.teacher.lastName}`}
                                            </Link>
                                        </p>
                                        {rooms.find((room) => room._id === childData.class.room)?.cameraUrl && (
                                            <div>
                                                <button
                                                    onClick={handleOpenModal}
                                                    className="text-blue-600 hover:text-blue-800"
                                                >
                                                    Xem camera lớp học
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <p>Con bạn chưa tham gia lớp học.</p>
                                )}
                                {isModalOpen && (
                                    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
                                        <div className="bg-white p-5 rounded-lg shadow-lg w-3/4 max-w-4xl overflow-hidden">
                                            <div className="flex justify-end items-center">
                                                <button
                                                    onClick={handleCloseModal}
                                                    className="text-red-500 text-xl font-semibold"
                                                >
                                                    X
                                                </button>
                                            </div>
                                            <div className="flex justify-center mb-5" onWheel={handleWheel}>
                                                <img
                                                    src={
                                                        rooms.find((room) => room._id === childData.class.room)
                                                            ?.cameraUrl
                                                    }
                                                    alt="Camera view"
                                                    style={{
                                                        transform: `scale(${zoomLevel})`,
                                                        maxWidth: '100%',
                                                        maxHeight: '70vh',
                                                    }}
                                                    className="object-fill"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold mt-6 mb-4">Lớp kỹ năng của con</h3>
                                {childData.skill ? (
                                    <div className="border border-gray-200 p-4 rounded-md mb-4">
                                        <p>
                                            <strong>Tên lớp:</strong> {childData.skill?.name}
                                        </p>
                                        <p>
                                            <strong>Thời gian bắt đầu:</strong> {formatDate(childData.skill?.startTime)}
                                        </p>
                                        <p>
                                            <strong>Thời gian kết thúc:</strong> {formatDate(childData.skill?.endTime)}
                                        </p>
                                        <p>
                                            <strong>Giáo viên:</strong>{' '}
                                            <Link to={`/children/${id}/teacher`} className="font-bold text-gray-600">
                                                {`${childData.skill?.teacher.firstName} ${childData.skill?.teacher.lastName}`}
                                            </Link>
                                        </p>
                                    </div>
                                ) : (
                                    <p>Con bạn chưa tham gia lớp học kỹ năng.</p>
                                )}
                            </div>
                        </div>
                        <div className="mt-6">
                            <h3 className="text-xl font-bold mb-4">Lịch điểm danh</h3>
                            <Calendar className="w-full mb-5" tileClassName={tileClassName} />
                            <u>Ngày đi học có màu:</u>
                            <p className="w-5 h-5 bg-green-200"></p>
                            <u>Ngày không đi học có màu:</u>
                            <p className="w-5 h-5 bg-pink-200"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChildProgress;
