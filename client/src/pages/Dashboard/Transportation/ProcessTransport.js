import React, { useEffect, useState } from 'react';
import axios from '~/config/configAxios';
import { getAllTransport, updateregistertransport } from '~/api/user';
import { toast } from 'react-toastify';
import { getClass } from '~/api/academies';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import { ViewIcon } from 'hugeicons-react';
import socketMessages from '~/config/configSocketEmit';
import { socket } from '~/services/socket';

const AllTransport = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applications, setApplications] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedApp, setSelectedApp] = useState(null);
    const [openReviewModal, setOpenReviewModal] = useState(false);
    const handleReviewForm = (appId) => {
        const app = filteredApplications.find((application) => application._id === appId);
        setSelectedApp(app);
        setOpenReviewModal(true);
    };

    const toggleReviewModal = (show) => {
        setOpenReviewModal(show);
    };
    const [context, setContext] = useState('');
    const [openModalId, setOpenModalId] = useState(null);
    const [filter, setFilter] = useState('REGISTER');

    const filteredApplications = Array.isArray(applications)
        ? filter === 'ALL'
            ? applications
            : applications.filter((app) => app.status === filter)
        : [];

    const handleUpdate = async (app, status) => {
        if (app && app._id) {
            try {
                const formData = {
                    userId: app.userId._id,
                    childId: app.childId._id,
                    address: app.address,
                    startTime: app.startTime,
                    status,
                    noteByStaff: context,
                    id: app._id,
                };
                const res = await axios({
                    method: updateregistertransport.method,
                    url: updateregistertransport.url,
                    data: formData,
                });

                if (res.status === 200) {
                    window.location.reload();
                    toast.success('Cập nhật thành công', {
                        closeOnClick: true,
                    });
                } else {
                    console.error('Lỗi từ server:', res.data.message);
                    toast.error(`Cập nhật thất bại: ${res.data.message}`, {
                        closeOnClick: true,
                    });
                }
            } catch (error) {
                console.error('Lỗi khi cập nhật:', error);
                toast.error(`Lỗi khi cập nhật: ${error.message}`, {
                    closeOnClick: true,
                });
            }
        } else {
            console.error('app._id không tồn tại:', app);
        }
    };

    useEffect(() => {
        fetchTransport();
    }, []);

    // Fetch classes data
    useEffect(() => {
        fetchData();
    }, []);
    useEffect(() => {
        let setTimeOutId = null;
        socket.emit(socketMessages.REGISTER_FOR_TRANSPORT_JOIN_ROOM, 'registerTransport-123');
        socket.on(socketMessages.REGISTER_FOR_TRANSPORT, (data) => {
            if (data.data.code === '00') {
                if (data.data.data.admissionId && data.data.data.userId) {
                    setTimeOutId = setTimeout(() => {
                        fetchData();
                        fetchTransport();
                    }, 1000);
                }
            }
        });
        return () => {
            clearTimeout(setTimeOutId);
            socket.emit(socketMessages.REGISTER_FOR_TRANSPORT_LEAVE_ROOM, 'registerTransport-123');
            socket.off(socketMessages.REGISTER_FOR_TRANSPORT);
        };
    }, []);
    const fetchTransport = async () => {
        setLoading(true);
        try {
            const res = await axios({
                method: getAllTransport.method,
                url: getAllTransport.url,
            });

            if (res.status === 200) {
                setApplications(res.data.applications);
            } else {
                setError('Failed to fetch transportation applications');
                toast.error('Hiển thị thất bại');
            }
        } catch (error) {
            setError('Error fetching transportation applications');
            console.error('Error fetching transportation applications', error);
            toast.error('Lỗi khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };
    const fetchData = async () => {
        try {
            const res = await axios({
                method: getClass.method,
                url: getClass.url,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                const classesWithDates = res.data.data.map((classItem) => ({
                    ...classItem,
                    startTime: new Date(classItem.startTime),
                    endTime: new Date(classItem.endTime),
                }));
                setClasses(classesWithDates);
            } else {
                console.error('error');
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
    const toggleModal = (appId) => {
        setOpenModalId((prevId) => (prevId === appId ? null : appId));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="container pb-10 mx-auto">
            <h2 className="text-center text-3xl font-semibold mb-6 pt-10 pb-10">Danh sách đơn đăng kí xe đưa đón</h2>

            <div className="flex space-x-4 mb-4">
                <Button
                    outlinePrimary={filter !== 'REGISTER'}
                    enable={filter === 'REGISTER'}
                    primary={filter === 'REGISTER'}
                    onClick={() => setFilter('REGISTER')}
                    roundedMd
                >
                    Đang xử lí
                </Button>
                <Button
                    outlinePrimary={filter !== 'ACCEPT'}
                    enable={filter === 'ACCEPT'}
                    primary={filter === 'ACCEPT'}
                    onClick={() => setFilter('ACCEPT')}
                    roundedMd
                >
                    Đã phê duyệt
                </Button>
                <Button
                    outlinePrimary={filter !== 'CANCEL'}
                    enable={filter === 'CANCEL'}
                    primary={filter === 'CANCEL'}
                    onClick={() => setFilter('CANCEL')}
                    roundedMd
                >
                    Đã huỷ
                </Button>
            </div>
            <table className="w-full min-h-100 text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th className="p-4">
                            <div className="flex items-center">
                                <></>
                            </div>
                        </th>
                        <th className="px-6 py-3">Tên phụ huynh</th>
                        <th className="px-6 py-3">Tên trẻ</th>
                        <th className="px-6 py-3">Tuổi của trẻ</th>
                        <th className="px-6 py-3">Tên lớp</th>
                        <th className="px-6 py-3">Chức năng</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredApplications.length === 0 ? (
                        <tr>
                            <td colSpan="6" className="text-center">
                                <div className="w-full justify-center flex">
                                    <h1 className="text-center">Chưa có đơn đăng ký nào</h1>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        filteredApplications.map((app) => (
                            <tr
                                key={app._id}
                                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                <td className="w-4 p-4">
                                    <></>
                                </td>
                                <td className="px-10 py-2">
                                    {app.userId
                                        ? `${app.userId.firstName || ''} ${app.userId.lastName || ''}`.trim()
                                        : 'Chưa có thông tin'}
                                </td>
                                <td className="px-6 py-2">
                                    {app.childId
                                        ? `${app.childId.firstName || ''} ${app.childId.lastName || ''}`.trim()
                                        : 'Chưa có thông tin'}
                                </td>
                                <td className="px-8 py-2">
                                    {app.childId?.class?.length > 0
                                        ? app.childId.class.map((classItem) => {
                                              const matchedClass = classes.find((c) => c._id === classItem.classId);
                                              return matchedClass ? matchedClass.condition : 'Chưa có thông tin';
                                          })
                                        : 'Không có lớp học'}
                                </td>
                                <td className="px-8 py-2">
                                    {app.childId?.class?.length > 0
                                        ? app.childId.class.map((classItem) => {
                                              const matchedClass = classes.find((c) => c._id === classItem.classId);
                                              return matchedClass ? matchedClass.name : 'Lớp không xác định';
                                          })
                                        : 'Không có lớp học'}
                                </td>
                                <td className="px-6 py-3">
                                    <div className="flex items-center">
                                        <Button
                                            outlineInfo
                                            className="mr-3"
                                            onClick={() => handleReviewForm(app._id)}
                                            icon={<ViewIcon size={24} color="#223dec" variant="stroke" />}
                                        />
                                        <div className="flex justify-center ml-5 gap-2">
                                            {app.status === 'REGISTER' ? (
                                                <>
                                                    <Button success primary onClick={() => toggleModal(app._id)}>
                                                        Phê duyệt
                                                    </Button>
                                                    <Button error primary onClick={() => handleUpdate(app, 'CANCEL')}>
                                                        Từ chối
                                                    </Button>
                                                </>
                                            ) : app.status === 'ACCEPT' ? (
                                                <Button primary onClick={() => toggleModal(app._id)}>
                                                    Cập nhật
                                                </Button>
                                            ) : (
                                                <></>
                                            )}
                                        </div>
                                        <Modal
                                            title="Ghi chú"
                                            _showModal={openModalId === app._id}
                                            onClick={() => toggleModal(app._id)}
                                            onClickAccept={() => handleUpdate(app, 'ACCEPT')}
                                        >
                                            <div>
                                                <textarea
                                                    className="w-full h-32 p-2 border border-gray-300 rounded-md"
                                                    placeholder="Nhập nội dung nếu thấy cần thiết..."
                                                    value={context}
                                                    onChange={(e) => setContext(e.target.value)}
                                                />
                                            </div>
                                        </Modal>
                                        {openReviewModal && (
                                            <Modal
                                                title="Chi tiết đơn đăng ký"
                                                _showModal={openReviewModal}
                                                onClick={() => toggleReviewModal(false)}
                                                onClickAccept={() => toggleReviewModal(false)}
                                            >
                                                <div className="text-gray-600 space-y-2">
                                                    <p>
                                                        <strong className="font-medium text-gray-700">
                                                            Tên phụ huynh:
                                                        </strong>{' '}
                                                        {selectedApp.userId
                                                            ? `${selectedApp.userId.firstName || ''} ${selectedApp.userId.lastName || ''}`.trim()
                                                            : 'N/A'}
                                                    </p>
                                                    <p>
                                                        <strong className="font-medium text-gray-700">Tên trẻ:</strong>{' '}
                                                        {selectedApp.childId
                                                            ? `${selectedApp.childId.firstName || ''} ${selectedApp.childId.lastName || ''}`.trim()
                                                            : 'N/A'}
                                                    </p>
                                                    <p>
                                                        <strong className="font-medium text-gray-700">
                                                            Trạng thái:
                                                        </strong>{' '}
                                                        <span
                                                            className={`inline-block px-2 py-1 text-sm rounded-full ${
                                                                selectedApp.status === 'ACCEPT'
                                                                    ? 'bg-green-100 text-green-700'
                                                                    : selectedApp.status === 'CANCEL'
                                                                      ? 'bg-red-100 text-red-700'
                                                                      : 'bg-blue-100 text-blue-700'
                                                            }`}
                                                        >
                                                            {selectedApp.status === 'ACCEPT'
                                                                ? 'Đã phê duyệt'
                                                                : selectedApp.status === 'CANCEL'
                                                                  ? 'Đã huỷ'
                                                                  : 'Đang xử lý'}
                                                        </span>
                                                    </p>
                                                    <p>
                                                        <strong className="font-medium text-gray-700">Lớp học:</strong>
                                                        {selectedApp.childId?.class &&
                                                            selectedApp.childId.class.map((classItem) => {
                                                                const matchedClass = classes.find(
                                                                    (c) => c._id === classItem.classId,
                                                                );
                                                                return matchedClass
                                                                    ? matchedClass.name
                                                                    : 'Lớp không xác định';
                                                            })}
                                                    </p>
                                                    <p>
                                                        <strong className="font-medium text-gray-700">
                                                            Ngày sử dụng dịch vụ:
                                                        </strong>{' '}
                                                        {selectedApp.startTime
                                                            ? new Date(selectedApp.startTime).toLocaleDateString(
                                                                  'vi-VN',
                                                              )
                                                            : 'N/A'}
                                                    </p>
                                                    <p>
                                                        <strong className="font-medium text-gray-700">Địa chỉ:</strong>{' '}
                                                        {selectedApp.address || 'Không có địa chỉ'}
                                                    </p>
                                                    <p>
                                                        <strong className="font-medium text-gray-700">
                                                            Ghi chú từ nhân viên:
                                                        </strong>{' '}
                                                        {selectedApp.noteByStaff || 'Chưa có ghi chú'}
                                                    </p>
                                                    <p>
                                                        <strong className="font-medium text-gray-700">
                                                            Thời gian đăng kí:
                                                        </strong>{' '}
                                                        {selectedApp.createdAt
                                                            ? new Date(selectedApp.createdAt).toLocaleDateString(
                                                                  'vi-VN',
                                                              )
                                                            : 'N/A'}
                                                    </p>
                                                    <p>
                                                        <strong className="font-medium text-gray-700">
                                                            Thời gian cập nhật:
                                                        </strong>{' '}
                                                        {selectedApp.updatedAt
                                                            ? new Date(selectedApp.updatedAt).toLocaleDateString(
                                                                  'vi-VN',
                                                              )
                                                            : 'N/A'}
                                                    </p>
                                                </div>
                                            </Modal>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default AllTransport;
