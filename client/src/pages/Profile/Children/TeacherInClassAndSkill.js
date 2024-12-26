import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../ProfileSidebar';
import { getClassAndSkillInfoByChildId } from '~/api/user';
import axios from '~/config/configAxios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const TeacherInClassAndSkill = () => {
    const { id } = useParams();
    const [teacherData, setTeacherData] = useState({
        class: null,
        skill: null,
    });

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = `0${date.getMonth() + 1}`.slice(-2);
        const day = `0${date.getDate()}`.slice(-2);
        return `${year}-${month}-${day}`;
    };

    const fetchTeacherData = async (id) => {
        try {
            const res = await axios({
                method: getClassAndSkillInfoByChildId(id).method,
                url: getClassAndSkillInfoByChildId(id).url,
            });
            if (res.data.status === 200) {
                const { class: classInfo, skill } = res.data.data;
                console.log('Class and skill data:', { classInfo, skill });
                setTeacherData({
                    class: classInfo,
                    skill: skill,
                });
            } else {
                console.error('Failed to fetch teacher data', res.data.message);
            }
        } catch (error) {
            toast.error('Error fetching teacher information.');
            console.error(error);
        }
    };

    useEffect(() => {
        if (id) {
            fetchTeacherData(id);
        }
    }, [id]);

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-3/4 bg-white p-6 shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4">Chi tiết thông tin giáo viên</h2>
                {teacherData.class && teacherData.class.teacher ? (
                    <div>
                        <div className="flex flex-col items-center mb-4">
                            <img
                                src={`${teacherData.class.teacher.avatar}`}
                                alt="Child Avatar"
                                className="rounded-full object-cover w-24 h-24"
                            />
                        </div>
                        <div className="w-full md:w-1/2 space-y-6">
                            <p>
                                <strong>Họ và tên:</strong> {teacherData.class.teacher.firstName}{' '}
                                {teacherData.class.teacher.lastName}
                            </p>
                            <p>
                                <strong>Email:</strong> {teacherData.class.teacher.email}
                            </p>
                            <p>
                                <strong>Số điện thoại:</strong> {teacherData.class.teacher.phone}
                            </p>
                        </div>
                        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-white-700">
                            <Link
                                to={`/users/${teacherData.class.teacher._id}/feedback`}
                                id="teacherfeedback"
                                className="text-white no-underline"
                            >
                                Đánh giá giáo viên
                            </Link>
                        </button>
                        <div>
                            <h3 className="text-xl font-bold mt-6 mb-4">Thông tin lớp phụ trách</h3>
                            <div className="border border-gray-200 p-4 rounded-md mb-4">
                                <p>
                                    <strong>Tên lớp:</strong> {teacherData.class.name}
                                </p>
                                <p>
                                    <strong>Thời gian bắt đầu:</strong> {formatDate(teacherData.class.startTime)}
                                </p>
                                <p>
                                    <strong>Thời gian kết thúc:</strong> {formatDate(teacherData.class.endTime)}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Giáo viên chưa dạy lớp nào.</p>
                )}

                {teacherData.skill && teacherData.skill.teacher ? (
                    <div>
                        <h3 className="text-xl font-bold mt-6 mb-4">Thông tin kỹ năng</h3>
                        <div className="border border-gray-200 p-4 rounded-md mb-4">
                            <p>
                                <strong>Tên lớp:</strong> {teacherData.skill.name}
                            </p>
                            <p>
                                <strong>Thời gian bắt đầu:</strong> {teacherData.skill.startTime}
                            </p>
                            <p>
                                <strong>Thời gian kết thúc:</strong> {teacherData.skill.endTime}
                            </p>
                            <p>
                                <strong>Giáo viên:</strong> {teacherData.skill.teacher.firstName}{' '}
                                {teacherData.skill.teacher.lastName}
                            </p>
                        </div>
                    </div>
                ) : (
                    <p>Giáo viên không phụ trách lớp kỹ năng của bé.</p>
                )}
            </div>
        </div>
    );
};

export default TeacherInClassAndSkill;
