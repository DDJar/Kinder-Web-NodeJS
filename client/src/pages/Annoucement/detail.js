import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getAnnoucementById, updateAnnoucement } from '~/api/annoucement';
import { toast } from 'react-toastify';
import axios from '~/config/configAxios';
import Button from '~/components/Button';
import { LinkBackwardIcon } from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';
import EditAnnoucementPopup from './update';

const DetailAnnouce = () => {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const { id } = useParams();
    const [annoucements, setAnnoucements] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const annouceRes = await axios({
                    method: getAnnoucementById.method,
                    url: getAnnoucementById.url,
                    params: { id: id },
                    withCredentials: true,
                });
                setAnnoucements(annouceRes.data.data);
            } catch (error) {
                toast.error('Không thể lấy dữ liệu phiếu bầu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!annoucements) {
        return <p>Không tìm thấy thông báo</p>;
    }

    const handleBackAnnouce = () => {
        navigate('/annouce');
    };
    const handleClose = () => {
        setIsEditPopupOpen(false);
    };

    const handleSave = async (updatedAnnoucement) => {
        try {
            const res = await axios({
                method: 'PUT', // Sử dụng PUT để cập nhật đề xuất
                url: updateAnnoucement.url,
                params: { id: id }, // Sử dụng updatedProposal._id để lấy ID cần cập nhật
                withCredentials: true,
                data: {
                    title: updatedAnnoucement.title,
                    content: updatedAnnoucement.content,
                },
            });

            console.log(res.data.message);
            setIsEditPopupOpen(false);
            setAnnoucements(updatedAnnoucement); // Cập nhật giao diện với đề xuất đã chỉnh sửa
            toast.success('Cập nhật thông báo thành công');
        } catch (error) {
            console.error('Error updating annoucement:', error.response?.data || error.message);
            toast.error('Không thể cập nhật thông báo');
        }
    };

    const handleEditClick = () => {
        setIsEditPopupOpen(true); // Mở popup chỉnh sửa khi bấm nút
    };

    return (
        <div className="container mx-auto" style={{ width: '700px', height: '700px' }}>
            <Button
                onClick={handleBackAnnouce}
                primary
                icon={<LinkBackwardIcon />}
                className="rounded-md bg-slate-600 mb-10 mt-5"
            >
                Quay lại
            </Button>
            <h1 className="text-center">Chi tiết thông báo</h1>
            <div className="border-2 rounded-md p-4 mb-2 shadow-sm w-full relative bg-white mt-10">
                <div>
                    <h2 className="text-lg font-bold">{annoucements.title}</h2>
                    <button
                        className={`absolute top-2 right-2 rounded-md mr-3 px-2.5 py-1 text-sm font-semibold text-white ${
                            annoucements.status === 'ACTIVE'
                                ? 'bg-green-500 hover:bg-green-600'
                                : annoucements.status === 'BLOCKED'
                                  ? 'bg-gray-500 hover:bg-gray-600'
                                  : annoucements.status === 'PASSED'
                                    ? 'bg-blue-500 hover:bg-blue-600'
                                    : annoucements.status === 'FAILED'
                                      ? 'bg-red-500 hover:bg-red-600'
                                      : ''
                        }`}
                    >
                        {annoucements.status}
                    </button>
                    {annoucements.status !== 'BLOCKED' && (
                        <button
                            className="bg-blue-500 rounded-full px-3 py-1 text-white absolute bottom-2 right-0 mt-2 mr-2"
                            onClick={handleEditClick} // Gọi hàm handleEditClick khi bấm nút
                        >
                            Chỉnh sửa
                        </button>
                    )}

                    {/* Hiển thị EditProposalPopup khi isEditPopupOpen là true */}
                    {isEditPopupOpen && (
                        <EditAnnoucementPopup annoucements={annoucements} onSave={handleSave} onClose={handleClose} />
                    )}
                    <p>{annoucements.content}</p>
                    <p className="date">Bắt đầu: {new Date(annoucements.createdAt).toLocaleDateString()}</p>
                    <p className="date">Kết thúc: {new Date(annoucements.endDate).toLocaleDateString()}</p>
                    <p className="date">Cập nhật: {new Date(annoucements.updatedAt).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default DetailAnnouce;
