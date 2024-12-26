import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Accordion from '~/utils/Accordion';
import Button from '~/components/Button';
import Sidebar from '../ProfileSidebar';
import { uploadImage } from '~/utils/uploadFile/uploadImage';
import { updateChildren, getChildById, getRegisterByChildId, updateAdmissionDocument } from '~/api/user';
import axios from '~/config/configAxios';
import { reget } from '~/utils/validate';
import { toast } from 'react-toastify';
import { setChildren } from '~/redux/action';

const ChildrenDetail = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [birthCer, setBirthCer] = useState(null);
    const [household, setHousehold] = useState('');
    const [health, setHealth] = useState('');
    const [healthInsu, setHealthInsu] = useState('');
    const [pysochology, setPysochology] = useState('');
    const [healthCheck, setHealthCheck] = useState('');

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        favourite: '',
        avatar: '',
        docs: [],
    });
    const [admissionData, setAdmissionData] = useState(null);

    const [errors, setErrors] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };
    const handleClick = () => {
        navigate(`/children/${id}/register`);
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
            console.log(err);
        }
    };

    const fetchChild = async (childId) => {
        try {
            const res = await axios({
                method: getChildById(childId).method,
                url: getChildById(childId).url,
            });
            if (res.data.status === 200) {
                const childData = res.data.data;
                console.log('childData', childData);
                setFormData({
                    firstName: childData.firstName,
                    lastName: childData.lastName,
                    dateOfBirth: formatDate(childData.dateOfBirth),
                    favourite: childData.favourite,
                    avatar: childData.avatar,
                    docs: childData.docs,
                });
                dispatch(setChildren([childData]));
            } else {
                console.error('Failed to fetch child', res.data.message);
            }
        } catch (error) {
            console.error('Error fetching child', error);
        }
    };

    useEffect(() => {
        fetchChild(id);
        fetchAdmissionData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = async (e) => {
        const { files } = e.target;
        const file = files[0];
        if (file) {
            try {
                const url = await uploadImage(file);
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    avatar: url,
                }));
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.error('Failed to upload avatar.');
            }
        }
    };

    const validate = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-zÀÁÂÃÈÉÊÌÍÎÏÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíîïòóôõùúăđĩũơƯĂẠ-ỹ\s'-]+$/i;

        if (!formData.firstName.match(nameRegex)) {
            newErrors.firstName = 'Họ không được chứa ký tự đặc biệt hoặc số.';
        }
        if (!formData.lastName.match(nameRegex)) {
            newErrors.lastName = 'Tên không được chứa ký tự đặc biệt hoặc số.';
        }
        const birthDate = new Date(formData.dateOfBirth);
        const currentDate = new Date();
        const ageDifference = currentDate.getFullYear() - birthDate.getFullYear();
        const isDateValid =
            ageDifference > 1 ||
            (ageDifference === 1 &&
                (currentDate.getMonth() > birthDate.getMonth() ||
                    (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate())));

        if (!isDateValid) {
            newErrors.dateOfBirth = 'Trẻ phải từ 1 tuổi trở lên.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleUpdate = async () => {
        if (!formData) return;

        try {
            const updatePromises = formData.docs.map(async (doc) => {
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
            window.location.reload();
        } catch (error) {
            console.error('Error updating admission data:', error);
            toast.error('Cập nhật không thành công');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        const updatedData = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.dateOfBirth,
            favourite: formData.favourite,
            avatar: formData.avatar,
        };

        // Log the data for debugging
        console.log('Updated Data:', updatedData);

        const toastId = toast.loading('Please wait...');

        try {
            const response = await axios({
                method: updateChildren(id).method,
                url: updateChildren(id).url,
                data: updatedData,
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            });

            if (response.data.status === 200) {
                dispatch(setChildren(response.data.data.child));
                toast.update(toastId, {
                    render: 'Cập nhật thông tin thành công',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
                setIsEditing(false);
            } else {
                toast.update(toastId, {
                    render: `Cập nhật thông tin thất bại: ${response.data.message}`,
                    type: 'error',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            toast.update(toastId, {
                render: `Cập nhật thông tin thất bại: ${error.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                closeButton: true,
            });
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
    // Function to navigate to the child's development page
    const navigateToDevelopment = () => {
        navigate(`/child/${id}/child-progress`);
    };
    const handleView = () => {
        navigate(`/view-application/${admissionData._id}`);
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-3/4 h-full bg-white p-6 shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4">
                    {isEditing ? 'Cập nhật thông tin con' : 'Chi tiết thông tin con'}
                </h2>
                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col items-center mb-4">
                            <button
                                type={'button'}
                                className="rounded-full w-24 h-24 mb-4"
                                onClick={() => document.getElementById('avatarInput').click()}
                            >
                                <img src={formData.avatar} alt="Child Avatar" className="rounded-full w-full h-full" />
                            </button>
                            <input
                                type={'file'}
                                id="avatarInput"
                                name="avatar"
                                onChange={handleFileChange}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className="flex flex-col md:flex-row mb-4">
                            <div className="md:w-1/2 md:mr-2">
                                <label className="block font-medium text-gray-600 mb-2" htmlFor="firstName">
                                    Họ:
                                </label>
                                <input
                                    className={`w-full p-2 border border-gray-300 rounded-md ${
                                        errors.firstName ? 'border-red-500' : ''
                                    }`}
                                    type={'text'}
                                    id="firstName"
                                    name="firstName"
                                    value={reget(formData.firstName)}
                                    onChange={handleChange}
                                />
                                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                            </div>
                            <div className="md:w-1/2 md:ml-2">
                                <label className="block font-medium text-gray-600 mb-2" htmlFor="lastName">
                                    Tên:
                                </label>
                                <input
                                    className={`w-full p-2 border border-gray-300 rounded-md ${
                                        errors.lastName ? 'border-red-500' : ''
                                    }`}
                                    type={'text'}
                                    id="lastName"
                                    name="lastName"
                                    value={reget(formData.lastName)}
                                    onChange={handleChange}
                                />
                                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                            </div>
                        </div>
                        <div className="flex flex-col md:flex-row mb-4">
                            <div className="md:w-1/2 md:mr-2">
                                <label className="block font-medium text-gray-600 mb-2" htmlFor="dateOfBirth">
                                    Ngày sinh:
                                </label>
                                <input
                                    className={`w-full p-2 border border-gray-300 rounded-md ${
                                        errors.dateOfBirth ? 'border-red-500' : ''
                                    }`}
                                    type={'date'}
                                    id="dateOfBirth"
                                    name="dateOfBirth"
                                    value={formData.dateOfBirth}
                                    onChange={handleChange}
                                />
                                {errors.dateOfBirth && (
                                    <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
                                )}
                            </div>
                        </div>
                        <div className="mb-4">
                            <label className="block font-medium text-gray-600 mb-2" htmlFor="favourite">
                                Ghi chú về trẻ:
                            </label>
                            <input
                                className="w-full p-2 border border-gray-300 rounded-md"
                                type={'text'}
                                id="favourite"
                                name="favourite"
                                value={formData.favourite}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="mt-6">
                            <p className="font-semibold text-gray-600">Hồ sơ: </p>
                            <div className="flex flex-col mb-10">
                                <label htmlFor="health" className="block font-medium text-gray-600 mb-2">
                                    Giấy khai sinh:
                                </label>
                                <div className="border-b mt-4">
                                    <div className="w-1/2 p-2 border border-gray-300 rounded-md bg-gray-100 mb-5">
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => setBirthCer(e.target.files[0])}
                                            className="mr-2"
                                            style={{ borderColor: errors.birthcerDoc ? 'red' : '' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col mb-10">
                                <label htmlFor="health" className="block font-medium text-gray-600 mb-2">
                                    Giấy khám sức khoẻ:
                                </label>
                                <div className="border-b mt-4">
                                    <div className="w-1/2 p-2 border border-gray-300 rounded-md bg-gray-100 mb-5">
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => setHealth(e.target.files[0])}
                                            className="mr-2"
                                            style={{ borderColor: errors.healthCheckDoc ? 'red' : '' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col mb-10">
                                <label htmlFor="health" className="block font-medium text-gray-600 mb-2">
                                    Phiếu khám tâm lí:
                                </label>
                                <div className="border-b mt-4">
                                    <div className="w-1/2 p-2 border border-gray-300 rounded-md bg-gray-100 mb-5">
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => setPysochology(e.target.files[0])}
                                            className="mr-2"
                                            style={{ borderColor: errors.psychologicalDoc ? 'red' : '' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col mb-10">
                                <label htmlFor="health" className="block font-medium text-gray-600 mb-2">
                                    Theo dõi sức khoẻ:
                                </label>
                                <div className="border-b mt-4">
                                    <div className="w-1/2 p-2 border border-gray-300 rounded-md bg-gray-100 mb-5">
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => setHealthCheck(e.target.files[0])}
                                            className="mr-2"
                                            style={{ borderColor: errors.healthMonotorDoc ? 'red' : '' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col mb-10">
                                <div className="border-b mt-4">
                                    <label htmlFor="health" className="block font-medium text-gray-600 mb-2">
                                        Sổ hộ khẩu:
                                    </label>
                                    <div className="w-1/2 p-2 border border-gray-300 rounded-md bg-gray-100 mb-5">
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => setHousehold(e.target.files[0])}
                                            className="mr-2"
                                            style={{ borderColor: errors.householdBookDoc ? 'red' : '' }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col mb-10">
                                <div className="border-b mt-4">
                                    <label htmlFor="health" className="block font-medium text-gray-600 mb-2">
                                        Bảo hiểm y tế:
                                    </label>
                                    <div className="w-1/2 p-2 border border-gray-300 rounded-md bg-gray-100 mb-5">
                                        <input
                                            type="file"
                                            accept="image/*,application/pdf"
                                            onChange={(e) => setHealthInsu(e.target.files[0])}
                                            className="mr-2"
                                            style={{ borderColor: errors.healthInsu ? 'red' : '' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-start">
                            <Button primary onClick={() => setIsEditing(false)}>
                                Hủy
                            </Button>
                            <Button
                                onClick={async (e) => {
                                    await handleUpdate();
                                    await handleSubmit(e);
                                }}
                                className="mx-5"
                                primary
                                type="button"
                            >
                                Lưu
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="flex flex-col items-center mb-4">
                            <img
                                src={`${formData.avatar}`}
                                alt="Child Avatar"
                                className="rounded-full object-cover w-24 h-24"
                            />
                        </div>
                        <div className="flex flex-col md:flex-row mb-4 mt-10">
                            <div className="md:w-1/2 md:mr-2">
                                <p className="block font-semibold text-gray-600 mb-2">Họ và tên:</p>
                                <p className="w-full p-2 border border-gray-300 rounded-md">
                                    {formData.firstName} {formData.lastName}
                                </p>
                            </div>
                            <div className="md:w-1/2 md:mr-2">
                                <p className="block font-semibold text-gray-600 mb-2">Ngày sinh:</p>
                                <p className="w-full p-2 border border-gray-300 rounded-md">{formData.dateOfBirth}</p>
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="block font-semibold text-gray-600 mb-2">Ghi chú về trẻ:</p>
                            {formData?.favourite && (
                                <p className="w-full p-2 border border-gray-300 rounded-md">{formData.favourite}</p>
                            )}
                        </div>
                        <div className="mt-6">
                            <p className="font-semibold text-gray-600">Hồ sơ: </p>
                            <div className="flex flex-col mb-10">
                                <div className="border-b mt-4">
                                    {formData.docs.some((doc) => doc.title === 'BIRTH_CER') ? (
                                        (() => {
                                            const birthcerDoc = formData.docs.find((doc) => doc.title === 'BIRTH_CER');
                                            return birthcerDoc ? (
                                                <Accordion
                                                    key={birthcerDoc._id}
                                                    title={<span className="font-normal">Giấy khai sinh:</span>}
                                                    image={birthcerDoc.img}
                                                />
                                            ) : (
                                                <div className="flex">
                                                    <div className="font-normal">Giấy khai sinh:</div>
                                                    <p className="ml-1">Không có</p>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="flex">
                                            <div className="font-normal">Giấy khai sinh:</div>
                                            <p className="ml-1">Không có</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col mb-10">
                                <div className="border-b mt-4">
                                    {formData.docs.some((doc) => doc.title === 'HEALTH_CHECK') ? (
                                        (() => {
                                            const healthCheckDoc = formData.docs.find(
                                                (doc) => doc.title === 'HEALTH_CHECK',
                                            );
                                            return healthCheckDoc ? (
                                                <Accordion
                                                    key={healthCheckDoc._id}
                                                    title={<span className="font-normal">Giấy khám sức khỏe:</span>}
                                                    image={healthCheckDoc.img}
                                                />
                                            ) : (
                                                <div className="flex">
                                                    <div className="font-normal">Giấy khám sức khỏe:</div>
                                                    <p className="ml-1">Không có</p>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="flex">
                                            <div className="font-normal">Giấy khám sức khỏe:</div>
                                            <p className="ml-1">Không có</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col mb-10">
                                <div className="border-b mt-4">
                                    {formData.docs.some((doc) => doc.title === 'PSYCHOLOGICAL') ? (
                                        (() => {
                                            const psychologicalDoc = formData.docs.find(
                                                (doc) => doc.title === 'PSYCHOLOGICAL',
                                            );
                                            return psychologicalDoc ? (
                                                <Accordion
                                                    key={psychologicalDoc._id}
                                                    title={<span className="font-normal">Phiếu khám tâm lí:</span>}
                                                    image={psychologicalDoc.img}
                                                />
                                            ) : (
                                                <div className="flex">
                                                    <div className="font-normal">Phiếu khám tâm lí:</div>
                                                    <p className="ml-1">Không có</p>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="flex">
                                            <div className="font-normal">Phiếu khám tâm lí:</div>
                                            <p className="ml-1">Không có</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col mb-10">
                                <div className="border-b mt-4">
                                    {formData.docs.some((doc) => doc.title === 'HEALTH_MONITORING') ? (
                                        (() => {
                                            const healthMonotorDoc = formData.docs.find(
                                                (doc) => doc.title === 'HEALTH_MONITORING',
                                            );
                                            return healthMonotorDoc ? (
                                                <Accordion
                                                    key={healthMonotorDoc._id}
                                                    title={<span className="font-normal">Theo dõi sức khỏe:</span>}
                                                    image={healthMonotorDoc.img}
                                                />
                                            ) : (
                                                <div className="flex">
                                                    <div className="font-normal">Theo dõi sức khỏe:</div>
                                                    <p className="ml-1">Không có</p>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="flex">
                                            <div className="font-normal">Theo dõi sức khỏe:</div>
                                            <p className="ml-1">Không có</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col mb-10">
                                <div className="border-b mt-4">
                                    {formData.docs.some((doc) => doc.title === 'HOUSEHOLD_BOOK') ? (
                                        (() => {
                                            const householdBookDoc = formData.docs.find(
                                                (doc) => doc.title === 'HOUSEHOLD_BOOK',
                                            );
                                            return householdBookDoc ? (
                                                <Accordion
                                                    key={householdBookDoc._id}
                                                    title={<span className="font-normal">Sổ hộ khẩu:</span>}
                                                    image={householdBookDoc.img}
                                                />
                                            ) : (
                                                <div className="flex">
                                                    <div className="font-normal">Sổ hộ khẩu:</div>
                                                    <p className="ml-1">Không có</p>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="flex">
                                            <div className="font-normal">Sổ hộ khẩu:</div>
                                            <p className="ml-1">Không có</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col mb-10">
                                <div className="border-b mt-4">
                                    {formData.docs.some((doc) => doc.title === 'HEALTH_INSURANCE') ? (
                                        (() => {
                                            const healthInsuranceDoc = formData.docs.find(
                                                (doc) => doc.title === 'HEALTH_INSURANCE',
                                            );
                                            return healthInsuranceDoc ? (
                                                <Accordion
                                                    key={healthInsuranceDoc._id}
                                                    title={<span className="font-normal">Bảo hiểm y tế:</span>}
                                                    image={healthInsuranceDoc.img}
                                                />
                                            ) : (
                                                <div className="flex">
                                                    <div className="font-normal">Bảo hiểm y tế:</div>
                                                    <p className="ml-1">Không có</p>
                                                </div>
                                            );
                                        })()
                                    ) : (
                                        <div className="flex">
                                            <div className="font-normal">Bảo hiểm y tế:</div>
                                            <p className="ml-1">Không có</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 flex justify-between items-center">
                            <div className="flex justify-start">
                                {admissionData &&
                                (admissionData.status === 'REGISTER' || admissionData.status === 'ACCEPT') ? (
                                    <Button primary onClick={handleView}>
                                        Xem đơn đăng kí
                                    </Button>
                                ) : (
                                    <Button primary onClick={handleClick}>
                                        Đăng kí học
                                    </Button>
                                )}
                                <Button className="mx-5" primary onClick={() => setIsEditing(true)}>
                                    Chỉnh sửa
                                </Button>
                            </div>
                            <div>
                                <Button primary className="flex justify-end" onClick={navigateToDevelopment}>
                                    Xem tiến trình của trẻ
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default ChildrenDetail;
