import React, { useEffect, useState } from 'react';
import axios from '~/config/configAxios';
import { getAllFeedbacks, getChildren } from '~/api/user';
import { useDispatch } from 'react-redux';
//import { setChildren } from '~/redux/action';

const FeedbackList = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [setData] = useState('');
    const [setChildren] = useState([]);
    const dispatch = useDispatch();
    const [selectedTeacherId, setSelectedTeacherId] = useState(null);
    const uniqueTeachers = feedbacks.reduce((acc, feedback) => {
        const teacher = feedback.teacherId;
        if (!acc.some((t) => t._id === teacher._id)) {
            acc.push(teacher);
        }
        return acc;
    }, []);
    const filteredFeedbacks = selectedTeacherId
        ? feedbacks.filter((feedback) => feedback.teacherId._id === selectedTeacherId)
        : [];

    useEffect(() => {
        const fetchFeedbacks = async () => {
            try {
                const response = await axios({
                    method: getAllFeedbacks.method,
                    url: getAllFeedbacks.url,
                    withCredentials: true,
                });
                if (response.data.data && response.data.data.length > 0) {
                    setFeedbacks(response.data.data);
                } else {
                    setFeedbacks([]);
                }
            } catch (err) {
                setError('Error fetching feedbacks.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchFeedbacks();
    }, []);

    useEffect(() => {
        if (feedbacks.length === 0) return;

        const fetchChildren = async () => {
            const userId = feedbacks[0].userId._id;
            try {
                const res = await axios({
                    method: getChildren.method,
                    url: getChildren.url,
                    params: { userId },
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
    }, [feedbacks]);

    if (loading) {
        return <div>Loading feedbacks...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className="container mx-auto py-10">
            <h1 className="text-center text-3xl font-bold mb-6">Danh sách phản hồi về việc giảng dạy</h1>
            {feedbacks.length === 0 ? (
                <p className="text-center text-gray-500">Chưa phản hồi</p>
            ) : (
                <>
                    {/* Danh sách giáo viên */}
                    <div className="mb-6">
                        <h2 className="text-2xl font-semibold mb-4">Danh sách Giáo viên:</h2>
                        <div className="flex flex-wrap gap-4">
                            {uniqueTeachers.map((teacher) => (
                                <button
                                    key={teacher._id}
                                    onClick={() => setSelectedTeacherId(teacher._id)}
                                    className={`py-2 px-4 rounded-lg ${
                                        selectedTeacherId === teacher._id
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 hover:bg-blue-100'
                                    }`}
                                >
                                    {teacher.firstName} {teacher.lastName}
                                </button>
                            ))}
                        </div>
                    </div>
                    {selectedTeacherId && (
                        <div className="text-center mb-4">
                            <h4 className="text-xl font-semibold">Trung bình điểm đánh giá:</h4>
                            <div className="stars" style={{ display: 'flex', justifyContent: 'center' }}>
                                {Array.from({ length: 5 }, (_, index) => {
                                    const averageRating =
                                        filteredFeedbacks.reduce((sum, feedback) => sum + feedback.rate, 0) /
                                        filteredFeedbacks.length;
                                    return (
                                        <div
                                            key={index}
                                            className="flex flex-col items-center"
                                            style={{ marginRight: '5px' }}
                                        >
                                            <span
                                                className={index < averageRating ? 'star filled' : 'star'}
                                                style={{
                                                    color: index < averageRating ? 'gold' : '#d3d3d3',
                                                    fontSize: '24px',
                                                }}
                                            >
                                                &#9733;
                                            </span>
                                            {index === 4 && (
                                                <p className="text-center font-medium mt-2">
                                                    {averageRating.toFixed(1)} / 5
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                    <div className="grid gap-6">
                        {filteredFeedbacks.length > 0 ? (
                            filteredFeedbacks.map((feedback, index) => (
                                <div
                                    key={index}
                                    className="border p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow bg-white"
                                >
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <h3 className="text-xl font-semibold mb-2">
                                                Phụ huynh: {feedback.userId.firstName} {feedback.userId.lastName}
                                            </h3>
                                            <p>Email: {feedback.userId.email || 'Không cung cấp'}</p>
                                            <p>Phone: {feedback.userId.phone || 'Không cung cấp'}</p>
                                        </div>
                                        {/*{children.length > 0 ? (
                                            <div>
                                                <ul>
                                                    {children.map((child) => (
                                                        <li key={child._id}>
                                                            <h3 className="text-xl font-semibold mb-2">
                                                                Trẻ em: {child.firstName} {child.lastName}
                                                            </h3>
                                                            <p>Lớp học: {child.class.name || 'Chưa có thông tin'}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ) : (
                                            <p>Không có thông tin</p>
                                        )}*/}
                                        <div>
                                            <h4 className="text-lg font-semibold">Phản hồi từ phụ huynh:</h4>
                                            <p>{feedback.content || 'Không có nội dung.'}</p>
                                        </div>
                                        <div>
                                            <div className="stars" style={{ display: 'flex' }}>
                                                {Array.from({ length: 5 }, (_, index) => (
                                                    <span
                                                        key={index}
                                                        className={index < feedback.rate ? 'star filled' : 'star'}
                                                        style={{
                                                            color: index < feedback.rate ? 'gold' : '#d3d3d3',
                                                            fontSize: '24px',
                                                            marginRight: '5px',
                                                        }}
                                                    >
                                                        &#9733;
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Chọn giáo viên muốn xem đánh giá.</p>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default FeedbackList;
