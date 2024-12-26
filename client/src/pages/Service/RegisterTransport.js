import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from '~/config/configAxios';
import { getChildren, createregistertransport } from '~/api/user';
import { setChildren } from '~/redux/action';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import Button from '~/components/Button';
import { toast } from 'react-toastify';
import Modal from '~/components/Modal';
import { useNavigate } from 'react-router-dom';
import { getClass } from '~/api/academies';

const RegisterTransport = () => {
    const currentYear = new Date().getFullYear();
    const dispatch = useDispatch();
    const { user } = useUserProvider();
    const children = useSelector((state) => state.children);
    const [selectedChild, setSelectedChild] = useState(null);
    const userId = user._id;
    const childId = selectedChild?._id;
    const [selectedDate, setSelectedDate] = useState('');
    const [isRegistering] = useState(true);
    const toggleModal = () => setShowModal(!showModal);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [data, setData] = useState(null);
    const [isDateError, setIsDateError] = useState(false);
    const [isAddressError, setIsAddressError] = useState(false);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const res = await axios({
                    method: getChildren.method,
                    url: getChildren.url,
                    params: { userId: user._id },
                });
                if (res.data.status === 200) {
                    dispatch(setChildren(res.data.data.children));
                    setData(res.data.data);
                } else {
                    console.error('Failed to fetch children', res.data.message);
                }
            } catch (error) {
                console.error('Error fetching children', error);
            }
        };

        fetchChildren();
    }, [dispatch, user._id]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const params = {};
                const res = await axios({
                    method: getClass.method,
                    url: getClass.url,
                    params: params,
                    withCredentials: true,
                });
                if (res.data.status === 200) {
                    const classesWithDates = res.data.data.map((classItem) => ({
                        ...classItem,
                        startTime: new Date(classItem.startTime),
                        endTime: new Date(classItem.endTime),
                    }));
                    setClasses(classesWithDates);
                    toast.success('Hiển thị thành công', {
                        autoClose: 1000,
                        closeOnClick: true,
                    });
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
        fetchData();
    }, [user]);

    const handleSelectChild = (event) => {
        const childId = event.target.value;
        const foundChild = children.find((child) => child._id === childId);
        setSelectedChild(foundChild || null);
    };

    const handleSubmit = async () => {
        if (isRegistering) {
            if (!data.address) {
                toast.warn('Vui lòng quay lại trang cá nhân để cập nhật địa chỉ!');
                setShowModal(false);
                setIsAddressError(true);
                return;
            }
            if (!childId) {
                toast.warn('Vui lòng chọn trẻ mà bạn muốn đăng kí!');
                return;
            }
            if (!selectedDate) {
                toast.warn('Chưa chọn thời gian sử dụng dịch vụ!');
                setShowModal(false);
                setIsDateError(true);
                return;
            }
        }
        try {
            const response = await axios({
                method: createregistertransport.method, // Should be 'POST'
                url: createregistertransport.url, // Should be a string
                data: {
                    userId,
                    childId,
                    startTime: selectedDate,
                    address: data.address,
                },
            });
            console.log({
                userId,
                childId,
                startTime: selectedDate,
                address: data.address,
            });

            if (response.data.status === 200) {
                toast.success('Đăng ký dịch vụ thành công!');
                console.log(response.data);
                navigate('/view-transport');
            } else {
                toast.error('Đăng kí thất bại!');
            }
        } catch (error) {
            console.error('Lỗi trong quá trình xử lý:', error);
            if (error.response) {
                console.error('Error response data:', error.response.data);
                toast.error(`Đã xảy ra lỗi: ${error.response.data.message || error.message}`);
            } else if (error.request) {
                console.error('No response received:', error.request);
                toast.error('Không nhận được phản hồi từ máy chủ.');
            } else {
                console.error('Error setting up request:', error.message);
                toast.error('Đã xảy ra lỗi khi gửi đơn.');
            }
        }
    };
    const handleMove = () => {
        navigate('/view-transport');
    };
    const handleDateChange = (e) => {
        const chosenDate = e.target.value;
        const today = new Date().toISOString().split('T')[0];

        if (chosenDate < today) {
            setIsDateError(true);
            return;
        }

        setSelectedDate(chosenDate);
        setIsDateError(false);
    };

    return (
        <div className="flex">
            <div className="w-full bg-white p-6 shadow-md rounded-md">
                <div className="flex justify-center items-center mb-4">
                    <h2 className="text-2xl font-bold">Đăng ký xe đưa đón</h2>
                </div>
                <div className="flex justify-start mt-20">
                    <Button primary onClick={handleMove}>
                        Xem lịch sử
                    </Button>
                </div>
                <div className="flex justify-center items-center">
                    <select
                        onChange={handleSelectChild}
                        className="mb-4 p-2 border border-gray-300 rounded-md w-1/4"
                        defaultValue=""
                    >
                        <option value="" disabled>
                            Chọn trẻ
                        </option>
                        {children.length === 0 ? (
                            <option disabled>Không có dữ liệu trẻ em</option>
                        ) : (
                            children
                                .filter((child) => {
                                    const yearOfBirth = new Date(child.dateOfBirth).getFullYear();
                                    const currentYear = new Date().getFullYear();
                                    const age = currentYear - yearOfBirth;

                                    return (
                                        Array.isArray(child.class) &&
                                        child.class.length > 0 &&
                                        child.class[0]?.classId &&
                                        age >= 4
                                    );
                                })
                                .map((child) => (
                                    <option key={child._id} value={child._id}>
                                        {`${child.firstName} ${child.lastName}`}
                                    </option>
                                ))
                        )}
                    </select>
                </div>
                {selectedChild ? (
                    <div className="bg-gray-100 p-4 rounded-lg shadow-md w-2/3 mx-auto pt-10">
                        <div className="ml-50">
                            <p>
                                <span className="font-bold">Tên trẻ: </span>
                                <span className="ml-30">{`${selectedChild.firstName} ${selectedChild.lastName}`}</span>
                            </p>
                            <p className="mt-10">
                                <span className="font-bold">Số tuổi: </span>
                                <span className="ml-30">
                                    {currentYear - new Date(selectedChild.dateOfBirth).getFullYear()} Tuổi
                                </span>
                            </p>
                            <p className="mt-10">
                                <span className="font-bold">Lớp: </span>
                                {selectedChild.class.length > 0 ? (
                                    selectedChild.class.map((classItem) => {
                                        const matchingClass = classes.find((cls) => cls._id === classItem.classId);
                                        return (
                                            <span key={classItem._id} className="ml-35">
                                                {matchingClass ? matchingClass.name : 'Chưa có thông tin'}
                                            </span>
                                        );
                                    })
                                ) : (
                                    <span className="ml-35">Chưa được xếp lớp</span>
                                )}
                            </p>
                            <div className="mb-6">
                                <label htmlFor="startTime" className="block font-bold mb-2 mt-10">
                                    Ngày bắt đầu sử dụng dịch vụ
                                    <span style={{ color: 'red', marginLeft: '2px' }}>*</span>:
                                </label>
                                <input
                                    type="date"
                                    id="startTime"
                                    className={`w-2/3 p-2 border ${isDateError ? 'border-red-500' : 'border-gray-300'} rounded-md bg-gray-100`}
                                    value={selectedDate}
                                    onChange={handleDateChange}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                                {isDateError && (
                                    <p className="text-red-500 text-sm mt-2">Không nhập ngày trong quá khứ!</p>
                                )}
                            </div>
                            {data && (
                                <div className="mb-6">
                                    <label htmlFor="address" className="block font-bold mb-2 mt-10">
                                        Địa chỉ:
                                        <span style={{ color: 'red', marginLeft: '2px' }}>*</span>:
                                    </label>
                                    <input
                                        id="address"
                                        className={`w-2/3 p-2 border ${isAddressError ? 'border-red-500' : 'border-gray-300'} rounded-md bg-gray-100`}
                                        type="text"
                                        value={data.address}
                                        disabled
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex justify-center mt-20">
                            {selectedChild.transportation && selectedChild.transportation.length > 0 ? (
                                <p className="text-green-600">Bạn đã đăng ký dịch vụ cho trẻ này.</p>
                            ) : (
                                <Button primary onClick={toggleModal}>
                                    Đăng ký
                                </Button>
                            )}
                        </div>
                        <div>
                            <Modal
                                title="Xác nhận đăng kí"
                                _showModal={showModal}
                                onClick={toggleModal}
                                onClickAccept={handleSubmit}
                            >
                                Bạn có chắc chắn muốn gửi không?
                            </Modal>
                        </div>
                    </div>
                ) : (
                    <p className="text-center text-gray-500">Vui lòng chọn trẻ mà bạn muốn đăng kí</p>
                )}
            </div>
        </div>
    );
};

export default RegisterTransport;
