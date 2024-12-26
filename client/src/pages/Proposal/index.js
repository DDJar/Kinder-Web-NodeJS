import { Navbar } from 'reactstrap';
import { Home01Icon } from 'hugeicons-react';
import Button from '~/components/Button';
import React, { useState, useEffect } from 'react';
import { useSearch } from './Search';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProposal } from '~/api/proposal';
import axios from '~/config/configAxios';
import { deleteProposal } from '~/api/proposal';

function Proposal() {
    const { searchKeyword, filteredProposals, handleSearchChange, handleSearchSubmit } = useSearch();
    const [proposals, setProposals] = useState([]);
    const navigate = useNavigate();

    const handleCreateProposal = () => {
        navigate('/create');
    };
    useEffect(() => {
        fetchData();
    }, []);
    const handleDelete = async (id) => {
        try {
            const res = await axios({
                method: 'DELETE', // Sử dụng PUT để cập nhật đề xuất
                url: deleteProposal.url,
                params: { id: id },
                withCredentials: true, // Nếu có yêu cầu xác thực
            });

            console.log(res.data.message); // Log thông báo từ backend (nếu có)

            // Cập nhật giao diện hoặc thực hiện các thao tác khác sau khi xóa thành công

            toast.success('Xóa đề xuất thành công'); // Hiển thị thông báo thành công
        } catch (error) {
            console.error('Lỗi khi xóa đề xuất:', error.message); // Log lỗi nếu có
            toast.error('Không thể xóa đề xuất'); // Hiển thị thông báo lỗi
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios({
                method: getProposal.method,
                url: getProposal.url,
                withCredentials: true,
            });

            console.log('API Response:', res.data); // Kiểm tra dữ liệu trả về từ API

            if (res.data.status === 200) {
                const proposalsWithDates = res.data.data.map((proposalItem) => ({
                    ...proposalItem,
                    createdAt: new Date(proposalItem.createdAt),
                    updatedAt: new Date(proposalItem.updatedAt),
                    endDate: new Date(proposalItem.endDate),
                }));
                setProposals(proposalsWithDates);
                toast.success('Hiển thị thành công', {
                    autoClose: 1000,
                    closeOnClick: true,
                });
            } else {
                console.log('Error:', res.data.message);
            }
        } catch (error) {
            toast.error(`Hiển thị thất bại: ${error.message}`, {
                autoClose: 3000,
                closeOnClick: true,
            });
        }
    };

    return (
        <>
            <Navbar />
            <div className="container mx-auto pt-10">
                <h1 className="text-2xl font-bold mb-5 text-center">Đề xuất các hoạt động</h1>
                <Button onClick={handleCreateProposal} primary icon={<Home01Icon />}>
                    Tạo đề xuất
                </Button>
                <div className="w-full sm:w-1/4 " style={{ marginTop: '20px' }}>
                    <label
                        htmlFor="default-search"
                        className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
                    >
                        Tìm
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                                />
                            </svg>
                        </div>
                        <input
                            type="search"
                            id="default-search"
                            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            placeholder="Tìm kiếm..."
                            value={searchKeyword}
                            onChange={handleSearchChange}
                        />
                        <button
                            type="button"
                            onClick={() => handleSearchSubmit(proposals)}
                            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Tìm
                        </button>
                    </div>
                </div>
                <div className="w-full">
                    {filteredProposals.map((proposalItem, index) => (
                        <div key={index} className="border-2 rounded-md p-4 mb-2 shadow-sm w-full relative bg-white">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(proposalItem);
                                }}
                                className={`absolute top-2 right-2 rounded-md mr-3 px-2.5 py-1 text-sm font-semibold text-white ${
                                    proposalItem.status === 'ACTIVE'
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : proposalItem.status === 'BLOCKED'
                                          ? 'bg-gray-500 hover:bg-gray-600'
                                          : proposalItem.status === 'PASSED'
                                            ? 'bg-blue-500 hover:bg-blue-600'
                                            : proposalItem.status === 'FAILED'
                                              ? 'bg-red-500 hover:bg-red-600'
                                              : ''
                                }`}
                            >
                                {proposalItem.status}
                            </button>
                            <h2 className="text-lg font-bold">{proposalItem.title}</h2>
                            <p>{proposalItem.content}</p>
                            <p className="date">Bắt đầu: {proposalItem.createdAt.toLocaleDateString()}</p>
                            <p className="date">Kết thúc: {proposalItem.endDate.toLocaleDateString()}</p>
                            <p className="date">
                                Cập nhật:
                                {proposalItem.updatedAt instanceof Date
                                    ? proposalItem.updatedAt.toLocaleDateString()
                                    : ''}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="w-full">
                    {proposals.map((proposalItem) => (
                        <div
                            key={proposalItem._id.$oid}
                            className="border-2 rounded-md p-4 mb-2 shadow-sm w-full relative bg-white"
                        >
                            <Link to={`/proposals/${proposalItem._id}`} className="block w-full h-full">
                                <button
                                    className={`absolute top-2 right-2 rounded-md mr-3 px-2.5 py-1 text-sm font-semibold text-white ${
                                        proposalItem.status === 'ACTIVE'
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : proposalItem.status === 'BLOCKED'
                                              ? 'bg-gray-500 hover:bg-gray-600'
                                              : proposalItem.status === 'PASSED'
                                                ? 'bg-blue-500 hover:bg-blue-600'
                                                : proposalItem.status === 'FAILED'
                                                  ? 'bg-red-500 hover:bg-red-600'
                                                  : ''
                                    }`}
                                >
                                    {proposalItem.status}
                                </button>
                                <div>
                                    <h2 className="text-lg font-bold"> {proposalItem.title}</h2>
                                    <p> {proposalItem.content}</p>
                                    <p className="date">Bắt đầu: {proposalItem.createdAt?.toLocaleDateString()}</p>
                                    <p className="date">Kết thúc: {proposalItem.endDate?.toLocaleDateString()}</p>
                                    <p className="date">
                                        Cập nhật:
                                        {proposalItem.updatedAt instanceof Date
                                            ? proposalItem.updatedAt.toLocaleDateString()
                                            : ''}
                                    </p>
                                </div>
                            </Link>
                            <button
                                className="absolute bottom-2 right-2 rounded-md mr-3 px-2.5 py-1 text-sm font-semibold text-white bg-red-500"
                                onClick={() => handleDelete(proposalItem._id)} // Truyền id của proposalItem vào hàm handleDelete
                            >
                                X
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Proposal;
