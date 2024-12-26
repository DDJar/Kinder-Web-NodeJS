import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '~/config/configAxios';
import { toast } from 'react-toastify';
import { getAllRooms, updateRoom } from '~/api/room';
import Button from '~/components/Button';
import { ViewIcon, Edit01Icon } from 'hugeicons-react';

function Modal({ isOpen, onClose, url }) {
    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '5px',
                    maxWidth: '500px',
                    width: '80%',
                }}
            >
                <h2>Camera View</h2>
                <iframe src={url} width="100%" height="300px" style={{ border: 'none' }} title="Camera View"></iframe>
                <Button onClick={onClose} className="bg-primary text-white hover:bg-opacity80">
                    Đóng
                </Button>
            </div>
        </div>
    );
}

function EditRoomModal({ isOpen, onClose, room, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        totalSeats: '',
        cameraUrl: '',
        status: 'ACTIVE',
    });

    useEffect(() => {
        if (room) {
            setFormData({
                name: room.name || '',
                totalSeats: room.totalSeats || '',
                cameraUrl: room.cameraUrl || '',
                status: room.status || 'ACTIVE',
            });
        }
    }, [room]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        if (formData.totalSeats < 0 || formData.totalSeats > 100) {
            toast.error('Số chỗ khả dụng phải nằm trong khoảng từ 0 đến 100');
            return;
        }
        try {
            const res = await axios({
                url: updateRoom.url.replace(':id', room._id),
                method: updateRoom.method,
                data: formData,
            });
            if (res.data.status === 200) {
                toast.success('Cập nhật phòng thành công!');
                onSave();
                onClose();
            } else {
                throw new Error(res.data.message);
            }
        } catch (error) {
            toast.error(`Lỗi khi cập nhật phòng: ${error.message}`);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <div
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '5px',
                    maxWidth: '700px',
                    width: '80%',
                }}
            >
                <h2>Chỉnh sửa phòng</h2>
                <div className="border-y border-solid">
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px',
                            marginTop: '20px',
                        }}
                    >
                        <label
                            htmlFor="name"
                            style={{
                                flex: '1',
                                marginRight: '10px',
                                color: 'gray',
                                fontWeight: 'bold',
                                textAlign: 'left',
                            }}
                        >
                            Tên phòng:
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="border border-gray-600 rounded"
                            style={{
                                flex: '2',
                                padding: '8px',
                                color: 'gray',
                                marginLeft: '10px',
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px',
                        }}
                    >
                        <label
                            htmlFor="totalSeats"
                            style={{
                                flex: '1',
                                marginRight: '10px',
                                color: 'gray',
                                fontWeight: 'bold',
                                textAlign: 'left',
                            }}
                        >
                            Số chỗ khả dụng:
                        </label>
                        <input
                            type="number"
                            name="totalSeats"
                            value={formData.totalSeats}
                            onChange={handleChange}
                            className="border border-gray-600 rounded"
                            style={{
                                flex: '2',
                                padding: '8px',
                                color: 'gray',
                                marginLeft: '10px',
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '10px',
                        }}
                    >
                        <label
                            htmlFor="cameraUrl"
                            style={{
                                flex: '1',
                                marginRight: '10px',
                                color: 'gray',
                                fontWeight: 'bold',
                                textAlign: 'left',
                            }}
                        >
                            Camera URL:
                        </label>
                        <input
                            type="text"
                            name="cameraUrl"
                            value={formData.cameraUrl}
                            onChange={handleChange}
                            className="border border-gray-600 rounded"
                            style={{
                                flex: '2',
                                padding: '8px',
                                color: 'gray',
                                marginLeft: '10px',
                            }}
                        />
                    </div>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '30px',
                        }}
                    >
                        <label
                            htmlFor="status"
                            style={{
                                flex: '1',
                                marginRight: '10px',
                                color: 'gray',
                                fontWeight: 'bold',
                                textAlign: 'left',
                            }}
                        >
                            Trạng thái:
                        </label>
                        <select
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            className="border border-gray-600 rounded"
                            style={{
                                flex: '2',
                                padding: '8px',
                                color: 'gray',
                                marginLeft: '10px',
                            }}
                        >
                            <option value="ACTIVE">ACTIVE</option>
                            <option value="BLOCK">BLOCK</option>
                        </select>
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        gap: '10px',
                        marginTop: '20px',
                    }}
                >
                    <Button roundedMd onClick={handleSubmit} className="bg-primary text-white hover:bg-opacity80">
                        Lưu
                    </Button>
                    <Button roundedMd onClick={onClose} className="bg-secondary text-white hover:bg-opacity80">
                        Hủy
                    </Button>
                </div>
            </div>
        </div>
    );
}

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);

    const [modalUrl, setModalUrl] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const currentPage = parseInt(searchParams.get('page') || '1', 10);

    const fetchRooms = async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios({
                url: `${getAllRooms.url}?page=${page}`,
                method: getAllRooms.method,
            });
            if (res.data.status === 200) {
                setRooms(res.data.data);
                setTotalPages(res.data.totalPages);
            } else {
                throw new Error(res.data.message);
            }
        } catch (error) {
            toast.error(`Lỗi khi lấy danh sách phòng: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRooms(currentPage);
    }, [currentPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setSearchParams({ page: newPage });
        }
    };

    const openModal = (url) => {
        setModalUrl(url);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalUrl('');
    };

    const openEditModal = (room) => {
        setSelectedRoom(room);
        setEditModalOpen(true);
    };

    const closeEditModal = () => {
        setEditModalOpen(false);
        setSelectedRoom(null);
    };

    return (
        <div className="w-full">
            <div
                className="overflow-x-auto shadow-md sm:rounded-lg"
                style={{ marginLeft: '50px', marginBottom: '20px', textAlign: 'center' }}
            >
                <h1 style={{ marginTop: '15px', fontWeight: 'bold' }}>Danh sách phòng học</h1>
                {loading ? (
                    <p>Đang tải...</p>
                ) : (
                    <>
                        <table className="w-full min-h-100 text-sm text-left text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th
                                        style={{
                                            padding: '8px',
                                            backgroundColor: '#f2f2f2',
                                            textAlign: 'center',
                                        }}
                                    >
                                        STT
                                    </th>
                                    <th
                                        style={{
                                            padding: '8px',
                                            backgroundColor: '#f2f2f2',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Tên phòng
                                    </th>
                                    <th
                                        style={{
                                            padding: '8px',
                                            backgroundColor: '#f2f2f2',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Số chỗ khả dụng
                                    </th>
                                    <th
                                        style={{
                                            padding: '8px',
                                            backgroundColor: '#f2f2f2',
                                            textAlign: 'center',
                                        }}
                                    >
                                        Camera
                                    </th>
                                    <th
                                        style={{
                                            padding: '8px',
                                            backgroundColor: '#f2f2f2',
                                            textAlign: 'center',
                                        }}
                                    ></th>
                                </tr>
                            </thead>
                            <tbody>
                                {rooms.map((room, index) => (
                                    <tr
                                        key={room._id}
                                        className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                                    >
                                        <td
                                            style={{
                                                padding: '10px',
                                                textAlign: 'center',
                                                backgroundColor: '#ffffff',
                                            }}
                                        >
                                            {(currentPage - 1) * 5 + (index + 1)}
                                        </td>
                                        <td
                                            style={{
                                                padding: '8px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {room.name}
                                        </td>
                                        <td
                                            style={{
                                                padding: '8px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {room.totalSeats}
                                        </td>
                                        <td
                                            style={{
                                                padding: '8px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                <Button
                                                    outlineInfo
                                                    icon={
                                                        <ViewIcon
                                                            size={24}
                                                            color={'#223dec'}
                                                            variant={'stroke'}
                                                            onClick={() => openModal(room.cameraUrl)}
                                                        />
                                                    }
                                                />
                                            </div>
                                        </td>
                                        <td
                                            style={{
                                                padding: '8px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                                                <Button
                                                    outlineWarning
                                                    icon={
                                                        <Edit01Icon
                                                            size={24}
                                                            color={'#ff9800'}
                                                            variant={'stroke'}
                                                            onClick={() => openEditModal(room)}
                                                        />
                                                    }
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: '10px',
                                marginTop: '20px',
                                marginBottom: '20px',
                            }}
                        >
                            <Button
                                disabled={currentPage <= 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                                roundedMd
                                className={`bg-primary text-white hover:bg-opacity80 ${
                                    currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                Trang trước
                            </Button>
                            <span>Trang {currentPage}</span>
                            <Button
                                disabled={currentPage >= totalPages}
                                roundedMd
                                onClick={() => handlePageChange(currentPage + 1)}
                                className={`bg-primary text-white hover:bg-opacity80 ${
                                    currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                Trang sau
                            </Button>
                        </div>
                    </>
                )}
                <Modal isOpen={isModalOpen} onClose={closeModal} url={modalUrl} />
                <EditRoomModal
                    isOpen={editModalOpen}
                    onClose={closeEditModal}
                    room={selectedRoom}
                    onSave={() => fetchRooms(currentPage)}
                />
            </div>
        </div>
    );
}

export default RoomList;
