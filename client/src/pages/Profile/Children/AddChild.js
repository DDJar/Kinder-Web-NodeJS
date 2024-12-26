import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setChildren } from '~/redux/action';
import { addChild } from '~/api/user';
import { toast } from 'react-toastify';
import { uploadImage } from '~/utils/uploadFile/uploadImage';
import Button from '~/components/Button';
import Sidebar from '../ProfileSidebar';
import { reget } from '~/utils/validate';
import axios from '~/config/configAxios';
import { useUserProvider } from '~/hooks/user/useUserProvider';

const AddChild = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        age: '',
        avatar: null,
    });

    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user } = useUserProvider();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = name === 'firstName' || name === 'lastName' ? reget(value) : value;
        setFormData({ ...formData, [name]: formattedValue });
        if (errors[name]) {
            setErrors((prevErrors) => {
                const newErrors = { ...prevErrors };
                delete newErrors[name];
                return newErrors;
            });
        }
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
        const nameRegex = /^[A-Za-zÀ-ỹ\s'-]+$/i;

        if (!formData.firstName.match(nameRegex)) {
            newErrors.firstName = 'Họ không được chứa ký tự đặc biệt hoặc số.';
        }
        if (!formData.lastName.match(nameRegex)) {
            newErrors.lastName = 'Tên không được chứa ký tự đặc biệt hoặc số.';
        }
        const birthDate = new Date(formData.age);
        const currentDate = new Date();
        const ageDifference = currentDate.getFullYear() - birthDate.getFullYear();
        const isDateValid =
            ageDifference > 1 ||
            (ageDifference === 1 &&
                (currentDate.getMonth() > birthDate.getMonth() ||
                    (currentDate.getMonth() === birthDate.getMonth() && currentDate.getDate() >= birthDate.getDate())));

        if (!isDateValid) {
            newErrors.age = 'Trẻ phải từ 1 tuổi trở lên.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }

        const newChild = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            dateOfBirth: formData.age,
            avatar: formData.avatar,
        };
        const id = toast.loading('Please wait...');

        try {
            console.log('Submitting child:', { userId: user._id, child: newChild });
            const res = await axios({
                method: addChild.method,
                url: addChild.url,
                data: { userId: user._id, child: newChild },
            });
            if (res.data.status === 200) {
                toast.update(id, {
                    render: 'Thêm thành công',
                    type: 'success',
                    isLoading: false,
                    autoClose: 3000,
                    closeOnClick: true,
                    closeButton: true,
                });
                dispatch(setChildren(res.data.data.child));
                navigate('/profile/children');
            } else {
                console.error('Failed to add child', res.data.message);
            }
        } catch (error) {
            toast.update(id, {
                render: `Thêm thất bại ${error.message}`,
                type: 'error',
                isLoading: false,
                autoClose: 3000,
                closeOnClick: true,
                closeButton: true,
            });
            console.error('Error adding child', error);
        }
    };

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-3/4 bg-white p-6 shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4">Thêm thông tin con</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block text-gray-700">
                            Họ:
                        </label>
                        <input
                            type={'text'}
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${
                                errors.firstName ? 'border-red-500' : 'border-gray-300'
                            } rounded-md`}
                            required
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-2">{errors.firstName}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block text-gray-700">
                            Tên:
                        </label>
                        <input
                            type={'text'}
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${
                                errors.lastName ? 'border-red-500' : 'border-gray-300'
                            } rounded-md`}
                            required
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-2">{errors.lastName}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="age" className="block text-gray-700">
                            Ngày sinh:
                        </label>
                        <input
                            type={'date'}
                            name="age"
                            value={formData.age}
                            onChange={handleInputChange}
                            className={`w-full px-3 py-2 border ${
                                errors.age ? 'border-red-500' : 'border-gray-300'
                            } rounded-md`}
                            required
                        />
                        {errors.age && <p className="text-red-500 text-sm mt-2">{errors.age}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="avatar" className="block text-gray-700">
                            Avatar:
                        </label>
                        <input
                            type={'file'}
                            name="avatar"
                            onChange={handleFileChange}
                            className="w-full px-3 py-2 border rounded-md"
                        />
                    </div>
                    <Button primary type="submit">
                        Tạo thông tin con
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default AddChild;
