import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { getAllFeedbacks } from '~/api/user';

const TopRatedTeachersCarousel = () => {
    const [teachers, setTeachers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState('');

    useEffect(() => {
        const monthNames = [
            'Tháng 1',
            'Tháng 2',
            'Tháng 3',
            'Tháng 4',
            'Tháng 5',
            'Tháng 6',
            'Tháng 7',
            'Tháng 8',
            'Tháng 9',
            'Tháng 10',
            'Tháng 11',
            'Tháng 12',
        ];
        const currentDate = new Date();
        const month = monthNames[currentDate.getMonth()];
        setCurrentMonth(month);
        const fetchFeedbacks = async () => {
            try {
                const res = await axios({
                    method: getAllFeedbacks.method,
                    url: getAllFeedbacks.url,
                });
                if (res.data.status === 200) {
                    const feedbacks = res.data.data;
                    console.log('All Feedbacks:', feedbacks);

                    const currentDate = new Date();
                    const currentMonth = currentDate.getMonth();
                    const currentYear = currentDate.getFullYear();

                    const currentMonthFeedbacks = feedbacks.filter((feedback) => {
                        const feedbackDate = new Date(feedback.createdAt);
                        const feedbackMonth = feedbackDate.getMonth();
                        const feedbackYear = feedbackDate.getFullYear();
                        return feedbackMonth === currentMonth && feedbackYear === currentYear;
                    });

                    const teacherRates = currentMonthFeedbacks.reduce((acc, feedback) => {
                        const teacherId = feedback.teacherId._id;
                        const teacherInfo = {
                            name: `${feedback.teacherId.firstName} ${feedback.teacherId.lastName}`,
                            email: feedback.teacherId.email,
                            phone: feedback.teacherId.phone,
                            avatar: feedback.teacherId.avatar,
                        };

                        if (!acc[teacherId]) {
                            acc[teacherId] = { ...teacherInfo, totalRate: 0, count: 0 };
                        }

                        acc[teacherId].totalRate += feedback.rate;
                        acc[teacherId].count += 1;
                        return acc;
                    }, {});

                    const teacherAverageRates = Object.entries(teacherRates).map(([id, data]) => ({
                        id,
                        ...data,
                        averageRate: data.totalRate / data.count,
                    }));

                    const topTeachers = teacherAverageRates.sort((a, b) => b.averageRate - a.averageRate).slice(0, 5);
                    console.log('Top Teachers:', topTeachers);
                    setTeachers(topTeachers);
                    setLoading(false);
                } else {
                    console.error('Error fetching feedbacks:');
                }
            } catch (error) {
                console.error('Error fetching feedbacks:', error);
            }
        };

        fetchFeedbacks();
    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (teachers.length === 0) {
        return <p>No top-rated teachers found for this month.</p>;
    }

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2,
                },
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                },
            },
        ],
    };

    return (
        <div className="container py-10 mx-auto flex flex-col items-center md:flex-row md:justify-center">
            <Slider {...sliderSettings} className="w-full sm:w-[50%]">
                {teachers.map((teacher, index) => (
                    <div key={teacher.id} className="flex items-center border py-4 shadow-md border-gray-200">
                        <div className="flex justify-center items-center w-full h-full py-5">
                            <img
                                className="w-50 h-50 object-cover rounded-lg"
                                src={teacher.avatar}
                                alt={teacher.name}
                            />
                        </div>
                        <div className="flex-1 px-4">
                            <h4 className="font-bold text-center text-lg mb-2">
                                {index + 1}. {teacher.name}
                            </h4>
                            <p className="text-gray-600 text-center mb-1">Email: {teacher.email}</p>

                            <div className="flex justify-center mb-1">
                                {Array.from({ length: 5 }).map((_, i) => {
                                    const wholeStars = Math.floor(teacher.averageRate);
                                    const decimalPart = teacher.averageRate % 1;

                                    return (
                                        <div key={i} className="relative w-6 h-6">
                                            {i < wholeStars ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="#FFD700"
                                                    viewBox="0 0 24 24"
                                                    className="w-full h-full"
                                                >
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            ) : i === wholeStars && decimalPart > 0 ? (
                                                <div
                                                    className="w-full h-full"
                                                    style={{
                                                        background: `linear-gradient(to right, #FFD700 ${decimalPart * 100}%, #E5E7EB ${decimalPart * 100}%)`,
                                                        clipPath:
                                                            'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                                                    }}
                                                ></div>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    fill="#E5E7EB"
                                                    viewBox="0 0 24 24"
                                                    className="w-full h-full"
                                                >
                                                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                </svg>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            <p className="text-gray-600 text-center">Số lượt đánh giá: {teacher.count}</p>
                        </div>
                    </div>
                ))}
            </Slider>
            <div className="text-center w-full mt-5 md:mt-0 md:ml-5">
                <h2 className="mb-5">Top 5 giáo viên xuất sắc của {currentMonth}</h2>
                <p className="text-center text-gray-600 p-2 w-full first-letter:font-bold">Em đây cô giáo Mầm Non</p>
                <p className="text-center text-gray-600 p-2 w-full first-letter:font-bold">
                    Suốt ngày chăm sóc cháu con bao người.
                </p>
                <p className="text-center text-gray-600 p-2 w-full first-letter:font-bold">Cực khổ mà vẫn vui tươi</p>
                <p className="text-center text-gray-600 p-2 w-full first-letter:font-bold">
                    Rạng ngời khuôn mặt nụ cười nở hoa!
                </p>
                <p className="text-center text-gray-600 p-2 w-full first-letter:font-bold">
                    Mong sao các cháu thướt tha
                </p>
                <p className="text-center text-gray-600 p-2 w-full first-letter:font-bold">
                    Tuổi thơ vui khỏe đậm đà tình thương!
                </p>
            </div>
        </div>
    );
};

export default TopRatedTeachersCarousel;
