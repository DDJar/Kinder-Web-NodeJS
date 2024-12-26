import React, { useEffect, useState } from 'react';
import PageTitle from '~/common/PageTitle';
import Button from '~/components/Button';

// Giả định danh sách các lớp học
const classes = [
    { id: 1, name: 'Lớp Mầm' },
    { id: 2, name: 'Lớp Chồi' },
    { id: 3, name: 'Lớp Lá' },
];

const initialStudents = [
    // Giả định các học sinh cho mỗi lớp
    { id: 1, name: 'Louis Pham', classId: 2, status: '' },
    { id: 2, name: 'Paul Le', classId: 1, status: '' },
    { id: 3, name: 'Ngân Hà', classId: 3, status: '' },
    { id: 4, name: 'Mỹ Hà', classId: 1, status: '' },
    { id: 5, name: 'Xemesis', classId: 3, status: '' },
    { id: 6, name: 'Xoài Non', classId: 3, status: '' },
    // Add more students as needed
];

function Attendance() {
    const [students, setStudents] = useState(initialStudents);
    const [allMarked, setAllMarked] = useState(''); // Track the marking state
    const [selectedClass, setSelectedClass] = useState('');
    // eslint-disable-next-line no-unused-vars
    const [allAttend, setAllAttend] = useState(false);

    useEffect(() => {
        checkIfAllMarked();
    }, [students]);

    const handleStatusChange = (id, status) => {
        setAllMarked('');
        const updatedStudents = students.map((student) => (student.id === id ? { ...student, status } : student));
        setStudents(updatedStudents);
    };

    const handleNoteChange = (id, note) => {
        const updatedStudents = students.map((student) => (student.id === id ? { ...student, note } : student));
        setStudents(updatedStudents);
        console.log(`Student ID: ${id}, Note: ${note}`);
    };

    const handleAllMark = (status) => {
        setAllMarked(status);
        const updatedStudents = students.map((student) => ({ ...student, status }));
        setStudents(updatedStudents);
    };

    const checkIfAllMarked = () => {
        const allMarked = students.every((student) => student.status !== '');
        setAllAttend(allMarked);
    };

    // Giả sử bạn có một API để lấy học sinh dựa trên lớp đã chọn
    const fetchStudentsForClass = (classId) => {
        //  sử dụng dữ liệu giả
        // Gọi API ở đây và cập nhật danh sách học sinh
        // Lọc học sinh theo lớp được chọn
        const fetchedStudents = initialStudents.filter((student) => student.classId === parseInt(classId));
        setStudents(fetchedStudents);
    };

    const handleClassChange = (event) => {
        const classId = event.target.value;
        setSelectedClass(classId);
        fetchStudentsForClass(classId);
    };

    const handleSubmit = () => {
        // Giả định hành động gửi dữ liệu
        console.log('Sending data...', students);
        alert('Attendance data has been submitted!');
    };

    return (
        <div className="rounded-lg w-full flex justify-center">
            <PageTitle title="Kindergarten | attendance" />

            <div className=" bg-white rounded-lg m-4 w-full container flex justify-around space-x-2">
                <div className="flex flex-col w-full h-full pb-6 py-2 px-10">
                    <h3 className="mb-3 text-4xl font-extrabold text-secondary">Điểm danh</h3>
                    <div className="flex justify-end">
                        <input
                            className="rounded-md border focus:border-zinc-400 outline-none mb-2 hover:bg-slate-50 text-secondary"
                            type="datetime-local"
                        />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="space-x-16">
                            <label>
                                <input
                                    type="radio"
                                    value="Present"
                                    checked={allMarked === true}
                                    onChange={() => handleAllMark(true)}
                                    className="mr-2"
                                />
                                Mark All Present
                            </label>
                            <label className="ml-4">
                                <input
                                    type="radio"
                                    value="Absent"
                                    checked={allMarked === false}
                                    onChange={() => handleAllMark(false)}
                                    className="mr-2"
                                />
                                Mark All Absent
                            </label>
                        </div>

                        <select
                            value={selectedClass}
                            onChange={handleClassChange}
                            className="border rounded-md focus:border-zinc-400 outline-none hover:bg-slate-50 text-secondary"
                        >
                            <option value="">Lớp</option>
                            {classes.map((cls) => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className=" border rounded-sm items-center py-2">
                        <table className="min-w-full items-center">
                            <thead>
                                <tr>
                                    <th>STT</th>
                                    <th>Name</th>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student.id}>
                                        <td className="text-center">{index + 1}</td>
                                        <td className="text-center">{student.name}</td>
                                        <td className="text-center">
                                            <input
                                                type="radio"
                                                checked={student.status === true}
                                                onChange={() => handleStatusChange(student.id, true)}
                                            />
                                        </td>
                                        <td className="text-center">
                                            <input
                                                type="radio"
                                                checked={student.status === false}
                                                onChange={() => handleStatusChange(student.id, false)}
                                            />
                                        </td>
                                        {/* <td className="text-center">
                                            <input
                                                className="bg-white rounded-sm border focus:border-zinc-400 outline-none hover:bg-slate-50"
                                                type="text"
                                            />
                                        </td> */}
                                        <td className="text-center">
                                            <input
                                                className="bg-white rounded-sm border focus:border-zinc-400 outline-none hover:bg-slate-50"
                                                type="text"
                                                value={student.note}
                                                onChange={(e) => handleNoteChange(student.id, e.target.value)}
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="flex justify-end">
                        {/* <Button primary onClick={handleSubmit} className="mt-3  ">
                            Gửi
                        </Button> */}
                        <Button disabled={!allAttend} primary onClick={handleSubmit} className="mt-3" roundedMd>
                            Gửi
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col justify-end space-y-4 transform -translate-y-8">
                    <div className="bg-yellow-300 w-60 mr-4 rounded p-2">Total Students: {students.length}</div>
                    <div className="bg-lime-600 w-60 mr-4 rounded p-2">
                        Present Today: {students.filter((student) => student.status === true).length}
                    </div>
                    <div className="bg-red-400 w-60 mr-4 rounded p-2">
                        Absent Today: {students.filter((student) => student.status === false).length}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Attendance;
