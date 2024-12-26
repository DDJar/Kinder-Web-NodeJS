import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../ProfileSidebar';
import Accordion from '~/utils/Accordion';
import {
    getChildAll,
    createAdmissionApplication,
    updateAdmissionApplication,
    updateAdmissionDocument,
    getRegisterByChildId,
} from '~/api/user';
import axios from '~/config/configAxios';
import { setChildren } from '~/redux/action';
import Button from '~/components/Button';
import { toast } from 'react-toastify';
import { uploadImage } from '~/utils/uploadFile/uploadImage';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import Modal from '~/components/Modal';
import { SERVER_URL } from '~/config';

const RegisterSchool = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [showModal, setShowModal] = useState(false);
    const toggleModal = () => setShowModal(!showModal);
    const [startTimeError] = useState('');
    const [birthCer, setBirthCer] = useState(null);
    const [household, setHousehold] = useState('');
    const [health, setHealth] = useState('');
    const [healthInsu, setHealthInsu] = useState('');
    const [pysochology, setPysochology] = useState('');
    const [healthCheck, setHealthCheck] = useState('');
    const [birthCerError, setBirthCerError] = useState('');
    const [householdError, setHouseholdError] = useState('');
    const [errors, setError] = useState({});
    const { user } = useUserProvider();
    const navigate = useNavigate();
    const [isUpdating] = useState(false);
    const [isRegistering, setIsRegistering] = useState(true);
    const [admissionData, setAdmissionData] = useState(null);
    const [admissUpdate, setUpdate] = useState(null);
    const [isPhoneError, setIsPhoneError] = useState(false);
    const [isAddressError, setIsAddressError] = useState(false);
    const [childData, setChildData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        favourite: '',
        avatar: '',
        birthCertificate: '',
    });
    const [parentData, setParentData] = useState({
        firstName: '',
        lastName: '',
        phone: '',
        address: '',
        startTime: new Date().getFullYear(),
    });
    const formatDate = (dateString) => {
        if (!dateString) return '';

        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const isEligible = (dateOfBirth) => {
        if (!dateOfBirth) return false;

        const birthDate = new Date(dateOfBirth);
        const currentDate = new Date();

        const yearDifference = currentDate.getFullYear() - birthDate.getFullYear();
        const monthDifference = currentDate.getMonth() - birthDate.getMonth();
        const ageInMonths = yearDifference * 12 + monthDifference;
        return ageInMonths >= 18;
    };

    const fetchAdmissionData = async () => {
        try {
            const response = await axios({
                method: getRegisterByChildId.method,
                url: getRegisterByChildId.url,
                params: { childId: id },
            });
            setAdmissionData(response.data.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Error fetching data');
        }
    };
    const handleBirthCertChange = (e) => {
        setBirthCer(e.target.files[0]);
        if (e.target.files[0]) {
            setBirthCerError(false); // Xóa lỗi khi nhập đúng
        }
    };

    const handleHouseholdChange = (e) => {
        setHousehold(e.target.files[0]);
        if (e.target.files[0]) {
            setHouseholdError(false); // Xóa lỗi khi nhập đúng
        }
    };
    const TitleForm = {
        BIRTH_CER: 'BIRTH_CER',
        HEALTH_CHECK: 'HEALTH_CHECK',
        PSYCHOLOGICAL: 'PSYCHOLOGICAL',
        HEALTH_MONITORING: 'HEALTH_MONITORING',
        HOUSEHOLD_BOOK: 'HOUSEHOLD_BOOK',
        HEALTH_INSURANCE: 'HEALTH_INSURANCE',
    };
    const handleSubmit = async () => {
        let hasError = false;
        if (isRegistering) {
            if (!parentData.phone) {
                setIsPhoneError(true);
                setShowModal(false);
                toast.warning('Vui lòng quay lại trang cá nhân để cập nhật số điện thoại!');
                hasError = true;
            } else {
                setIsPhoneError('');
            }
            if (!parentData.address) {
                setIsAddressError(true);
                setShowModal(false);
                toast.warning('Vui lòng quay lại trang cá nhân để cập nhật địa chỉ!');
                hasError = true;
            } else {
                setIsAddressError('');
            }
            if (!birthCer) {
                setBirthCerError(true);
                setBirthCerError('Vui lòng upload giấy khai sinh');
                setShowModal(false);
                toast.warning('Vui lòng upload giấy khai sinh');
                hasError = true;
            } else {
                setBirthCerError(''); // Không đặt lỗi nếu có dữ liệu
            }

            if (!household) {
                setHouseholdError(true);
                setHouseholdError('Vui lòng upload sổ hộ khẩu');
                setShowModal(false);
                toast.warning('Vui lòng upload sổ hộ khẩu');
                hasError = true;
            } else {
                setHouseholdError('');
            }
        }

        if (hasError) return;

        try {
            console.log('Bắt đầu upload ảnh');
            const uploadPromises = [
                uploadImage(birthCer),
                uploadImage(household),
                uploadImage(health),
                uploadImage(healthInsu),
                uploadImage(pysochology),
                uploadImage(healthCheck),
            ];

            const [birthCerImgUrl, houseHoldImgUrl, healthImgUrl, healthIsuImgUrl, pysocholoImgUrl, healthCheckImgUrl] =
                await Promise.all(uploadPromises);

            console.log('Upload thành công:', birthCerImgUrl, houseHoldImgUrl);

            const newUploadedDocs = [
                { title: TitleForm.BIRTH_CER, img: birthCerImgUrl },
                { title: TitleForm.HOUSEHOLD_BOOK, img: houseHoldImgUrl },
                { title: TitleForm.HEALTH_MONITORING, img: healthImgUrl },
                { title: TitleForm.HEALTH_INSURANCE, img: healthIsuImgUrl },
                { title: TitleForm.PSYCHOLOGICAL, img: pysocholoImgUrl },
                { title: TitleForm.HEALTH_CHECK, img: healthCheckImgUrl },
            ];

            const apiPromises = newUploadedDocs.map((doc) =>
                axios
                    .post(`${SERVER_URL}/users/children/${id}/upload`, {
                        title: doc.title,
                        img: doc.img,
                        childId: id,
                    })
                    .then((response) => {
                        if (response.status !== 200) {
                            throw new Error(`Upload thất bại cho file: ${doc.title}`);
                        }
                    })
                    .catch((error) => {
                        console.error('Lỗi upload:', error);
                        toast.error(`Lỗi khi upload file: ${doc.title}`);
                        throw error;
                    }),
            );

            await Promise.all(apiPromises);

            console.log('Tất cả API upload hoàn thành');

            const registrationResponse = await axios({
                method: createAdmissionApplication.method,
                url: createAdmissionApplication.url,
                data: {
                    userId: user._id,
                    childId: id,
                    startTime: parentData.startTime,
                    docs: newUploadedDocs,
                },
            });

            if (registrationResponse.status === 200) {
                const { _id } = registrationResponse.data.data;

                const onClose = () => {
                    navigate(`/view-application/${_id}`);
                };
                onClose();

                setParentData({ ...parentData, startTime: '' });
                toggleModal();
            } else {
                toast.error('Không thể tạo đơn xin nhập học');
            }
        } catch (error) {
            console.error('Lỗi trong quá trình xử lý:', error);
            toast.error('Đã xảy ra lỗi khi gửi đơn');
        }
    };

    useEffect(() => {
        const fetchChild = async (childId) => {
            try {
                const { method, url } = getChildAll(childId);
                const res = await axios({ method, url });

                if (res.data.status === 200) {
                    const child = res.data.data.result.children;
                    const parent = res.data.data.result;
                    setChildData({
                        firstName: child.firstName,
                        lastName: child.lastName,
                        dateOfBirth: child.dateOfBirth,
                        favourite: child.favourite,
                        avatar: child.avatar,
                        docs: child.docs,
                    });
                    //setDocumentId(child.docs[0]._id);
                    setParentData({
                        firstName: parent.firstName,
                        lastName: parent.lastName,
                        phone: parent.phone,
                        address: parent.address,
                        startTime: parent.startTime,
                    });
                    dispatch(setChildren([child]));
                } else {
                    console.error('Failed to fetch child:', res.data.message);
                }
            } catch (error) {
                console.error('Error fetching child:', error);
            }
            await fetchAdmissionData();
        };

        if (id) {
            fetchChild(id);
        }
    }, [id, dispatch]);
    const handleUpdate = async (admissUpdate, status) => {
        console.log('Status received:', status);
        if (!childData) return;

        try {
            const updatePromises = childData.docs.map(async (doc) => {
                let updatedImg = doc.img;
                switch (doc.title) {
                    case TitleForm.BIRTH_CER:
                        updatedImg = birthCer ? await uploadImage(birthCer) : doc.img;
                        break;
                    case TitleForm.HOUSEHOLD_BOOK:
                        updatedImg = household ? await uploadImage(household) : doc.img;
                        break;
                    case TitleForm.HEALTH_MONITORING:
                        updatedImg = health ? await uploadImage(health) : doc.img;
                        break;
                    case TitleForm.HEALTH_INSURANCE:
                        updatedImg = healthInsu ? await uploadImage(healthInsu) : doc.img;
                        break;
                    case TitleForm.PSYCHOLOGICAL:
                        updatedImg = pysochology ? await uploadImage(pysochology) : doc.img;
                        break;
                    case TitleForm.HEALTH_CHECK:
                        updatedImg = healthCheck ? await uploadImage(healthCheck) : doc.img;
                        break;
                    default:
                        return;
                }
                if (updatedImg !== doc.img) {
                    const documentResponse = await axios({
                        method: updateAdmissionDocument.method,
                        url: updateAdmissionDocument.url,
                        data: {
                            documentId: doc._id,
                            title: doc.title,
                            img: updatedImg,
                            childId: id,
                        },
                    });
                    console.log('Admission document updated:', documentResponse.data);
                }
            });
            await Promise.all(updatePromises);
            const admissionResponse = await axios({
                method: updateAdmissionApplication.method,
                url: updateAdmissionApplication.url,
                data: {
                    childId: id,
                    status: status,
                },
            });
            setUpdate(admissionResponse.data);
            console.log(status);
            window.location.reload();
            toast.success('Cập nhật tài liệu và trạng thái thành công!');
        } catch (error) {
            console.error('Error updating admission data:', error);
            toast.error('Cập nhật không thành công');
        }
    };

    useEffect(() => {
        setIsRegistering(!isUpdating);
    }, [isUpdating]);

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-full h-full min-h-screen p-8 bg-white shadow-lg rounded-md">
                <h2 className="text-2xl font-bold mb-8 text-center">Đơn xin nhập học</h2>

                {/* Container chính: 2 cột */}
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Cột trái */}
                    <div className="w-full md:w-1/2 space-y-6">
                        <div>
                            <label htmlFor="parentName" className="block font-medium text-gray-600 mb-2">
                                Họ và tên phụ huynh:
                            </label>
                            <input
                                id="parentName"
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                type="text"
                                value={parentData ? `${parentData.firstName} ${parentData.lastName}` : ''}
                                disabled
                            />
                        </div>
                        <div>
                            <label htmlFor="childName" className="block font-medium text-gray-600 mb-2">
                                Họ và tên con:
                            </label>
                            <input
                                id="childName"
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                type="text"
                                value={`${childData.firstName} ${childData.lastName}`}
                                disabled
                            />
                        </div>
                        <div>
                            <label htmlFor="address" className="block font-medium text-gray-600 mb-2">
                                Địa chỉ:
                            </label>
                            <input
                                id="address"
                                className={`w-full p-2 border ${isAddressError ? 'border-red-500' : 'border-gray-300'} rounded-md bg-gray-100`}
                                type="text"
                                value={parentData.address}
                                disabled
                            />
                        </div>
                    </div>

                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="mb-6">
                            <label htmlFor="health" className="block font-medium text-gray-600 mb-2">
                                Số điện thoại:
                            </label>
                            <input
                                id="address"
                                className={`w-full p-2 border ${isPhoneError ? 'border-red-500' : 'border-gray-300'} rounded-md bg-gray-100`}
                                type="text"
                                value={parentData.phone || ''}
                                disabled
                            />
                        </div>
                        <div>
                            <label htmlFor="dateOfBirth" className="block font-medium text-gray-600 mb-2">
                                Ngày sinh của con:
                            </label>
                            <input
                                id="dateOfBirth"
                                className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                                type="text"
                                value={childData.dateOfBirth ? formatDate(childData.dateOfBirth) : ''}
                                disabled
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="startTime" className="block font-medium text-gray-600 mb-2">
                                Nhập năm học:
                            </label>
                            <select
                                id="startTime"
                                className="w-full p-2 border border-white-300 rounded-md bg-white-100"
                                value={parentData.startTime}
                                onChange={(e) => setParentData({ ...parentData, startTime: e.target.value })}
                            >
                                {Array.from({ length: 10 }, (_, i) => 2024 + i).map((year) => (
                                    <option key={year} value={year}>
                                        {year}
                                    </option>
                                ))}
                            </select>
                            {startTimeError && <p className="text-red-500">{startTimeError}</p>}
                        </div>
                    </div>
                </div>
                {childData.dateOfBirth && !isEligible(childData.dateOfBirth) ? (
                    <p className="text-center text-red-500 mt-10">
                        Hiện tại bạn chưa thể đăng kí đi học cho con mình vì chưa đủ 18 tháng!.
                    </p>
                ) : (
                    <>
                        <div>
                            <div className="flex flex-col items-start mt-20 ">
                                <div className="flex flex-col mb-10">
                                    <label htmlFor="birthCert" className="block font-medium text-gray-600 mb-2">
                                        Giấy khai sinh <span style={{ color: 'red' }}>*</span>:
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleBirthCertChange}
                                        style={{ borderColor: errors.birthCer ? 'red' : '' }}
                                        className="mr-2"
                                    />
                                    {isRegistering && birthCerError && (
                                        <p className="text-red-500 text-sm">{birthCerError}</p>
                                    )}
                                    {childData &&
                                        childData.docs &&
                                        childData.docs.some((doc) => doc.title === TitleForm.BIRTH_CER) &&
                                        (() => {
                                            const birthCertDoc = childData.docs.find(
                                                (doc) => doc.title === TitleForm.BIRTH_CER,
                                            );
                                            return birthCertDoc ? (
                                                <div className="mt-2">
                                                    <Accordion
                                                        key={birthCertDoc._id}
                                                        title={'Hình ảnh: '}
                                                        image={birthCertDoc.img}
                                                    />
                                                </div>
                                            ) : null; // Không hiển thị gì nếu không có hình ảnh
                                        })()}
                                </div>
                                <div style={{ marginBottom: '50px' }}></div>
                                <div className="flex flex-col mb-10">
                                    <label htmlFor="household" className="block font-medium text-gray-600 mb-2">
                                        Sổ hộ khẩu <span style={{ color: 'red' }}>*</span>:
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={handleHouseholdChange}
                                    />
                                    {isRegistering && householdError && (
                                        <p className="text-red-500 text-sm">{householdError}</p>
                                    )}
                                    {childData && childData.docs && (
                                        <>
                                            {childData.docs.some((doc) => doc.title === TitleForm.HOUSEHOLD_BOOK) &&
                                                (() => {
                                                    const householdDoc = childData.docs.find(
                                                        (doc) => doc.title === TitleForm.HOUSEHOLD_BOOK,
                                                    );
                                                    return householdDoc ? (
                                                        <div className="mt-2">
                                                            <Accordion
                                                                key={householdDoc._id}
                                                                title={'Hình ảnh: '}
                                                                image={householdDoc.img}
                                                            />
                                                        </div>
                                                    ) : null; // Không hiển thị gì nếu không có hình ảnh
                                                })()}
                                        </>
                                    )}
                                </div>
                                <div style={{ marginBottom: '50px' }}></div>
                                <div className="flex flex-col mb-10">
                                    <label htmlFor="healthCheck" className="block font-medium text-gray-600 mb-2">
                                        Theo dõi sức khoẻ:
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => setHealthCheck(e.target.files[0])}
                                        className="mr-2"
                                        style={{ borderColor: errors.healthCheck ? 'red' : '' }}
                                    />
                                    {childData &&
                                        childData.docs &&
                                        childData.docs.some((doc) => doc.title === TitleForm.HEALTH_CHECK) &&
                                        (() => {
                                            const healthCheckDoc = childData.docs.find(
                                                (doc) => doc.title === TitleForm.HEALTH_CHECK,
                                            );
                                            return healthCheckDoc ? (
                                                <div className="mt-2">
                                                    <Accordion
                                                        key={healthCheckDoc._id}
                                                        title={'Hình ảnh: '}
                                                        image={healthCheckDoc.img}
                                                    />
                                                </div>
                                            ) : null; // Không hiển thị gì nếu không có hình ảnh
                                        })()}
                                </div>
                                <div style={{ marginBottom: '50px' }}></div>
                                <div className="flex flex-col mb-10">
                                    <label htmlFor="health" className="block font-medium text-gray-600 mb-2">
                                        Giấy khám sức khỏe:
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => setHealth(e.target.files[0])}
                                        className="mr-2"
                                        style={{ borderColor: errors.health ? 'red' : '' }}
                                    />
                                    {childData &&
                                        childData.docs &&
                                        childData.docs.some((doc) => doc.title === TitleForm.HEALTH_MONITORING) &&
                                        (() => {
                                            const healthDoc = childData.docs.find(
                                                (doc) => doc.title === TitleForm.HEALTH_MONITORING,
                                            );
                                            return healthDoc ? (
                                                <div className="mt-2">
                                                    <Accordion
                                                        key={healthDoc._id}
                                                        title={'Hình ảnh: '}
                                                        image={healthDoc.img}
                                                    />
                                                </div>
                                            ) : null; // Không hiển thị gì nếu không có hình ảnh
                                        })()}
                                </div>
                                <div style={{ marginBottom: '50px' }}></div>
                                <div className="flex flex-col mb-10">
                                    <label htmlFor="healthInsu" className="block font-medium text-gray-600 mb-2">
                                        Bảo hiểm y tế:
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => setHealthInsu(e.target.files[0])}
                                        className="mr-2"
                                        style={{ borderColor: errors.healthInsu ? 'red' : '' }}
                                    />
                                    {childData &&
                                        childData.docs &&
                                        childData.docs.some((doc) => doc.title === TitleForm.HEALTH_INSURANCE) &&
                                        (() => {
                                            const healthInsuDoc = childData.docs.find(
                                                (doc) => doc.title === TitleForm.HEALTH_INSURANCE,
                                            );
                                            return healthInsuDoc ? (
                                                <div className="mt-2">
                                                    <Accordion
                                                        key={healthInsuDoc._id}
                                                        title={'Hình ảnh: '}
                                                        image={healthInsuDoc.img}
                                                    />
                                                </div>
                                            ) : null; // Không hiển thị gì nếu không có hình ảnh
                                        })()}
                                </div>
                                <div style={{ marginBottom: '50px' }}></div>
                                <div className="flex flex-col mb-10">
                                    {' '}
                                    <label htmlFor="pysochology" className="block font-medium text-gray-600 mb-2">
                                        {' '}
                                        Giấy chứng nhận tâm lý:
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => setPysochology(e.target.files[0])}
                                        className="mr-2"
                                        style={{ borderColor: errors.pysochology ? 'red' : '' }}
                                    />
                                    {childData &&
                                        childData.docs &&
                                        childData.docs.some((doc) => doc.title === TitleForm.PSYCHOLOGICAL) &&
                                        (() => {
                                            const psychologyDoc = childData.docs.find(
                                                (doc) => doc.title === TitleForm.PSYCHOLOGICAL,
                                            );
                                            return psychologyDoc ? (
                                                <div className="mt-2">
                                                    <Accordion
                                                        key={psychologyDoc._id}
                                                        title={'Hình ảnh: '}
                                                        image={psychologyDoc.img}
                                                    />
                                                </div>
                                            ) : null; // Không hiển thị gì nếu không có hình ảnh
                                        })()}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="mt-20 flex justify-center">
                                {childData.docs && childData.docs.length === 0 ? (
                                    <Button primary className="w-full md:w-auto" onClick={toggleModal}>
                                        Đăng ký
                                    </Button>
                                ) : (
                                    <>
                                        {admissionData && admissionData.status === 'ACCEPT' && (
                                            <Button
                                                primary
                                                className="w-full md:w-auto"
                                                onClick={() => handleUpdate(admissUpdate, 'ACCEPT')}
                                            >
                                                Cập nhật
                                            </Button>
                                        )}

                                        {admissionData && admissionData.status === 'REJECT' && (
                                            <Button
                                                primary
                                                className="w-full md:w-auto"
                                                onClick={() => handleUpdate(admissUpdate, 'REGISTER')}
                                            >
                                                Cập nhât
                                            </Button>
                                        )}
                                    </>
                                )}
                            </div>
                            <Modal
                                title="Xác nhận đăng kí"
                                _showModal={showModal}
                                onClick={toggleModal}
                                onClickAccept={async () => {
                                    toggleModal();
                                    await handleSubmit();
                                }}
                            >
                                Bạn có chắc chắn muốn gửi không?
                            </Modal>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
export default RegisterSchool;
