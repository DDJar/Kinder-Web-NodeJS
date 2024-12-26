import axios from '~/config/configAxios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { createProposal } from '~/api/proposal';
import { useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import { LinkBackwardIcon } from 'hugeicons-react';

const CreateProposal = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '', // Initial endDate as current datetime
    });
    const [titleError, setTitleError] = useState('');
    const [contentError, setContentError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let hasError = false;
        // Kiểm tra tiêu đề
        if (!formData.title.trim()) {
            setTitleError('Tiêu đề không được để trống.');
            hasError = true;
        } else if (formData.title.length < 50) {
            setTitleError('Tiêu đề phải có nhiều hơn 50 ký tự.');
            hasError = true;
        } else {
            setTitleError('');
        }

        // Kiểm tra nội dung
        if (!formData.content.trim()) {
            setContentError('Nội dung không được để trống.');
            hasError = true;
        } else if (formData.content.length < 200) {
            setContentError('Nội dung phải có nhiều hơn 200 ký tự.');
            hasError = true;
        } else {
            setContentError('');
        }

        // Nếu có lỗi, dừng việc gửi form
        if (hasError) {
            return;
        }

        try {
            const response = await axios({
                url: createProposal.url,
                method: createProposal.method,
                data: {
                    ...formData,
                    status: 'ACTIVE', // Đảm bảo status khớp với enum trong schema của bạn
                },
            });

            if (response.status === 200) {
                toast.success('Đề xuất được tạo thành công!');
                setFormData({
                    // Reset authorId sau khi đã tạo thành công
                    title: '',
                    content: '',
                });
            } else {
                toast.error('Không thể tạo đề xuất');
            }
        } catch (error) {
            toast.error('Không thể tạo đề xuất');
        }
        navigate('/proposal');
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleBackProposal = () => {
        navigate('/proposal');
    };

    return (
        <div className="tong rounded-md p-4 mb-2 w-full relative">
            <h1 className="text-2xl font-bold mb-4 text-center font-larger">Tạo đề xuất mới</h1>
            <Button
                onClick={handleBackProposal}
                primary
                icon={<LinkBackwardIcon />}
                className="rounded-md bg-slate-600 mb-10 ml-50"
            >
                Quay lại
            </Button>
            <form onSubmit={handleSubmit} className="tong rounded-md p-4 mb-2 w-full relative ml-70">
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <label htmlFor="title" className="block text-sm font-medium leading-6 text-gray-900">
                            Tiêu đề:
                        </label>
                        <div className="mt-2">
                            <input
                                type="text"
                                id="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                className="block px-4 w-full h-12 rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-600 focus:ring-opacity-50 sm:text-sm"
                                placeholder="Nhập tiêu đề...."
                            />
                            {titleError && <p className="text-red-500 text-sm mt-1">{titleError}</p>}
                        </div>
                    </div>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                    <div className="sm:col-span-4">
                        <div>
                            <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">
                                Nội dung:
                            </label>
                            <div className="mt-2">
                                <textarea
                                    id="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                    className="block px-4 w-full h-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-600 focus:ring-opacity-50 sm:text-sm"
                                    placeholder="Nhập nội dung...."
                                />
                                {contentError && <p className="text-red-500 text-sm mt-1">{contentError}</p>}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6"></div>
                <div className="flex justify-center mt-4">
                    <button
                        type="button"
                        className="mr-4 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                        Huỷ bỏ
                    </button>
                    <button
                        type="submit"
                        className="rounded-md bg-blue-500 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-600"
                    >
                        Gửi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateProposal;
