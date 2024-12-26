import React, { useEffect, useState } from 'react';
import axios from '~/config/configAxios';
import { getClassesByTeacher } from '~/api/academies';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import Button from '~/components/Button';
import { Home01Icon } from 'hugeicons-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const ClassList = () => {
    const { user } = useUserProvider();
    const navigate = useNavigate();
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deviceSize, setDeviceSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredClasses = classes.filter((classItem) =>
        classItem.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    const fetchClassesByTeacher = async (teacherId) => {
        try {
            const response = await axios({
                url: getClassesByTeacher.url,
                method: getClassesByTeacher.method,
                params: { teacherId: teacherId },
            });
            return { classes: response.data.data.classes };
        } catch (error) {
            console.error('Error fetching classes ', error);
            setError(error.message || 'Unknown error');
            return { classes: [] };
        }
    };
    useEffect(() => {
        const handleResize = () => {
            setDeviceSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    useEffect(() => {
        const getClasses = async () => {
            const teacherId = user._id;
            const { classes: classesData } = await fetchClassesByTeacher(teacherId);
            setClasses(classesData);
            setLoading(false);
        };

        getClasses();
    }, [user]);
    const handleShowClasses = () => {
        navigate(`/dashboards/my-class`);
    };
    const handleShowSkills = () => {
        navigate(`/dashboards/my-skill`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full p-5 container items-center bg-white shadow-md rounded-lg">
            {deviceSize.width >= 500 ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                    <Button
                        icon={<Home01Icon />}
                        onClick={handleShowClasses}
                        className="bg-primary text-white hover:bg-opacity80"
                    >
                        Lớp học
                    </Button>
                    <Button
                        icon={<Home01Icon />}
                        onClick={handleShowSkills}
                        className="bg-primary text-white hover:bg-opacity80"
                    >
                        Kỹ năng
                    </Button>
                </div>
            ) : (
                <div className="flex gap-3 justify-between">
                    <Button
                        icon={<Home01Icon />}
                        onClick={handleShowClasses}
                        className="bg-primary text-[12px] text-white hover:bg-opacity80"
                    >
                        Lớp học
                    </Button>
                    <Button
                        icon={<Home01Icon />}
                        onClick={handleShowSkills}
                        className="bg-primary text-[12px] text-white hover:bg-opacity80"
                    >
                        Kỹ năng
                    </Button>
                </div>
            )}

            <div style={{ padding: '10px', textAlign: 'left' }}>
                <input
                    type="search"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={handleSearch}
                    style={{
                        padding: '8px',
                        width: '100%',
                        maxWidth: '300px',
                        marginLeft: '-100',
                        border: '2px solid #3498db',
                        borderRadius: '4px',
                        outline: 'none',
                        fontSize: '16px',
                        transition: 'border-color 0.3s ease',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = '#2980b9')}
                    onBlur={(e) => (e.target.style.borderColor = '#3498db')}
                />
            </div>
            <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>Danh sách các lớp của tôi</h2>
            <table className="table-auto w-full border-collapse border border-gray-300 mt-5">
                <thead>
                    {deviceSize.width >= 500 ? (
                        <>
                            {' '}
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Tên lớp</th>
                                <th className="border border-gray-300 px-4 py-2">Ngày bắt đầu</th>
                                <th className="border border-gray-300 px-4 py-2">Ngày kết thúc</th>
                                <th className="border border-gray-300 px-4 py-2">Độ tuổi</th>
                                <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
                            </tr>
                        </>
                    ) : (
                        <>
                            {' '}
                            <tr>
                                <th className="border border-gray-300 px-4 py-2">Tên lớp</th>
                                <th className="border border-gray-300 px-4 py-2">Độ tuổi</th>
                                <th className="border border-gray-300 px-4 py-2">Trạng thái</th>
                            </tr>
                        </>
                    )}
                </thead>
                <tbody>
                    {filteredClasses.map((classItem) => (
                        <tr key={classItem._id} style={{ textAlign: 'center' }}>
                            {deviceSize.width >= 500 ? (
                                <>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Link
                                            to={`/dashboards/my-class/${classItem._id}`}
                                            className="block text-blue-500 underline hover:text-blue-700"
                                        >
                                            {classItem.name}
                                        </Link>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(classItem.startTime).toLocaleDateString('sv-SE')}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(classItem.endTime).toLocaleDateString('sv-SE')}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{classItem.condition}</td>
                                    <td
                                        className={`border border-gray-300 px-4 py-2 ${
                                            classItem.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'
                                        }`}
                                    >
                                        {classItem.status === 'ACTIVE' ? 'Đang diễn ra' : classItem.status}
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Link
                                            to={`/dashboards/my-class/${classItem._id}`}
                                            className="block text-blue-500 underline hover:text-blue-700"
                                        >
                                            {classItem.name}
                                        </Link>
                                    </td>

                                    <td className="border border-gray-300 px-4 py-2">{classItem.condition}</td>
                                    <td
                                        className={`border border-gray-300 px-4 py-2 ${
                                            classItem.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'
                                        }`}
                                    >
                                        {classItem.status === 'ACTIVE' ? 'Đang diễn ra' : classItem.status}
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClassList;
