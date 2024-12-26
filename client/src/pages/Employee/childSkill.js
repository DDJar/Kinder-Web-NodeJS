import React, { useEffect, useState } from 'react';
import axios from '~/config/configAxios';
import { useParams } from 'react-router-dom';
import { getChildrenBySkillId } from '~/api/user';
import Button from '~/components/Button';
import { Home01Icon } from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const SkillDetails = () => {
    const { skillId } = useParams(); // Lấy classId từ URL
    const navigate = useNavigate();
    const [children, setChildren] = useState([]); // Cập nhật state của children
    const [loading, setLoading] = useState(true); // Cập nhật state của loading
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    const filteredChildren = children.filter(
        (child) =>
            child.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
    useEffect(() => {
        const fetchChildrenBySkill = async (skillId) => {
            try {
                const response = await axios({
                    url: getChildrenBySkillId.url, // Đảm bảo rằng URL này đúng
                    method: getChildrenBySkillId.method,
                    params: { skillId: skillId }, // Gửi classId chính xác
                });
                console.log('Children data:', response.data); // Log để kiểm tra
                setChildren(response.data.data); // Cập nhật children với dữ liệu từ API
                toast.success('Hiển thị thành công');
                setLoading(false); // Dừng loading sau khi nhận dữ liệu
            } catch (error) {
                console.error('Error fetching children by class:', error);
                setError(error.message || 'Unknown error');
                setLoading(false); // Dừng loading khi có lỗi
            }
        };

        // Gọi hàm fetch dữ liệu
        if (skillId) {
            fetchChildrenBySkill(skillId);
        }
    }, [skillId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    const handleShowClasses = () => {
        navigate(`/dashboards/my-skill`);
    };

    return (
        <div
            className="w-full p-10 bg-white shadow-md rounded-lg"
            style={{ paddingBottom: '50px', textAlign: 'center' }}
        >
            <h2 style={{ textAlign: 'center', paddingTop: '50px' }}>Danh sách học sinh của lớp</h2>
            <Button
                icon={<Home01Icon />}
                onClick={handleShowClasses}
                className="bg-primary text-white hover:bg-opacity80"
            >
                Quay lại
            </Button>
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
            {filteredChildren.length === 0 ? (
                <p style={{ textAlign: 'center', marginTop: '20px' }}>Không có học sinh nào trong lớp này.</p>
            ) : (
                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        marginTop: '20px',
                    }}
                >
                    <thead>
                        <tr>
                            <th className="bg-gray-100 border-black border-b  p-2">STT</th>
                            <th
                                style={{
                                    padding: '5px',
                                    backgroundColor: '#f2f2f2',
                                    borderBottom: '1px solid black',
                                }}
                            >
                                Ảnh
                            </th>
                            <th
                                style={{
                                    padding: '8px',
                                    backgroundColor: '#f2f2f2',
                                    borderBottom: '1px solid black',
                                }}
                            >
                                Họ và tên
                            </th>
                            <th
                                style={{
                                    padding: '8px',
                                    backgroundColor: '#f2f2f2',
                                    borderBottom: '1px solid black',
                                }}
                            >
                                Ngày sinh
                            </th>
                            <th
                                style={{
                                    padding: '8px',
                                    backgroundColor: '#f2f2f2',
                                    borderBottom: '1px solid black',
                                }}
                            >
                                Sở thích
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChildren.map((child, index) => (
                            <tr key={child._id}>
                                <td className="p-2 border-b border-black text-center md:text-center">{index + 1}</td>
                                <td style={{ padding: '8px', borderBottom: '1px solid black' }}>
                                    <img
                                        style={{
                                            marginTop: '5px',
                                            width: '170px',
                                            height: '170px',
                                            objectFit: 'cover',
                                            display: 'block', // Chuyển img thành block để áp dụng margin auto
                                            marginLeft: 'auto', // Căn giữa ngang
                                            marginRight: 'auto', // Căn giữa ngang
                                        }}
                                        src={child.avatar}
                                        alt={`${child.firstName} ${child.lastName}`}
                                    />
                                </td>
                                <td style={{ padding: '8px', borderBottom: '1px solid black' }}>
                                    {child.firstName} {child.lastName}
                                </td>
                                <td style={{ padding: '8px', borderBottom: '1px solid black' }}>
                                    {new Date(child.dateOfBirth).toLocaleDateString('sv-SE')}
                                </td>
                                <td style={{ padding: '8px', borderBottom: '1px solid black' }}>
                                    {child.favourite ? child.favourite : 'Chưa có thông tin'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SkillDetails;
