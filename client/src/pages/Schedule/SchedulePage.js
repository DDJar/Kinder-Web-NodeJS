import React, { useState } from 'react';
import PageTitle from '~/common/PageTitle';
// import Button from '~/components/Button';

const initialSchedule = [
    {
        time: '08:00am',
        monday: { subject: 'Sinh Hoạt', time: '8:00-8:30', teacher: 'Luis Pham' },
        tuesday: null,
        wednesday: { subject: 'Erobic', time: '9:00-10:00', teacher: 'Luis Pham' },
        thursday: { subject: 'Dance', time: '9:00-10:00', teacher: 'Teacher C' },
        friday: { subject: 'Art', time: '9:00-10:00', teacher: 'Teacher D' },
        saturday: { subject: 'English', time: '9:00-10:00', teacher: 'Teacher E' },
    },
    {
        time: '10:00am',
        monday: { subject: 'Music', time: '10:00-11:00', teacher: 'Teacher F' },
        tuesday: null,
        wednesday: { subject: 'Art', time: '10:00-11:00', teacher: 'Teacher G' },
        thursday: { subject: 'Yoga', time: '10:00-11:00', teacher: 'Teacher H' },
        friday: { subject: 'English', time: '10:00-11:00', teacher: 'Teacher I' },
        saturday: null,
    },
    {
        time: '11:00am',
        monday: { subject: 'Break', time: '11:00-12:00', bgColor: 'bg-orange-500' },
        tuesday: { subject: 'Break', time: '11:00-12:00', bgColor: 'bg-orange-500' },
        wednesday: { subject: 'Break', time: '11:00-12:00', bgColor: 'bg-orange-500' },
        thursday: { subject: 'Break', time: '11:00-12:00', bgColor: 'bg-orange-500' },
        friday: { subject: 'Break', time: '11:00-12:00', bgColor: 'bg-orange-500' },
        saturday: { subject: 'Break', time: '11:00-12:00', bgColor: 'bg-orange-500' },
    },
    {
        time: '12:00pm',
        monday: null,
        tuesday: { subject: 'Art', time: '12:00-1:00', teacher: 'Teacher J' },
        wednesday: { subject: 'Dance', time: '12:00-1:00', teacher: 'Teacher K' },
        thursday: { subject: 'Music', time: '12:00-1:00', teacher: 'Teacher L' },
        friday: null,
        saturday: { subject: 'Yoga', time: '12:00-1:00', teacher: 'Teacher M' },
    },
    {
        time: '01:00pm',
        monday: { subject: 'English', time: '1:00-2:00', teacher: 'Teacher N' },
        tuesday: { subject: 'Music', time: '1:00-2:00', teacher: 'Teacher O' },
        wednesday: null,
        thursday: { subject: 'English', time: '1:00-2:00', teacher: 'Teacher P' },
        friday: { subject: 'Yoga', time: '1:00-2:00', teacher: 'Teacher Q' },
        saturday: { subject: 'Music', time: '1:00-2:00', teacher: 'Teacher R' },
    },
];

function SchedulePage() {
    const [schedule] = useState(initialSchedule);

    return (
        <div className="rounded-lg w-full flex justify-center">
            <PageTitle title="Kindergarten | schedule" />

            <div className="bg-white rounded-lg m-4 w-full container flex justify-around space-x-2 ">
                <div className="flex flex-col w-full h-full pb-6 py-2 px-10">
                    <h3 className="mb-3 text-4xl font-extrabold text-secondary">Thời Khóa Biểu</h3>

                    <div className="select-none">
                        <table className="w-full border-collapse border border-gray-200">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="px-4 py-2 uppercase border border-gray-200">Time</th>
                                    <th className="px-4 py-2 uppercase border border-gray-200">Monday</th>
                                    <th className="px-4 py-2 uppercase border border-gray-200">Tuesday</th>
                                    <th className="px-4 py-2 uppercase border border-gray-200">Wednesday</th>
                                    <th className="px-4 py-2 uppercase border border-gray-200">Thursday</th>
                                    <th className="px-4 py-2 uppercase border border-gray-200">Friday</th>
                                    <th className="px-4 py-2 uppercase border border-gray-200">Saturday</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((row, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2 align-middle border border-gray-200 ">
                                            <div className="flex items-center justify-center h-full">{row.time}</div>
                                        </td>
                                        {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].map(
                                            (day) => (
                                                <td
                                                    className={`px-4 py-2 align-middle border border-gray-200 relative ${row[day] ? 'group' : ''}`}
                                                    key={day}
                                                >
                                                    {row[day] ? (
                                                        <div className="flex flex-col items-center justify-center h-full">
                                                            <span
                                                                className={`${row[day]} text-black font-bold py-1 px-4 rounded mb-2 inline-block`}
                                                            >
                                                                {row[day].subject}
                                                            </span>
                                                            <div className="mt-2">{row[day].time}</div>
                                                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-100 text-black rounded-lg shadow-lg duration-100 opacity-0 group-hover:opacity-100 group-hover:scale-110 group-hover:bg-cyan-500 ">
                                                                <span
                                                                    className={`${row[day]} text-white font-bold py-1 px-4 rounded mb-2 inline-block`}
                                                                >
                                                                    {row[day].subject}
                                                                </span>
                                                                <div className=" text-white">{row[day].time}</div>
                                                                <div className=" text-white">{row[day].teacher}</div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-full">
                                                            <span className="text-white py-1 px-4 rounded mb-2 inline-block">
                                                                &nbsp;
                                                            </span>
                                                            <div className="mt-2">&nbsp;</div>
                                                        </div>
                                                    )}
                                                </td>
                                            ),
                                        )}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
export default SchedulePage;
