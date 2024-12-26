import React, { useEffect, useState } from 'react';
import axios from '~/config/configAxios';
import { getClassesByTeacher } from '~/api/academies';
import { findChildrenByClassId } from '~/api/user';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import Button from '~/components/Button';
import { Home01Icon } from 'hugeicons-react';

const ClassList = () => {
    const { user } = useUserProvider();
    const [classes, setClasses] = useState([]);
    const [skilles, setSkills] = useState([]);
    const [children, setChildren] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('classes');
    const [selectedClass, setSelectedClass] = useState(null);

    const fetchClassesByTeacher = async (teacherId) => {
        try {
            const response = await axios({
                url: getClassesByTeacher.url,
                method: getClassesByTeacher.method,
                params: { teacherId: teacherId },
            });
            return { classes: response.data.data.classes, skilles: response.data.data.skilles };
        } catch (error) {
            console.error('Error fetching classes and skills:', error);
            setError(error.message || 'Unknown error');
            return { classes: [], skilles: [] };
        }
    };

    const fetchChildrenByClassId = async (classId) => {
        try {
            if (!classId) return;
            const { url, method } = findChildrenByClassId(classId);
            const response = await axios({
                url: url,
                method: method,
            });
            setChildren(response.data.data);
        } catch (error) {
            console.error('Error fetching children:', error);
            setError(error.message || 'Unknown error');
        }
    };

    useEffect(() => {
        const getClasses = async () => {
            const teacherId = user._id;
            const { classes: classesData, skilles: skillsData } = await fetchClassesByTeacher(teacherId);
            setClasses(classesData);
            setSkills(skillsData);
            setLoading(false);
        };

        getClasses();
    }, [user]);

    useEffect(() => {
        fetchChildrenByClassId(selectedClass);
    }, [selectedClass]);

    const handleShowClasses = () => {
        setActiveTab('classes');
    };

    const handleShowSkills = () => {
        setActiveTab('skills');
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container" style={{ marginLeft: '50px', marginBottom: '10px', textAlign: 'center' }}>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <Button
                    icon={<Home01Icon />}
                    outlineSecondary={activeTab === 'classes'}
                    onClick={handleShowClasses}
                    className="bg-primary text-white hover:bg-opacity80"
                >
                    Lớp học
                </Button>
                <Button
                    icon={<Home01Icon />}
                    outlineSecondary={activeTab === 'skills'}
                    onClick={handleShowSkills}
                    className="bg-primary text-white hover:bg-opacity80"
                >
                    Kỹ năng
                </Button>
            </div>

            {activeTab === 'classes' && classes.length > 0 && (
                <>
                    <h1 style={{ textAlign: 'center', marginTop: '15px' }}>Danh sách các lớp của tôi</h1>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginTop: '20px',
                        }}
                    >
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        padding: '8px',
                                        backgroundColor: '#f2f2f2',
                                        borderBottom: '1px solid black',
                                    }}
                                >
                                    Tên lớp
                                </th>
                                <th
                                    style={{
                                        padding: '8px',
                                        backgroundColor: '#f2f2f2',
                                        borderBottom: '1px solid black',
                                    }}
                                >
                                    Ngày bắt đầu
                                </th>
                                <th
                                    style={{
                                        padding: '8px',
                                        backgroundColor: '#f2f2f2',
                                        borderBottom: '1px solid black',
                                    }}
                                >
                                    Ngày kết thúc
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.map((classItem) => (
                                <tr key={classItem._id}>
                                    <td style={{ padding: '8px', borderBottom: '1px solid black' }}>
                                        <button
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: 'blue',
                                                textDecoration: 'underline',
                                                cursor: 'pointer',
                                            }}
                                            onClick={() => setSelectedClass(classItem._id)}
                                        >
                                            {classItem.name}
                                        </button>
                                    </td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid black' }}>
                                        {classItem.startTime}
                                    </td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid black' }}>
                                        {classItem.endTime}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}

            {selectedClass && children.length > 0 && (
                <>
                    <h2 style={{ textAlign: 'center', marginTop: '20px' }}>Danh sách học sinh của lớp</h2>
                    <ul>
                        {children.map((child) => (
                            <li key={child._id}>{child.name}</li>
                        ))}
                    </ul>
                </>
            )}

            {activeTab === 'skills' && skilles.length > 0 && (
                <>
                    <h2 style={{ textAlign: 'center', marginTop: '25px' }}>Danh sách các lớp kỹ năng</h2>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            marginTop: '20px',
                        }}
                    >
                        <thead>
                            <tr>
                                <th
                                    style={{
                                        padding: '8px',
                                        backgroundColor: '#f2f2f2',
                                        borderBottom: '1px solid black',
                                    }}
                                >
                                    Tên lớp
                                </th>
                                <th
                                    style={{
                                        padding: '8px',
                                        backgroundColor: '#f2f2f2',
                                        borderBottom: '1px solid black',
                                    }}
                                >
                                    Mã lớp
                                </th>
                                <th
                                    style={{
                                        padding: '8px',
                                        backgroundColor: '#f2f2f2',
                                        borderBottom: '1px solid black',
                                    }}
                                >
                                    Ngày bắt đầu
                                </th>
                                <th
                                    style={{
                                        padding: '8px',
                                        backgroundColor: '#f2f2f2',
                                        borderBottom: '1px solid black',
                                    }}
                                >
                                    Ngày kết thúc
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {skilles.map((skillItem) => (
                                <tr key={skillItem._id}>
                                    <td style={{ padding: '8px', borderBottom: '1px solid black' }}>
                                        {skillItem.name}
                                    </td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid black' }}>{skillItem._id}</td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid black' }}>
                                        {skillItem.startTime}
                                    </td>
                                    <td style={{ padding: '8px', borderBottom: '1px solid black' }}>
                                        {skillItem.endTime}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default ClassList;
