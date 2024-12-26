import React, { useState, useEffect } from 'react';
import { updateProfile, getProfile } from '~/api/user';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import Sidebar from './ProfileSidebar';
import Button from '~/components/Button';
import axios from '~/config/configAxios';
import { reget } from '~/utils/validate';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import provincesData from 'hanhchinhvn/dist/tinh_tp.json';
import districtsData from 'hanhchinhvn/dist/quan_huyen.json';
import communesData from 'hanhchinhvn/dist/xa_phuong.json';

const Profile = () => {
    const { user, updateProfile: updateUserInContext } = useUserProvider();

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        address: '',
        phone: '',
        role: 'USER',
        addressDetail: '',
    });

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [communes, setCommunes] = useState([]);

    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [selectedCommune, setSelectedCommune] = useState({ code: '', name: '' });

    const [errors, setErrors] = useState({});
    const [editMode, setEditMode] = useState(false);

    const fetchProfile = async () => {
        try {
            const res = await axios({
                method: getProfile.method,
                url: getProfile.url,
            });
            if (res.status === 200) {
                const userData = res.data.data;
                console.log('userData', userData);

                const [street, commune, district, province] = userData.address
                    ? userData.address.split(',').map((part) => part.trim())
                    : ['', '', '', ''];
                setFormData({
                    firstName: userData.firstName || '',
                    lastName: userData.lastName || '',
                    email: userData.email || '',
                    address: userData.address || '',
                    phone: userData.phone || '',
                    role: userData.role || 'USER',
                    addressDetail: street || '',
                });

                const provincesArray = Object.values(provincesData);
                setProvinces(provincesArray);
                const foundProvince = provincesArray.find((p) => p.name === province);
                if (foundProvince) {
                    setSelectedProvince(foundProvince);
                    const filteredDistricts = Object.values(districtsData).filter(
                        (d) => d.parent_code === foundProvince.code,
                    );
                    setDistricts(filteredDistricts);

                    const foundDistrict = filteredDistricts.find((d) => d.name === district);
                    if (foundDistrict) {
                        setSelectedDistrict(foundDistrict);
                        const filteredCommunes = Object.values(communesData).filter(
                            (c) => c.parent_code === foundDistrict.code,
                        );
                        setCommunes(filteredCommunes);
                        const foundCommune = filteredCommunes.find((c) => c.name === commune);
                        if (foundCommune) {
                            setSelectedCommune(foundCommune);
                        }
                    }
                }
            } else {
                console.error('Failed to fetch profile', res.data.message || 'Unknown error');
            }
        } catch (error) {
            console.error('Error fetching profile', error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (user._id) {
            fetchProfile();
        }
    }, [user._id]);

    useEffect(() => {
        if (selectedProvince) {
            const filteredDistricts = Object.values(districtsData).filter(
                (district) => district.parent_code === selectedProvince.code,
            );
            setDistricts(filteredDistricts);
        } else {
            setDistricts([]);
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedDistrict) {
            const filteredCommunes = Object.values(communesData).filter(
                (commune) => commune.parent_code === selectedDistrict.code,
            );
            setCommunes(filteredCommunes);
        } else {
            setCommunes([]);
        }
    }, [selectedDistrict]);

    const handleProvinceChange = (e) => {
        const selectedProvince = provinces.find((province) => province.code === e.target.value);
        setSelectedProvince(selectedProvince);
        setSelectedDistrict('');
        setSelectedCommune({ code: '', name: '' });
    };

    const handleDistrictChange = (e) => {
        const selectedDistrict = districts.find((district) => district.code === e.target.value);
        setSelectedDistrict(selectedDistrict);
        setSelectedCommune({ code: '', name: '' });
    };

    const handleCommuneChange = (e) => {
        const selectedCommune = communes.find((commune) => commune.code === e.target.value);
        setSelectedCommune(selectedCommune);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = name === 'firstName' || name === 'lastName' ? reget(value) : value;
        setFormData({ ...formData, [name]: formattedValue });
    };

    const validate = () => {
        const newErrors = {};
        const nameRegex = /^[A-Za-zÀ-ỹ\s'-]+$/i;
        const phoneRegex = /^(09|03|07|08|05)+([0-9]{8})\b/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.firstName.match(nameRegex)) {
            newErrors.firstName = 'Họ không được chứa ký tự đặc biệt hoặc số.';
        }
        if (!formData.lastName.match(nameRegex)) {
            newErrors.lastName = 'Tên không được chứa ký tự đặc biệt hoặc số.';
        }
        if (!formData.phone.match(phoneRegex) || /[A-Za-z]/.test(formData.phone)) {
            newErrors.phone = 'Số điện thoại không hợp lệ.';
        }
        if (!formData.email.match(emailRegex)) {
            newErrors.email = 'Email không hợp lệ.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        const updatedUser = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            address:
                selectedProvince && selectedDistrict && selectedCommune
                    ? `${formData.addressDetail || user.addressDetail}, ${selectedCommune.name || ''}, ${selectedDistrict.name || ''}, ${selectedProvince.name || ''}`
                    : user.address,
            phone: formData.phone,
            role: formData.role,
        };
        const id = toast.loading('Please wait...');
        try {
            const response = await axios({
                method: updateProfile.method,
                url: updateProfile.url,
                data: updatedUser,
                withCredentials: true,
            });
            if (response.data.status === 200) {
                await fetchProfile();
                const existingUserInfo = Cookies.get('userInfor') ? JSON.parse(Cookies.get('userInfor')) : {};
                const updatedUserInfo = {
                    ...existingUserInfo,
                    firstName: updatedUser.firstName,
                    lastName: updatedUser.lastName,
                    role: user?.role || 'USER',
                };
                updateUserInContext(updatedUserInfo);
                toast.update(id, {
                    render: 'Cập nhật thành công',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
                setEditMode(false);
            } else {
                console.error('Failed to update profile', response.data.message);
            }
        } catch (error) {
            console.error('Error updating profile', error);
            toast.update(id, {
                render: `Cập nhật thất bại ${error.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                closeButton: true,
            });
        }
    };

    const handleEditClick = () => {
        setEditMode(true);
    };

    return (
        <div className="flex flex-col md:flex-row">
            <Sidebar />
            <div className="w-full md:w-3/4 bg-white p-6 shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-6">Thông tin cá nhân</h2>
                {editMode ? (
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block mb-2 font-semibold text-gray-600">
                                    Họ:
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`w-full p-2 border border-gray-300 rounded-md ${
                                        errors.firstName ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.firstName && <span className="text-red-500">{errors.firstName}</span>}
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block mb-2 font-semibold text-gray-600">
                                    Tên:
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`w-full p-2 border border-gray-300 rounded-md ${
                                        errors.lastName ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.lastName && <span className="text-red-500">{errors.lastName}</span>}
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 font-semibold text-gray-600">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full p-2 border border-gray-300 rounded-md ${
                                        errors.email ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.email && <span className="text-red-500">{errors.email}</span>}
                            </div>
                            <div>
                                <label htmlFor="province" className="block mb-2 font-semibold text-gray-600">
                                    Tỉnh:
                                </label>
                                <select
                                    id="province"
                                    name="province"
                                    value={selectedProvince.code || ''}
                                    onChange={handleProvinceChange}
                                    className="w-full border border-gray-300 p-2 rounded-md"
                                >
                                    <option value="">Chọn tỉnh</option>
                                    {provinces.map((province) => (
                                        <option key={province.code} value={province.code}>
                                            {province.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="district" className="block mb-2 font-semibold text-gray-600">
                                    Quận/Huyện:
                                </label>
                                <select
                                    id="district"
                                    name="district"
                                    value={selectedDistrict.code || ''}
                                    onChange={handleDistrictChange}
                                    className="w-full border border-gray-300 p-2 rounded-md"
                                >
                                    <option value="">Chọn quận/huyện</option>
                                    {districts.map((district) => (
                                        <option key={district.code} value={district.code}>
                                            {district.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="commune" className="block mb-2 font-semibold text-gray-600">
                                    Xã/Phường:
                                </label>
                                <select
                                    id="commune"
                                    name="commune"
                                    value={selectedCommune.code}
                                    onChange={handleCommuneChange}
                                    className="w-full border border-gray-300 p-2 rounded-md"
                                >
                                    <option value="">Chọn xã/phường</option>
                                    {communes.map((commune) => (
                                        <option key={commune.code} value={commune.code}>
                                            {commune.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="phone" className="block mb-2 font-semibold text-gray-600">
                                    Số điện thoại:
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`w-full p-2 border border-gray-300 rounded-md ${
                                        errors.phone ? 'border-red-500' : ''
                                    }`}
                                />
                                {errors.phone && <span className="text-red-500">{errors.phone}</span>}
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label htmlFor="addressDetail" className="block mb-2 font-semibold text-gray-600">
                                    Địa chỉ chi tiết:
                                </label>
                                <input
                                    type="text"
                                    id="addressDetail"
                                    name="addressDetail"
                                    value={formData.addressDetail}
                                    onChange={handleChange}
                                    className="w-full border border-gray-300 p-2 rounded-md"
                                />
                            </div>
                        </div>
                        <div className="mt-6 flex flex-col sm:flex-row justify-start gap-4">
                            <Button primary type="submit">
                                Cập nhật
                            </Button>
                            <Button primary onClick={() => setEditMode(false)}>
                                Hủy
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="firstName" className="block mb-2 font-semibold text-gray-600">
                                    Họ:
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    readOnly
                                    className="w-full border border-gray-300 p-2 rounded-md focus:read-only:outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="lastName" className="block mb-2 font-semibold text-gray-600">
                                    Tên:
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    readOnly
                                    className="w-full border border-gray-300 p-2 rounded-md focus:read-only:outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block mb-2 font-semibold text-gray-600">
                                    Email:
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    readOnly
                                    className="w-full border border-gray-300 p-2 rounded-md focus:read-only:outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="address" className="block mb-2 font-semibold text-gray-600">
                                    Địa chỉ:
                                </label>
                                <input
                                    type="text"
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    readOnly
                                    className="w-full border border-gray-300 p-2 rounded-md focus:read-only:outline-none"
                                />
                            </div>
                            <div>
                                <label htmlFor="phone" className="block mb-2 font-semibold text-gray-600">
                                    Số điện thoại:
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    readOnly
                                    className="w-full border border-gray-300 p-2 rounded-md focus:read-only:outline-none"
                                />
                            </div>
                        </div>
                        <Button primary onClick={handleEditClick} className="mt-3">
                            Cập nhật
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
