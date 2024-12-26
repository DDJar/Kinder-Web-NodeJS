import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import Accordion from '~/utils/Accordion';
import { toast } from 'react-toastify';
import axios from '~/config/configAxios';
import { findChildrenRegisterByAdnissionId, processChildrenRegister } from '~/api/user';
import Modal from '~/components/Modal';
const ProcessRegister = () => {
    const [formData, setFormData] = useState({});
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const admissionApplicationId = queryParams.get('admissionApplication');
    const [timeData, setTimeData] = useState({
        day: '',
        month: '',
        year: '',
    });
    const [showModal, setShowModal] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [context, setContext] = useState('');
    useEffect(() => {
        fetchData();
    }, []);
    const fetchData = async () => {
        try {
            const res = await axios({
                method: findChildrenRegisterByAdnissionId(admissionApplicationId).method,
                url: findChildrenRegisterByAdnissionId(admissionApplicationId).url,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                setFormData(res.data.data.result);
                const createdAt = res.data.data.result.createdAt;
                const dateObj = new Date(createdAt);
                const day = dateObj.getUTCDate().toString().padStart(2, '0');
                const month = (dateObj.getUTCMonth() + 1).toString().padStart(2, '0');
                const year = dateObj.getUTCFullYear().toString();
                const addressParts = res.data.data.result.address.split(',');
                const city = addressParts[addressParts.length - 1].trim();
                setTimeData({
                    day: day,
                    month: month,
                    year: year,
                    city,
                });
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
    const toggleModal = (title) => {
        setModalTitle(title);
        setShowModal(!showModal);
    };
    const handleConfirm = async () => {
        let statusFrom = {};
        if (modalTitle === 'Xác nhận') {
            statusFrom = 'ACCEPT';
        } else {
            statusFrom = 'REJECT';
        }
        const data = {
            admissionApplicationId: admissionApplicationId,
            status: statusFrom,
            noteByStaff: context,
        };
        const id = toast.loading('Làm ơn đợi...');
        try {
            const res = await axios({
                method: processChildrenRegister.method,
                url: processChildrenRegister.url,
                data: data,
                withCredentials: true,
            });
            if (res.data.status === 200) {
                toast.update(id, {
                    render: `${modalTitle} thành công`,
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
                navigate('/dashboards/academy/registed-academy');
            } else {
                toast.warning(id, {
                    render: `${modalTitle} xảy ra lỗi. Vui lòng thử lại sau!!!!`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        } catch (error) {
            toast.update(id, {
                render: `${modalTitle} thất bại`,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                closeButton: true,
            });
        }
    };
    const handleFormSubmit = () => {
        handleConfirm(modalTitle);
        toggleModal();
    };
    const handleBack = () => {
        navigate(`/dashboards/academy/registed-academy`);
    };
    return (
        <div className="w-full">
            <div className="flex">
                <Button text onClick={handleBack} className="text-2xl pt-0">
                    <h1 className="text-2xl font-bold mb-4 text-start text-cyan-600"> Trở về</h1>
                </Button>
                <h1 className="text-2xl font-bold mb-4 text-start">/Thông Tin Đăng Ký</h1>
            </div>
            {Object.keys(formData).length > 0 ? (
                <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-md">
                    <div className="justify-items-center">
                        <img src="/logo.png" className="rounded-lg opacity-70 object-cover w-50" alt="logoAvt" />
                        <div>
                            <h4>ĐƠN XIN NHẬP HỌC</h4>
                        </div>
                    </div>

                    <div className="flex space-x-6">
                        <div className="w-32 h-48 bg-gray-100 border border-gray-300 rounded-md">
                            {formData.children?.avatar ? (
                                <img
                                    src={formData.children.avatar}
                                    alt="Child"
                                    className="w-full h-full object-cover rounded-md"
                                />
                            ) : (
                                <img
                                    src="/img/default-avt.png"
                                    alt="User Avt"
                                    className="w-full h-full object-cover rounded-md"
                                />
                            )}
                        </div>
                        <div className=" flex-1 space-y-2 text-center  flex items-center">
                            <h5> Kính gửi: BAN GIÁM HIỆU TRƯỜNG MẦM NON</h5>
                        </div>
                    </div>
                    <div className="flex-1 space-y-4 mt-10">
                        <div className="flex justify-between">
                            <div>
                                <span className="font-semibold">Chúng tôi là phụ huynh bé: </span>
                                <span>
                                    {formData.children?.firstName} {formData.children?.lastName}
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold">Tuổi của bé: </span>
                                <span>
                                    {new Date().getFullYear() - new Date(formData.children?.dateOfBirth).getFullYear()}{' '}
                                    tuổi
                                </span>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <div>
                                <span className="font-semibold">Địa Chỉ: </span>
                                <span>{formData.address}</span>
                            </div>
                            <div>
                                <span className="font-semibold">Điện Thoại: </span>
                                <span>{formData.phone}</span>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <p>Xin ban giám hiệu cho con tôi được nhập học</p>
                            <div>
                                <span className="font-semibold">Năm học: </span>
                                <span>{formData.startTime}</span> - <span>{formData.startTime + 1}</span>
                            </div>
                        </div>
                        <p>
                            Tôi đã đọc kỹ và hiểu rõ các nội quy nhà trường. Gia đình chúng tôi cam kết thực hiện theo
                            đúng nội quy này.
                        </p>
                        <p>Xin cảm ơn.</p>
                        <p className="text-end">
                            {timeData.city}, ngày {timeData.day} tháng {timeData.month} năm {timeData.year}.
                        </p>
                        <p className="text-center ml-90">
                            {formData.firstName} {formData.lastName}
                        </p>
                    </div>

                    <div className="mt-6">
                        <p>Hồ sơ: </p>
                        <div className="border-b ">
                            <div className="flex justify-between w-full py-2 text-left">
                                <span className="font-semibold flex ">
                                    <div>
                                        {formData.children?.docs.some((doc) => doc.title === 'BIRTH_CER') ? (
                                            (() => {
                                                const householdBookDoc = formData.children?.docs.find(
                                                    (doc) => doc.title === 'BIRTH_CER',
                                                );
                                                return householdBookDoc.img ? (
                                                    <Accordion
                                                        key={householdBookDoc._id}
                                                        title={'Giấy khai sinh: '}
                                                        image={householdBookDoc.img}
                                                    />
                                                ) : (
                                                    <div className="flex">
                                                        <div>Giấy khai sinh:</div>
                                                        <p className="ml-1">Không có</p>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="flex">
                                                <div>Giấy khai sinh:</div>
                                                <p className="ml-1">Không có</p>
                                            </div>
                                        )}
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div className="border-b ">
                            <div className="flex justify-between w-full py-2 text-left">
                                <span className="font-semibold flex ">
                                    <div>
                                        {formData.children?.docs.some((doc) => doc.title === 'HOUSEHOLD_BOOK') ? (
                                            (() => {
                                                const householdBookDoc = formData.children?.docs.find(
                                                    (doc) => doc.title === 'HOUSEHOLD_BOOK',
                                                );
                                                return householdBookDoc.img ? (
                                                    <Accordion
                                                        key={householdBookDoc._id}
                                                        title={'Hộ Khẩu: '}
                                                        image={householdBookDoc.img}
                                                    />
                                                ) : (
                                                    <div className="flex">
                                                        <div>Hộ Khẩu: </div>
                                                        <p className="ml-1">Không có</p>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="flex">
                                                <div>Hộ Khẩu: </div>
                                                <p className="ml-1">Không có</p>
                                            </div>
                                        )}
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div className="border-b ">
                            <div className="flex justify-between w-full py-2 text-left">
                                <span className="font-semibold flex ">
                                    <div>
                                        {formData.children?.docs.some((doc) => doc.title === 'HEALTH_CHECK') ? (
                                            (() => {
                                                const healthCheckDoc = formData.children?.docs.find(
                                                    (doc) => doc.title === 'HEALTH_CHECK',
                                                );
                                                return healthCheckDoc.img ? (
                                                    <Accordion
                                                        key={healthCheckDoc._id}
                                                        title={'Giấy khám sức khỏe'}
                                                        image={healthCheckDoc.img}
                                                    />
                                                ) : (
                                                    <div className="flex">
                                                        <div>Giấy khám sức khỏe:</div>
                                                        <p className="ml-1">Không có</p>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="flex">
                                                <div>Giấy khám sức khỏe:</div>
                                                <p className="ml-1">Không có</p>
                                            </div>
                                        )}
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div className="border-b ">
                            <div className="flex justify-between w-full py-2 text-left">
                                <span className="font-semibold flex ">
                                    <div>
                                        {formData.children?.docs.some((doc) => doc.title === 'PSYCHOLOGICAL') ? (
                                            (() => {
                                                const psychologicalDoc = formData.children?.docs.find(
                                                    (doc) => doc.title === 'PSYCHOLOGICAL',
                                                );
                                                return psychologicalDoc.img ? (
                                                    <Accordion
                                                        key={psychologicalDoc._id}
                                                        title={'Phiếu khám tâm lý: '}
                                                        image={psychologicalDoc.img}
                                                    />
                                                ) : (
                                                    <div className="flex">
                                                        <div>Phiếu khám tâm lý: </div>
                                                        <p className="ml-1">Không có</p>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="flex">
                                                <div>Phiếu khám tâm lý: </div>
                                                <p className="ml-1">Không có</p>
                                            </div>
                                        )}
                                    </div>
                                </span>
                            </div>
                        </div>
                        <div className="border-b ">
                            <div className="flex justify-between w-full py-2 text-left">
                                <span className="font-semibold flex ">
                                    <div>
                                        {formData.children?.docs.some((doc) => doc.title === 'HEALTH_MONITORING') ? (
                                            (() => {
                                                const healthMonotorDoc = formData.children?.docs.find(
                                                    (doc) => doc.title === 'HEALTH_MONITORING',
                                                );
                                                return healthMonotorDoc.img ? (
                                                    <Accordion
                                                        key={healthMonotorDoc._id}
                                                        title={'Theo dõi sức khỏe: '}
                                                        image={healthMonotorDoc.img}
                                                    />
                                                ) : (
                                                    <div className="flex">
                                                        <div>Theo dõi sức khỏe: </div>
                                                        <p className="ml-1">Không có</p>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="flex">
                                                <div>Theo dõi sức khỏe: </div>
                                                <p className="ml-1">Không có</p>
                                            </div>
                                        )}
                                    </div>
                                </span>
                            </div>
                        </div>

                        <div className="border-b ">
                            <div className="flex justify-between w-full py-2 text-left">
                                <span className="font-semibold flex ">
                                    <div>
                                        {formData.children?.docs.some((doc) => doc.title === 'HEALTH_INSURANCE') ? (
                                            (() => {
                                                const healthInsuranceDoc = formData.children?.docs.find(
                                                    (doc) => doc.title === 'HEALTH_INSURANCE',
                                                );
                                                return healthInsuranceDoc.img ? (
                                                    <Accordion
                                                        key={healthInsuranceDoc._id}
                                                        title={'Bảo hiểm y tế: '}
                                                        image={healthInsuranceDoc.img}
                                                    />
                                                ) : (
                                                    <div className="flex">
                                                        <div>Bảo hiểm y tế: </div>
                                                        <p className="ml-1">Không có</p>
                                                    </div>
                                                );
                                            })()
                                        ) : (
                                            <div className="flex">
                                                <div>Bảo hiểm y tế: </div>
                                                <p className="ml-1">Không có</p>
                                            </div>
                                        )}
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end space-x-4">
                        <Button success primary onClick={() => toggleModal('Xác nhận')} roundedMd>
                            Xác nhận
                        </Button>
                        <Button error primary onClick={() => toggleModal('Từ chối')} roundedMd>
                            Từ chối
                        </Button>
                    </div>
                </div>
            ) : (
                <p>Lỗi đường đẫn không đúng. Vui lòng chọn lại</p>
            )}
            <Modal
                title={`Nội dung ${modalTitle}`}
                _showModal={showModal}
                onClick={toggleModal}
                onClickAccept={handleFormSubmit}
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
        </div>
    );
};

export default ProcessRegister;
