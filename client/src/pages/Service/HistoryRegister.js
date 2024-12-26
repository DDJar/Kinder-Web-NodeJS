import React, { useEffect, useState } from 'react';
import axios from '~/config/configAxios';
import { getAllTransportationApplications, updateregistertransport } from '~/api/user';
import { GetDriverById } from '~/api/transportation';
import { toast } from 'react-toastify';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import Sidebar from '~/pages/Profile/ProfileSidebar';
import { socket } from '~/services/socket';
import socketMessages from '~/config/configSocketEmit';

const HistoryRegister = () => {
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useUserProvider();
    const [applications, setApplications] = useState([]);
    const [driverDetails, setDriverDetails] = useState({});
    const [openModalId, setOpenModalId] = useState(null);
    const toggleModal = (appId) => {
        setOpenModalId((prevId) => (prevId === appId ? null : appId));
    };
    const [filter, setFilter] = useState('REGISTER');

    const handleCancel = async (app) => {
        if (app && app._id) {
            try {
                const formData = {
                    userId: app.userId._id,
                    childId: app.childId._id,
                    address: app.address,
                    startTime: app.startTime,
                    status: 'CANCEL',
                    noteByStaff: '',
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
        let setTimeOutId = null;
        socket.emit(socketMessages.REGISTER_FOR_TRANSPORT_JOIN_ROOM, 'registerTransport-123');
        socket.on(socketMessages.REGISTER_FOR_TRANSPORT, (data) => {
            if (data.data.code === '00') {
                if (user._id === data.data.data.userId) {
                    setTimeOutId = setTimeout(() => {
                        fetchTransport();
                        fetchTransportationAndDriver();
                    }, 1000);
                }
            }
        });
        return () => {
            clearTimeout(setTimeOutId);
            socket.emit(socketMessages.REGISTER_FOR_TRANSPORT_LEAVE_ROOM, 'registerTransport-123');
            socket.off(socketMessages.REGISTER_FOR_TRANSPORT);
        };
    }, [user._id]);
    useEffect(() => {
        fetchTransport();
    }, [user._id]);

    useEffect(() => {
        if (!applications || applications.length === 0) return;
        fetchTransportationAndDriver();
    }, [applications]);
    const fetchTransport = async () => {
        try {
            const res = await axios({
                method: getAllTransportationApplications.method,
                url: getAllTransportationApplications.url,
                params: { userId: user._id },
            });

            if (res.data.applications && res.data.applications.length > 0) {
                setApplications(res.data.applications);
            } else {
                setApplications([]);
            }
        } catch (error) {
            console.error(error);
            setApplications([]);
        } finally {
            setLoading(false);
        }
    };
    const fetchTransportationAndDriver = async () => {
        try {
            const acceptedApplications = applications.filter((app) => app.status === 'ACCEPT');
            const driverDetailsByChildId = await Promise.all(
                acceptedApplications.flatMap(
                    (app) =>
                        app.childId?.transportation?.map(async (transport) => {
                            if (!transport.transportationId) {
                                console.warn('Không có transportationId:', transport);
                                return null;
                            }
                            const res = await axios({
                                method: GetDriverById.method,
                                url: GetDriverById.url,
                                params: { id: transport.transportationId },
                            });
                            if (res.status === 200) {
                                return {
                                    childId: app.childId._id,
                                    driverDetail: res.data.data,
                                };
                            } else {
                                console.error(
                                    'Failed to fetch driver details for transportationId:',
                                    transport.transportationId,
                                );
                                return null;
                            }
                        }) || [],
                ),
            );
            const driverDetailsMap = driverDetailsByChildId.reduce((acc, driverDetail) => {
                if (driverDetail) {
                    acc[driverDetail.childId] = driverDetail.driverDetail;
                }
                return acc;
            }, {});

            setDriverDetails(driverDetailsMap);
        } catch (error) {
            console.error(error);
            setError('Error fetching driver applications');
        } finally {
            setLoading(false);
        }
    };
    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    const filteredApplications = Array.isArray(applications)
        ? filter === 'ALL'
            ? applications
            : applications.filter((app) => app.status === filter)
        : [];

    return (
        <div className="pb-10 flex">
            <Sidebar className=" w-1/4" />
            <div className="w-3/4 ml-1/4 pl-8 bg-white">
                <h2 className="text-center text-3xl font-semibold mb-6 pt-10 pb-10">Lịch sử đăng ký dịch vụ</h2>
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
                <div className="grid gap-4">
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
                            <div
                                key={app._id}
                                className="border p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow bg-white w-full"
                            >
                                <div className="grid grid-cols-3 gap-1">
                                    <div className="ml-25">
                                        <h3 className="text-lg font-semibold mb-2">
                                            <strong>Tên trẻ: </strong>
                                        </h3>
                                        <p>
                                            <strong>Tên phụ huynh:</strong>
                                        </p>
                                        <p>
                                            <strong>Địa chỉ:</strong>
                                        </p>
                                        <p>
                                            <strong>Trạng thái đơn:</strong>
                                        </p>
                                        <p>
                                            <strong>Ngày đăng kí:</strong>
                                        </p>
                                        <p>
                                            <strong>Ngày bắt đầu sử dụng:</strong>
                                        </p>
                                        <p>
                                            <strong>Tên tài xế:</strong>
                                        </p>
                                        <p>
                                            <strong>Số điện thoại tài xế:</strong>
                                        </p>
                                        <p>
                                            <strong>Tên xe:</strong>
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-semibold mb-2">
                                            <span>
                                                {app.childId
                                                    ? `${app.childId.firstName || ''} ${app.childId.lastName || ''}`.trim()
                                                    : 'Chưa có thông tin'}
                                            </span>
                                        </h3>
                                        <p>
                                            <span>
                                                {app.userId
                                                    ? `${app.userId.firstName || ''} ${app.userId.lastName || ''}`.trim()
                                                    : 'Chưa có thông tin'}
                                            </span>
                                        </p>
                                        <p>
                                            <span className="w-full">{app.address || 'Không có thông tin'}</span>
                                        </p>
                                        <p>
                                            <span>
                                                {app.status === 'REGISTER' ? (
                                                    <span style={{ color: 'blue' }}>Đang xử lý</span>
                                                ) : app.status === 'ACCEPT' ? (
                                                    <span style={{ color: 'green' }}>Đã phê duyệt</span>
                                                ) : app.status === 'CANCEL' ? (
                                                    <span style={{ color: 'red' }}>Đã huỷ</span>
                                                ) : (
                                                    app.status
                                                )}
                                            </span>
                                        </p>
                                        <p>
                                            <span>{new Date(app.createdAt).toLocaleDateString('vi-VN')}</span>
                                        </p>
                                        <p>
                                            <span>{new Date(app.startTime).toLocaleDateString('vi-VN')}</span>
                                        </p>
                                        {app.status == 'ACCEPT' && driverDetails[app.childId._id] ? (
                                            <>
                                                <p>
                                                    {driverDetails[app.childId._id].driverId?.firstName &&
                                                    driverDetails[app.childId._id].driverId?.lastName
                                                        ? `${driverDetails[app.childId._id].driverId.firstName} ${driverDetails[app.childId._id].driverId.lastName}`
                                                        : 'Chưa có thông tin'}
                                                </p>
                                            </>
                                        ) : (
                                            <p>Chưa có thông tin</p>
                                        )}
                                        {app.status == 'ACCEPT' && driverDetails[app.childId._id] ? (
                                            <>
                                                <p>
                                                    {driverDetails[app.childId._id].driverId?.phone
                                                        ? driverDetails[app.childId._id].driverId.phone
                                                        : 'Chưa có thông tin'}
                                                </p>
                                            </>
                                        ) : (
                                            <p>Chưa có thông tin</p>
                                        )}
                                        {app.status == 'ACCEPT' && driverDetails[app.childId._id] ? (
                                            <>
                                                <p>
                                                    {driverDetails[app.childId._id].name
                                                        ? driverDetails[app.childId._id].name
                                                        : 'Đang xếp'}
                                                </p>
                                            </>
                                        ) : (
                                            <p>Chưa có thông tin</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex justify-end ml-5">
                                    {app.status === 'REGISTER' && (
                                        <div className="flex justify-center ml-5">
                                            <Button error primary onClick={() => toggleModal(app._id)}>
                                                Huỷ đăng kí
                                            </Button>
                                            <Modal
                                                title="Xác nhận đăng kí"
                                                _showModal={openModalId === app._id}
                                                onClick={() => toggleModal(app._id)}
                                                onClickAccept={() => handleCancel(app)}
                                            >
                                                Bạn có chắc chắn muốn gửi không?
                                            </Modal>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryRegister;
