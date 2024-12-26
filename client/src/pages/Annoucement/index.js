import { Navbar } from 'reactstrap';
import { Home01Icon } from 'hugeicons-react';
import Button from '~/components/Button';
import React, { useState, useEffect } from 'react';
import { useSearch } from './search';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAnnoucement } from '~/api/annoucement';
import axios from '~/config/configAxios';
import { deleteProposal } from '~/api/proposal';

function Annoucement() {
    const { searchKeyword, filteredAnnoucement, handleSearchChange, handleSearchSubmit } = useSearch();
    const [annoucements, setAnnoucements] = useState([]);
    const navigate = useNavigate();

    const handleCreateAnnouce = () => {
        navigate('/createAnn');
    };

    const [votes, setVotes] = useState({});
    const initialPercentVotes = Object.fromEntries(annoucements.map((_, index) => [index, 0]));
    const [percentVotes] = useState(initialPercentVotes);

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        const newVotes = {};
        annoucements.forEach((_, index) => {
            if (!(index in votes)) {
                newVotes[index] = 0;
            }
        });
        setVotes({ ...votes, ...newVotes });
    }, [annoucements, votes]);

    const handleDelete = async (id) => {
        try {
            const res = await axios({
                method: 'DELETE',
                url: deleteProposal.url,
                params: { id: id },
                withCredentials: true,
            });

            console.log(res.data.message);

            // Remove the deleted announcement from the state
            setAnnoucements(annoucements.filter((annoucement) => annoucement._id !== id));

            toast.success('Xóa thông báo thành công');
        } catch (error) {
            console.error('Lỗi khi xóa thông báo:', error.message);
            toast.error('Không thể xóa thông báo');
        }
    };

    const fetchData = async () => {
        try {
            const res = await axios({
                method: getAnnoucement.method,
                url: getAnnoucement.url,
                withCredentials: true,
            });

            console.log('API Response:', res.data);

            if (res.data.status === 200) {
                const annoucementsWithDates = res.data.data.map((annoucementItem) => ({
                    ...annoucementItem,
                    createdAt: new Date(annoucementItem.createdAt),
                    updatedAt: new Date(annoucementItem.updatedAt),
                    endDate: new Date(annoucementItem.endDate),
                }));
                setAnnoucements(annoucementsWithDates);
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
            <div className="container mx-auto pt-10 pb-10">
                <h1 className="text-2xl font-bold mb-5 text-center">Các thông báo</h1>
                <Button onClick={handleCreateAnnouce} primary icon={<Home01Icon />}>
                    Tạo thông báo
                </Button>
                <div className="w-full sm:w-1/4" style={{ marginTop: '20px' }}>
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
                            onClick={() => handleSearchSubmit(annoucements)}
                            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                        >
                            Tìm
                        </button>
                    </div>
                </div>
                <div className="w-full">
                    {filteredAnnoucement.map((annoucementItem, index) => (
                        <div key={index} className="border-2 rounded-md p-4 mb-2 shadow-sm w-full relative bg-white">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(annoucementItem._id);
                                }}
                                className={`absolute top-2 right-2 rounded-md mr-3 px-2.5 py-1 text-sm font-semibold text-white ${
                                    annoucementItem.status === 'ACTIVE'
                                        ? 'bg-green-500 hover:bg-green-600'
                                        : annoucementItem.status === 'BLOCKED'
                                          ? 'bg-gray-500 hover:bg-gray-600'
                                          : annoucementItem.status === 'PASSED'
                                            ? 'bg-blue-500 hover:bg-blue-600'
                                            : annoucementItem.status === 'FAILED'
                                              ? 'bg-red-500 hover:bg-red-600'
                                              : ''
                                }`}
                            >
                                {annoucementItem.status}
                            </button>
                            <h2 className="text-lg font-bold">{annoucementItem.title}</h2>
                            <p>{annoucementItem.content}</p>
                            <p className="date">Bắt đầu: {annoucementItem.createdAt.toLocaleDateString()}</p>
                            <p className="date">Kết thúc: {annoucementItem.endDate.toLocaleDateString()}</p>
                            <p className="date">
                                Cập nhật:
                                {annoucementItem.updatedAt instanceof Date
                                    ? annoucementItem.updatedAt.toLocaleDateString()
                                    : ''}
                            </p>
                            {votes[index + 1] !== undefined && (
                                <div className="mt-2 text-sm text-gray-600">Bình chọn: {percentVotes[index + 1]}%</div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="w-full">
                    {annoucements.map((annoucementItem) => (
                        <div
                            key={annoucementItem._id}
                            className="border-2 rounded-md p-4 mb-2 shadow-sm w-full relative bg-white"
                        >
                            <Link to={`/annoucements/${annoucementItem._id}`} className="block w-full h-full">
                                <button
                                    className={`absolute top-2 right-2 rounded-md mr-3 px-2.5 py-1 text-sm font-semibold text-white ${
                                        annoucementItem.status === 'ACTIVE'
                                            ? 'bg-green-500 hover:bg-green-600'
                                            : annoucementItem.status === 'BLOCKED'
                                              ? 'bg-gray-500 hover:bg-gray-600'
                                              : annoucementItem.status === 'PASSED'
                                                ? 'bg-blue-500 hover:bg-blue-600'
                                                : annoucementItem.status === 'FAILED'
                                                  ? 'bg-red-500 hover:bg-red-600'
                                                  : ''
                                    }`}
                                >
                                    {annoucementItem.status}
                                </button>
                                <div>
                                    <h2 className="text-lg font-bold"> {annoucementItem.title}</h2>
                                    <p> {annoucementItem.content}</p>
                                    <p className="date">Bắt đầu: {annoucementItem.createdAt?.toLocaleDateString()}</p>
                                    <p className="date">Kết thúc: {annoucementItem.endDate?.toLocaleDateString()}</p>
                                    <p className="date">
                                        Cập nhật:
                                        {annoucementItem.updatedAt instanceof Date
                                            ? annoucementItem.updatedAt.toLocaleDateString()
                                            : ''}
                                    </p>
                                </div>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Annoucement;
