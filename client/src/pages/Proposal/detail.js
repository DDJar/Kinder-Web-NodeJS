import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProposalById, getVote, updateProposal, createVote } from '~/api/proposal';
import { toast } from 'react-toastify';
import axios from '~/config/configAxios';
import Button from '~/components/Button';
import { LinkBackwardIcon } from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';
import EditProposalPopup from './update';

const DetailProposal = () => {
    const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
    const { id } = useParams();
    const [proposal, setProposal] = useState(null);
    const [votes, setVotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [hasVoted, setHasVoted] = useState(false);
    const [isAgreePopupOpen, setIsAgreePopupOpen] = useState(false);
    const [isOpposePopupOpen, setIsOpposePopupOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const proposalRes = await axios({
                    method: getProposalById.method,
                    url: getProposalById.url,
                    params: { id: id },
                    withCredentials: true,
                });
                setProposal(proposalRes.data.data);

                const voteRes = await axios({
                    method: getVote.method,
                    url: getVote.url,
                    params: { proposalId: id },
                    withCredentials: true,
                });
                const voteData = voteRes.data.data;
                console.log('Vote data:', voteData); // Kiểm tra dữ liệu nhận được từ API
                setVotes(voteData);
                if (voteData.some((vote) => vote.authorId)) {
                    setHasVoted(true);
                }
            } catch (error) {
                toast.error('Không thể lấy dữ liệu phiếu bầu');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleVote = async (type) => {
        try {
            if (hasVoted) {
                toast.info('Bạn đã bình chọn cho đề xuất này rồi.');
                return; // Ngừng thực hiện nếu người dùng đã bình chọn
            }

            // Nếu người dùng chưa bình chọn, tiếp tục thực hiện bỏ phiếu
            const response = await axios({
                url: createVote.url,
                method: createVote.method,
                data: {
                    proposalId: id,
                    isAgreed: type === 'agree',
                },
                withCredentials: true,
            });

            if (response.status === 200) {
                toast.success('Bình chọn thành công!');
                setHasVoted(true);

                // Cập nhật lại phiếu bầu và tỷ lệ phần trăm sau khi bình chọn thành công
                const updatedVoteRes = await axios({
                    method: getVote.method,
                    url: getVote.url,
                    params: { proposalId: id },
                    withCredentials: true,
                });
                const updatedVoteData = updatedVoteRes.data.data;
                setVotes(updatedVoteData);
            } else {
                toast.error('Không thể vote');
            }
        } catch (error) {
            toast.error('Không thể tiếp tục vì bạn đã vote rồi');
        }
    };

    const handleConfirmAgree = () => {
        handleVote('agree');
        setIsAgreePopupOpen(false);
    };

    const handleConfirmOppose = () => {
        handleVote('oppose');
        setIsOpposePopupOpen(false);
    };

    const handleCancel = () => {
        setIsAgreePopupOpen(false);
        setIsOpposePopupOpen(false);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!proposal) {
        return <p>Không tìm thấy đề xuất</p>;
    }

    const handleBackProposal = () => {
        navigate('/proposal');
    };
    const handleClose = () => {
        setIsEditPopupOpen(false);
    };

    const handleSave = async (updatedProposal) => {
        try {
            const res = await axios({
                method: 'PUT', // Sử dụng PUT để cập nhật đề xuất
                url: updateProposal.url,
                params: { id: id }, // Sử dụng updatedProposal._id để lấy ID cần cập nhật
                withCredentials: true,
                data: {
                    title: updatedProposal.title,
                    content: updatedProposal.content,
                },
            });
            console.log(res.data.message);
            const updatedData = res.data.data;
            console.log('Updated proposal data:', updatedData);
            setIsEditPopupOpen(false);
            setProposal(updatedProposal); // Cập nhật giao diện với đề xuất đã chỉnh sửa
            toast.success('Cập nhật đề xuất thành công');
        } catch (error) {
            console.error('Error updating proposal:', error.message);
            toast.error('Không thể cập nhật đề xuất');
        }
    };

    const handleEditClick = () => {
        setIsEditPopupOpen(true); // Mở popup chỉnh sửa khi bấm nút
    };

    const totalVotes = votes.length;
    const agreeVotes = votes.filter((vote) => vote.isAgreed).length;
    const opposeVotes = totalVotes - agreeVotes;
    const agreePercentage = (agreeVotes / totalVotes) * 100;
    const opposePercentage = (opposeVotes / totalVotes) * 100;

    return (
        <div className="container mx-auto" style={{ width: '700px', height: '700px' }}>
            <Button
                onClick={handleBackProposal}
                primary
                icon={<LinkBackwardIcon />}
                className="rounded-md bg-slate-600 mb-10 mt-5"
            >
                Quay lại
            </Button>
            <h1 className="text-center">Chi tiết đề xuất</h1>
            <div className="border-2 rounded-md p-4 mb-2 shadow-sm w-full relative bg-white mt-10">
                <div>
                    <h2 className="text-lg font-bold">{proposal.title}</h2>
                    <button
                        className={`absolute top-2 right-2 rounded-md mr-3 px-2.5 py-1 text-sm font-semibold text-white ${
                            proposal.status === 'ACTIVE'
                                ? 'bg-green-500 hover:bg-green-600'
                                : proposal.status === 'BLOCKED'
                                  ? 'bg-gray-500 hover:bg-gray-600'
                                  : proposal.status === 'PASSED'
                                    ? 'bg-blue-500 hover:bg-blue-600'
                                    : proposal.status === 'FAILED'
                                      ? 'bg-red-500 hover:bg-red-600'
                                      : ''
                        }`}
                    >
                        {proposal.status}
                    </button>
                    {proposal.status !== 'BLOCKED' && (
                        <button
                            className="bg-blue-500 rounded-full px-3 py-1 text-white absolute bottom-2 right-0 mt-2 mr-2"
                            onClick={handleEditClick} // Gọi hàm handleEditClick khi bấm nút
                        >
                            Chỉnh sửa
                        </button>
                    )}

                    {/* Hiển thị EditProposalPopup khi isEditPopupOpen là true */}
                    {isEditPopupOpen && (
                        <EditProposalPopup proposal={proposal} onSave={handleSave} onClose={handleClose} />
                    )}
                    <p>{proposal.content}</p>
                    <p className="date">
                        Bắt đầu:{' '}
                        {proposal.createdAt ? new Date(proposal.createdAt).toLocaleDateString() : 'Invalid Date'}
                    </p>
                    <p className="date">
                        Kết thúc: {proposal.endDate ? new Date(proposal.endDate).toLocaleDateString() : 'Invalid Date'}
                    </p>
                    <p className="date">
                        Cập nhật:{' '}
                        {proposal.updatedAt ? new Date(proposal.updatedAt).toLocaleDateString() : 'Invalid Date'}
                    </p>
                    {totalVotes > 0 ? (
                        <div className="mt-2 text-sm text-gray-600">
                            <p>Tổng số phiếu: {totalVotes}</p>
                            <p>Bình chọn: {agreePercentage.toFixed(2)}%</p>
                            <p>Phản đối: {opposePercentage.toFixed(2)}%</p>
                        </div>
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
                {proposal.status !== 'BLOCKED' && (
                    <div className="flex justify-start mt-2 mb-2">
                        <button
                            onClick={() => !hasVoted && setIsAgreePopupOpen(true)}
                            disabled={hasVoted} // Vô hiệu hóa nút nếu đã bình chọn
                            className={`rounded-md bg-green-500 px-2.5 py-1 text-sm font-semibold text-white hover:bg-green-600 mr-2 ${
                                hasVoted ? 'cursor-not-allowed' : ''
                            }`}
                        >
                            CÓ
                        </button>
                        <button
                            onClick={() => !hasVoted && setIsOpposePopupOpen(true)}
                            disabled={hasVoted} // Vô hiệu hóa nút nếu đã bình chọn
                            className={`rounded-md bg-red-500 px-2.5 py-1 text-sm font-semibold text-white hover:bg-red-600 ${
                                hasVoted ? 'cursor-not-allowed' : ''
                            }`}
                        >
                            KHÔNG
                        </button>
                    </div>
                )}

                {isAgreePopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-md">
                            <h2 className="text-lg font-bold mb-2">Xác nhận Bình chọn</h2>
                            <p>Bạn có chắc chắn muốn bình chọn đề xuất này?</p>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleConfirmAgree}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 mr-2"
                                >
                                    Xác nhận
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {isOpposePopupOpen && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-4 rounded-md">
                            <h2 className="text-lg font-bold mb-2">Xác nhận Phản đối</h2>
                            <p>Bạn có chắc chắn muốn phản đối đề xuất này?</p>
                            <div className="flex justify-end mt-4">
                                <button
                                    onClick={handleConfirmOppose}
                                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-2"
                                >
                                    Xác nhận
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                                >
                                    Hủy bỏ
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DetailProposal;
