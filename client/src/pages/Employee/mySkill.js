import React, { useEffect, useState } from 'react';
import axios from '~/config/configAxios';
import { getSkilessByTeacher } from '~/api/academies';
import { getChildrenBySkillId } from '~/api/user';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import Button from '~/components/Button';
import { Home01Icon } from 'hugeicons-react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const SkillList = () => {
    const { user } = useUserProvider();
    const navigate = useNavigate();
    const [skilles, setSkills] = useState([]);
    const [setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [deviceSize, setDeviceSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight,
    });
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredSkilles = Array.isArray(skilles)
        ? skilles.filter((skillItem) => skillItem.name.toLowerCase().includes(searchTerm.toLowerCase()))
        : [];
    const fetchSkillesByTeacher = async (teacherId) => {
        try {
            const response = await axios({
                url: getSkilessByTeacher.url,
                method: getSkilessByTeacher.method,
                params: { teacherId: teacherId },
            });
            const skillsData = response.data.data.skilles || [];
            setSkills(skillsData);
            return { skilles: skillsData };
        } catch (error) {
            console.error('Error fetching skills:', error);
            setError(error.message || 'Unknown error');
            setSkills([]); // Resetting state on error
            return { skilles: [] };
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
        const getSkilles = async () => {
            const teacherId = user._id;
            const { skilles: skillsData } = await fetchSkillesByTeacher(teacherId);
            setSkills(skillsData);
            setLoading(false);
        };

        getSkilles();
    }, [user]);

    useEffect(() => {
        const fetchChildren = async () => {
            if (selectedSkill) {
                try {
                    const response = await axios({
                        url: getChildrenBySkillId.url,
                        method: getChildrenBySkillId.method,
                        params: { skillId: selectedSkill._id },
                    });
                    setChildren(response.data.data);
                } catch (error) {
                    setError(error.message || 'Unknown error');
                }
            }
        };

        fetchChildren();
    }, [selectedSkill]);
    const handleShowClasses = () => {
        navigate(`/dashboards/my-class`);
    };
    const handleShowSkills = () => {
        navigate(`/dashboards/my-skill`);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="w-full p-5 bg-white shadow-md rounded-lg">
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
            <h2 style={{ textAlign: 'center', marginBottom: '50px' }}>Danh sách các lớp kĩ năng</h2>
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
                    {filteredSkilles.map((skillItem) => (
                        <tr
                            key={skillItem._id}
                            onClick={() => setSelectedSkill(skillItem)}
                            style={{ textAlign: 'center' }}
                        >
                            {deviceSize.width >= 500 ? (
                                <>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Link
                                            to={`/dashboards/my-skill/${skillItem._id}`}
                                            className="block text-blue-500 underline hover:text-blue-700"
                                        >
                                            {skillItem.name}
                                        </Link>
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(skillItem.startTime).toLocaleDateString('sv-SE')}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {new Date(skillItem.endTime).toLocaleDateString('sv-SE')}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">{skillItem.condition}</td>
                                    <td
                                        className={`border border-gray-300 px-4 py-2 ${
                                            skillItem.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'
                                        }`}
                                    >
                                        {skillItem.status === 'ACTIVE' ? 'Đang diễn ra' : skillItem.status}
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td className="border border-gray-300 px-4 py-2">
                                        <Link
                                            to={`/dashboards/my-skill/${skillItem._id}`}
                                            className="block text-blue-500 underline hover:text-blue-700"
                                        >
                                            {skillItem.name}
                                        </Link>
                                    </td>

                                    <td className="border border-gray-300 px-4 py-2">{skillItem.condition}</td>
                                    <td
                                        className={`border border-gray-300 px-4 py-2 ${
                                            skillItem.status === 'ACTIVE' ? 'text-green-500' : 'text-red-500'
                                        }`}
                                    >
                                        {skillItem.status === 'ACTIVE' ? 'Đang diễn ra' : skillItem.status}
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

export default SkillList;
