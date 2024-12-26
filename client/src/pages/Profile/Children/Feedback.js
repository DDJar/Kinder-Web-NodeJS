import axios from '~/config/configAxios';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import { createFeedback } from '~/api/user';
const Feedback = () => {
    const [formData, setFormData] = useState({
        content: '',
    });
    const [contentError, setContentError] = useState('');
    const [rating, setRating] = useState('');
    //const [hover, setHover] = useState(0);
    const navigate = useNavigate();
    const { userId } = useParams();
    const { user } = useUserProvider();

    const handleSubmit = async (e) => {
        e.preventDefault();
        let hasError = false;

        if (!rating) {
            setRating('Bạn chưa đánh sao cho giáo viên!');
            toast.warn('Bạn chưa đánh sao cho giáo viên!');
            hasError = true;
        } else {
            setRating('');
        }
        if (!formData.content.trim()) {
            setContentError('Nội dung không được để trống.');
            hasError = true;
        } else {
            setContentError('');
        }
        if (hasError) {
            return;
        }

        try {
            const response = await axios({
                url: createFeedback.url,
                method: createFeedback.method,
                data: {
                    content: formData.content,
                    status: 'ACTIVE',
                    teacherId: userId,
                    rate: rating,
                    userId: user._id,
                },
            });

            if (response.status === 200) {
                toast.success('Feedback đã được tạo thành công!');
                setFormData({ content: '' });
                setRating(0);
                navigate('/');
            } else {
                toast.error('Không thể tạo feedback');
            }
        } catch (error) {
            toast.error('Không thể tạo feedback');
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleBack = () => {
        navigate(`/users/${userId}`);
    };

    return (
        <div className="flex items-center justify-center " style={{ paddingTop: '50px', paddingBottom: '50px' }}>
            <div className="tong rounded-md p-4 mb-2 w-full max-w-lg">
                <h1 style={{ textAlign: 'center', marginBottom: '40px' }}>Đánh giá giáo viên</h1>
                <div style={{ display: 'flex', gap: '5px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            style={{
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                outline: 'none',
                            }}
                            onClick={() => setRating(star)}
                        >
                            <span
                                style={{
                                    fontSize: '2rem',
                                    color: star <= rating ? 'gold' : 'gray',
                                }}
                            >
                                ★
                            </span>
                        </button>
                    ))}
                </div>
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="mb-4">
                        <label htmlFor="content" className="block text-sm font-medium leading-6 text-gray-900">
                            Nội dung:
                        </label>
                        <textarea
                            id="content"
                            value={formData.content}
                            onChange={handleChange}
                            required
                            className="block px-4 w-full h-50 rounded-md border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-600 focus:ring-opacity-50 sm:text-sm"
                            placeholder="Nhập nội dung...."
                        />
                        {contentError && <p className="text-red-500 text-sm mt-1">{contentError}</p>}
                    </div>
                    <div className="flex justify-center mt-4">
                        <button
                            type="button"
                            className="mr-4 rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                            onClick={handleBack}
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
        </div>
    );
};

export default Feedback;
