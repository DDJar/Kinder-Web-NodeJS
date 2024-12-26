import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Sidebar from '../ProfileSidebar';

const TeacherDetail = () => {
    const { id } = useParams();
    const teachers = useSelector((state) => state.teachers);
    console.log('Teacher in state:', teachers);
    console.log('ID from params:', id);

    const teacher = teachers.find((c) => c._id === id);

    const [formData, setFormData] = useState({
        name: '',
        skill: '',
        class: '',
        avatar: '',
        Certificate: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (teacher) {
            setFormData({
                name: teacher.name,
                skill: teacher.skill,
                class: teacher.class,
                avatar: teacher.avatar,
                Certificate: teacher.Certificate,
            });
        }
    }, [teacher]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData({ ...formData, [name]: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const validate = () => {
        const newErrors = {};
        const nameRegex =
            /^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$/;
        const skillRegex = /^[a-zA-Z\s]*$/; // Chỉ cho phép nhập chữ và khoảng trắng

        if (!formData.name.match(nameRegex)) {
            newErrors.name = 'Tên không được chứa ký tự đặc biệt hoặc số.';
        }
        if (!formData.skill.match(skillRegex)) {
            newErrors.skill = 'Kỹ năng chỉ được nhập chữ.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validate()) {
            return;
        }
        console.log('Child profile updated.');
    };

    if (!teacher) {
        return <div>Child not found</div>;
    }

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-3/4 bg-white p-6 shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4">Chi tiết thông tin giáo viên</h2>
                <form onSubmit={handleSubmit}>
                    <div className="flex flex-col items-center mb-4">
                        <image
                            src={formData.avatar}
                            alt="Child Avatar"
                            className="rounded-full w-24 h-24 mb-4 cursor-pointer"
                            onClick={() => document.getElementById('avatarInput').click()}
                        />
                        <input
                            type="file"
                            id="avatarInput"
                            name="avatar"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-700 mb-2">
                            Tên
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.name && <p className="text-red-500 text-sm mt-2">{errors.name}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="skill" className="block text-gray-700 mb-2">
                            Môn học
                        </label>
                        <input
                            type="text"
                            name="skill"
                            value={formData.skill}
                            onChange={handleChange}
                            className={`w-full p-2 border ${errors.skill ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                        />
                        {errors.skill && <p className="text-red-500 text-sm mt-2">{errors.skill}</p>}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="class" className="block text-gray-700 mb-2">
                            Lớp
                        </label>
                        <input
                            type="text"
                            name="class"
                            value={formData.class}
                            onChange={handleChange}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="Certificate" className="block text-gray-700 mb-2">
                            Bằng cấp
                        </label>
                        <image
                            src={formData.Certificate}
                            alt=" Certificate"
                            className="w-full h-auto cursor-pointer mb-4"
                            onClick={() => document.getElementById('CertificateInput').click()}
                        />
                        <input
                            type="file"
                            id="CertificateInput"
                            name="Certificate"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </div>
                    <button type="submit" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600">
                        Lưu
                    </button>
                </form>
            </div>
        </div>
    );
};

export default TeacherDetail;
