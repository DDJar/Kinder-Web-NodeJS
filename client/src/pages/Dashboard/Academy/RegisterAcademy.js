import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckmarkCircle02Icon, UnavailableIcon, ViewIcon } from 'hugeicons-react';
import axios from '~/config/configAxios';
import { getRegisterClass } from '~/api/academy';
import { toast } from 'react-toastify';
import Button from '~/components/Button';
import Modal from '~/components/Modal';
import { getAcademyById } from '~/api/academies';
import { updateStatusAcademyById } from '~/api/user';
import { renderEmptyRows } from '~/utils/form';
import { socket } from '~/services/socket';
import socketMessages from '~/config/configSocketEmit';
function RegisterAcademy() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const [showModal, setShowModal] = useState(false);
    const tab = queryParams.get('tab') ? parseInt(queryParams.get('tab')) : 1;
    const [currentPage, setCurrentPage] = useState(tab);
    const [totalPages, setTotalPages] = useState(1);
    const [childRegist, setChildRegist] = useState([]);
    const [type, setType] = useState(queryParams.get('type') || 'class');
    const [detailAcademy, setDetailAcademy] = useState({});
    const [fromDetailAcademy, setFromDetailAcademy] = useState({});
    const [titleModal, setTitleModal] = useState({
        typeId: '',
        userId: '',
        childId: '',
    });
    useEffect(() => {
        fetchData();
    }, [type, currentPage]);
    useEffect(() => {
        let setTimeOutId = null;
        socket.emit(socketMessages.REGISTER_FOR_SCHOOL_JOIN_ROOM, 'registerSchool-123');
        socket.on(socketMessages.REGISTER_FOR_SCHOOL, (data) => {
            if (data.data.code === '00') {
                if (data.data.data.admissionId && data.data.data.userId) {
                    setTimeOutId = setTimeout(() => {
                        fetchData();
                    }, 1000);
                }
            }
        });
        return () => {
            clearTimeout(setTimeOutId);
            socket.emit(socketMessages.REGISTER_FOR_SCHOOL_LEAVE_ROOM, 'registerSchool-123');
            socket.off(socketMessages.REGISTER_FOR_SCHOOL);
        };
    }, [type, currentPage]);
    const fetchData = async () => {
        try {
            const data = {
                type: type,
                tab: currentPage,
            };
            const res = await axios({
                method: getRegisterClass.method,
                url: getRegisterClass.url,
                params: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                setChildRegist(res.data.data.result);
                setTotalPages(res.data.data.totalPages);
                setCurrentPage(tab);
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
    const handleTypeChange = (newType) => {
        setType(newType);
        setChildRegist('');
        navigate(`${location.pathname}?type=${newType}`, { replace: true });
    };
    const handlePageChange = async (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            navigate(`${location.pathname}?type=${type}&tab=${newPage}`, { replace: true });
        }
    };
    const toggleModal = () => {
        setShowModal(!showModal);
    };
    const handleConfirmModal = async (academyId, typeId, userId, childId, title) => {
        try {
            const data = {
                type: type,
                academyId: academyId,
            };
            const res = await axios({
                method: getAcademyById.method,
                url: getAcademyById.url,
                params: data,
            });
            if (res.data.status === 200) {
                setDetailAcademy(res.data.data);
                setFromDetailAcademy({
                    typeId: typeId,
                    userId: userId,
                    childId: childId,
                });
            }
            setTitleModal(title);
            toggleModal();
        } catch (error) {
            toast.update({
                render: `Hiển thị thất bại`,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                closeButton: true,
            });
        }
    };
    const handleSubmitRegister = async () => {
        let statusFrom = {};
        let title = {};
        if (titleModal === 'lớp') {
            statusFrom = 'ACTIVE';
            title = 'Xác nhận';
        } else {
            statusFrom = 'REJECT';
            title = 'Từ chối';
        }
        const id = toast.loading('Làm ơn đợi...');
        try {
            const data = {
                type: type,
                academyId: detailAcademy._id,
                status: statusFrom,
                id: fromDetailAcademy.typeId,
                tuition: detailAcademy.tuition,
                userId: fromDetailAcademy.userId,
                childId: fromDetailAcademy.childId,
            };
            const res = await axios({
                method: updateStatusAcademyById.method,
                url: updateStatusAcademyById.url,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                setDetailAcademy(res.data.data);
            }
            fetchData();
        } catch (error) {
            toast.update(id, {
                render: `${title} thất bại`,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                closeButton: true,
            });
            title = '';
        }
    };
    const handleFormSubmit = () => {
        handleSubmitRegister();
        toggleModal();
    };
    const handleReviewForm = (admissionApplicationId) => {
        navigate(`/dashboards/academy/review-register-class-children?admissionApplication=${admissionApplicationId}`);
    };
    return (
        <div>
            <h1>Trang xác nhận đăng ký học viên</h1>
            <div className="container">
                <div className="flex space-x-4 mb-4">
                    <Button
                        outlinePrimary={type !== 'class'}
                        disable={type === 'class'}
                        primary={type === 'class'}
                        onClick={() => handleTypeChange('class')}
                        roundedMd
                    >
                        Lớp học
                    </Button>
                    <Button
                        outlinePrimary={type !== 'skill'}
                        disable={type === 'skill'}
                        primary={type === 'skill'}
                        onClick={() => handleTypeChange('skill')}
                        roundedMd
                    >
                        Lớp kĩ năng
                    </Button>
                </div>
            </div>
            <div className="w-full">
                <div className="overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full min-h-100 text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th className="px-6 py-3 cursor-pointer text-center">STT</th>
                                <th className="px-6 py-3">Tên phụ huynh</th>
                                <th className="px-6 py-3">Tên trẻ</th>
                                <th className="px-6 py-3">Tuổi của trẻ</th>
                                {type === 'skill' ? <th className="px-6 py-3">Tên lớp</th> : <></>}

                                <th className="px-6 py-3">Chức năng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {childRegist.length === 0 ? (
                                <tr>
                                    <td colSpan="9" className="text-center">
                                        <div className="w-full justify-center flex">
                                            <h1 className="text-center">Danh sách rỗng</h1>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                childRegist.map((data, index) => (
                                    <tr
                                        key={data._id}
                                        className="bg-white  border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        {type === 'class' ? (
                                            <>
                                                {' '}
                                                <td className="px-3 py-4  text-center">
                                                    {index + 1 + (currentPage - 1) * 4}
                                                </td>
                                            </>
                                        ) : (
                                            <>
                                                {' '}
                                                <td className="px-3 py-4  text-center">
                                                    {index + 1 + (currentPage - 1) * 5}
                                                </td>
                                            </>
                                        )}

                                        <td className="px-10 py-2">
                                            {data.firstName} {data.lastName}
                                        </td>
                                        <td className="px-6 py-2">
                                            {data.childrenDetails.firstName} {data.childrenDetails.lastName}
                                        </td>
                                        <td className="px-8 py-2">
                                            {new Date(data.childrenDetails.dateOfBirth).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: '2-digit',
                                                day: '2-digit',
                                            })}
                                        </td>

                                        {type === 'skill' ? (
                                            <td className="px-10 py-2">{data.skillDetails.name}</td>
                                        ) : (
                                            <></>
                                        )}

                                        {type === 'class' ? (
                                            <td className="px-8 py-4">
                                                <div className="flex">
                                                    <Button
                                                        outlineInfo
                                                        className="mr-3"
                                                        onClick={() => handleReviewForm(data.admissionApplicationId)}
                                                        icon={
                                                            <ViewIcon size={24} color={'#223dec'} variant={'stroke'} />
                                                        }
                                                    ></Button>
                                                </div>
                                            </td>
                                        ) : (
                                            <td className="px-8 py-4">
                                                <div className="flex">
                                                    <Button
                                                        outlineInfo
                                                        className={'mr-3'}
                                                        icon={
                                                            <CheckmarkCircle02Icon
                                                                size={24}
                                                                color={'#223dec'}
                                                                variant={'stroke'}
                                                                onClick={() =>
                                                                    handleConfirmModal(
                                                                        data.skillDetails.skillId,
                                                                        data.skillDetails._id,
                                                                        data._id,
                                                                        data.childrenDetails._id,
                                                                        'lớp',
                                                                    )
                                                                }
                                                            />
                                                        }
                                                    ></Button>
                                                    <Button
                                                        outlineInfo
                                                        icon={
                                                            <UnavailableIcon
                                                                size={24}
                                                                color={'#e61010'}
                                                                variant={'stroke'}
                                                                onClick={() =>
                                                                    handleConfirmModal(
                                                                        data.skillDetails.skillId,
                                                                        data.skillDetails._id,
                                                                        data._id,
                                                                        data.childrenDetails._id,
                                                                        'hủy',
                                                                    )
                                                                }
                                                            />
                                                        }
                                                    ></Button>
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                ))
                            )}
                            {type === 'class' ? (
                                <> {childRegist.length > 0 && renderEmptyRows(5, childRegist.length, 4)}</>
                            ) : (
                                <> {childRegist.length > 0 && renderEmptyRows(5, childRegist.length, 5)}</>
                            )}
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
                                disable={currentPage === totalPages || childRegist.length < 3}
                                roundedMd
                            >
                                Trang sau
                            </Button>
                        </div>
                    </div>
                </div>
                <Modal
                    title={`Xác nhận ${titleModal} đăng ký`}
                    _showModal={showModal}
                    onClick={toggleModal}
                    onClickAccept={handleFormSubmit}
                >
                    <div key={detailAcademy._id}>
                        <div className="flex">
                            <p className="mb-0 pt-2 w-80">Lớp:</p>
                            <p className="mb-0 w-60 text-center pt-2">{detailAcademy.name}</p>
                        </div>
                        <div className="flex">
                            <p className="mb-0 pt-2 w-80">Số lượng của lớp:</p>
                            <p className="w-60 mb-0 pt-2 text-center">
                                {detailAcademy.availableSeats} / {detailAcademy.totalSeats}
                            </p>
                        </div>
                        <div className="flex">
                            <p className="mb-0 pt-2 w-80">Ngày bắt đầu học:</p>
                            <p className="mb-0 w-60 text-center pt-2">
                                {new Date(detailAcademy.startTime).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })}
                            </p>
                        </div>
                        <div className="flex">
                            <p className="mb-0 pt-2 w-80">Ngày kết thúc học:</p>
                            <p className="mb-0 w-60 text-center pt-2">
                                {new Date(detailAcademy.endTime).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                })}
                            </p>
                        </div>
                        <div className="flex">
                            <p className="mb-0 pt-2 w-80">Học phí:</p>
                            <p className=" mb-0 w-60 text-center pt-2">{detailAcademy.tuition}</p>
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
}

export default RegisterAcademy;
