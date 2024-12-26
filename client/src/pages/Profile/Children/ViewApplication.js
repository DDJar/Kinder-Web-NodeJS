import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
//import Button from '~/components/Button';
import Accordion from '~/utils/Accordion';
import { toast } from 'react-toastify';
import axios from '~/config/configAxios';
import Sidebar from '../ProfileSidebar';
import { viewApplication, getRegisterByChildId } from '~/api/user';
import socketMessages from '~/config/configSocketEmit';
import { socket } from '~/services/socket';
import { useUserProvider } from '~/hooks/user/useUserProvider';
const ViewApplication = () => {
    const { user } = useUserProvider();
    const [formData, setFormData] = useState({});
    const [admissionData, setAdmissionData] = useState(null);
    const [timeData, setTimeData] = useState({
        day: '',
        month: '',
        year: '',
    });
    const { id } = useParams();
    useEffect(() => {
        fetchData();
    }, [id]);
    useEffect(() => {
        fetchAdmissionData();
    }, [formData]);
    useEffect(() => {
        let setTimeOutId = null;
        socket.emit(socketMessages.REGISTER_FOR_SCHOOL_JOIN_ROOM, 'registerSchool-123');
        socket.on(socketMessages.REGISTER_FOR_SCHOOL, (data) => {
            if (data.data.code === '00') {
                if (id === data.data.data.admissionId && user?._id === data.data.data.userId) {
                    setTimeOutId = setTimeout(() => {
                        fetchData();
                        fetchAdmissionData();
                    }, 1000);
                }
            }
        });
        return () => {
            clearTimeout(setTimeOutId);
            socket.emit(socketMessages.REGISTER_FOR_SCHOOL_LEAVE_ROOM, 'registerSchool-123');
            socket.off(socketMessages.REGISTER_FOR_SCHOOL);
        };
    }, [id, formData, user]);
    const fetchData = async () => {
        try {
            const res = await axios({
                method: viewApplication.method,
                url: viewApplication.url,
                withCredentials: true,
                params: { id },
            });
            if (res.data.status === 200) {
                const result = res.data.data;
                setFormData(result);

                const createdAt = new Date(result.createdAt);
                const addressParts = result.address?.split(',') || [];
                setTimeData({
                    day: createdAt.getUTCDate().toString().padStart(2, '0'),
                    month: (createdAt.getUTCMonth() + 1).toString().padStart(2, '0'),
                    year: createdAt.getUTCFullYear(),
                    city: addressParts[addressParts.length - 1]?.trim() || '',
                });
            }
        } catch (error) {
            toast.error(`Hiển thị thất bại: ${error.message}`, { autoClose: 3000 });
        }
    };
    const fetchAdmissionData = async () => {
        if (!formData?.children?._id) return;
        try {
            const response = await axios({
                method: getRegisterByChildId.method,
                url: getRegisterByChildId.url,
                params: { childId: formData.children._id },
            });
            setAdmissionData(response.data.data);
        } catch (error) {
            console.error('Đang tải...', error);
        }
    };
    return (
        <div className="w-full pb-10 relative flex">
            <Sidebar className="w-64 fixed left-0 top-0 bottom-0 bg-gray-800 p-4" />
            <div className="pt-10 gap-1">
                {admissionData && admissionData.status === 'REGISTER' && (
                    <h2 className="text-2xl mr-5 font-bold mb-4 text-end text-blue-500 bg-blue-100 py-2 px-4 rounded-full inline-block shadow-md absolute right-0 top-10">
                        Đang chờ xử lý
                    </h2>
                )}
                {admissionData && admissionData.status === 'ACCEPT' && (
                    <h2 className="text-2xl mr-5 font-bold mb-4 text-end text-green-500 bg-green-100 py-2 px-4 rounded-full inline-block shadow-md absolute right-0 top-10">
                        Đơn đã được duyệt
                    </h2>
                )}
                {admissionData && admissionData.status === 'REJECT' && (
                    <h2 className="text-2xl mr-5 font-bold mb-4 text-end text-red-500 bg-red-100 py-2 px-4 rounded-full inline-block shadow-md absolute right-0 top-10">
                        Đơn đã huỷ
                    </h2>
                )}
            </div>
            {Object.keys(formData).length > 0 ? (
                <div className="max-w-2xl mx-auto p-8 bg-white shadow-lg rounded-md mt-30">
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
                        <p className="text-bold">Hồ sơ: </p>
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
                </div>
            ) : (
                <p>Không có dữ liệu</p>
            )}
        </div>
    );
};

export default ViewApplication;
