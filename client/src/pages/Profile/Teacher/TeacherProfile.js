import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Sidebar from '../ProfileSidebar';

const TeacherProfile = () => {
    const teachers = useSelector((state) => state.teachers);

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-3/4 bg-white p-6 shadow-md rounded-md">
                <h2 className="text-2xl font-bold mb-4">Danh sách giáo viên</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {teachers.map((teacher) => (
                        <Link
                            to={`/teachers/${teacher._id}`}
                            key={teacher._id}
                            className="block p-4 bg-gray-100 rounded-md shadow hover:bg-gray-200"
                        >
                            <div className="flex flex-col items-center">
                                <img src={teacher.avatar} alt=" Avatar" className="rounded-full w-24 h-24 mb-4" />
                                <h3 className="text-lg font-semibold">{teacher.name}</h3>
                                <p className="text-sm text-gray-600">Môn học: {teacher.skill}</p>
                                <p className="text-sm text-gray-600">Lớp: {teacher.class}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TeacherProfile;
