import React, { useEffect, useState } from 'react';
import axios from '~/config/configAxios';
import { getHistoryPayment } from '~/api/payment';
import { formatCreatedAt } from '~/utils/time';
import { formatCurrencyVN } from '~/utils/currency';
import { convertContentVN } from '~/utils/message';
import Button from '~/components/Button';
import { ArrowLeft01Icon } from 'hugeicons-react';
import { useNavigate } from 'react-router-dom';

const HistoryPayment = () => {
    const [histories, setHistories] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchHistoryPayment = async () => {
            try {
                const res = await axios({
                    method: getHistoryPayment.method,
                    url: getHistoryPayment.url,
                });
                if (res.data.status === 200) {
                    setHistories(res.data.data);
                } else {
                    setHistories(null);
                }
            } catch (error) {
                setHistories(null);
            }
        };

        fetchHistoryPayment();
    }, []);
    const handleClick = (childId, month, year) => {
        navigate(`/payment/detail?childId=${childId}&month=${month}&year=${year}`);
    };
    return (
        <div>
            <div className=" flex justify-start">
                <Button text className="mx-12" href={'/payment'} target="_self" icon={<ArrowLeft01Icon />}>
                    Quay lại trang quản lí
                </Button>
            </div>
            <div className="relative shadow-md sm:rounded-lg mx-8 mt-8">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                    <thead className="bg-[#42b3c5] text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-2 py-3">
                                STT
                            </th>
                            <th scope="col" className="px-2 py-3">
                                Nội dung
                            </th>
                            <th scope="col" className="px-2 py-3">
                                Trẻ
                            </th>
                            <th scope="col" className="px-2 py-3">
                                Học phí tháng
                            </th>
                            <th scope="col" className="px-2 py-3">
                                Số tiền
                            </th>
                            <th scope="col" className="px-2 py-3">
                                Thời gian thực hiện
                            </th>
                            <th scope="col" className="px-2 py-3">
                                Ghi chú
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {histories &&
                            histories.map((transaction, index) => (
                                <tr
                                    key={index}
                                    className={`border-b hover:bg-gray-300 hover:cursor-pointer`}
                                    onClick={() =>
                                        handleClick(transaction.childId, transaction.month, transaction.year)
                                    }
                                >
                                    <th scope="row" className="p-2 font-bold text-gray-900 whitespace-nowrap uppercase">
                                        {index + 1}
                                    </th>
                                    <th className="p-2 text-gray-900 whitespace-nowrap ">
                                        {`Thanh toán cho: `}
                                        {transaction.content.split(',').map((text, index) => (
                                            <span key={index}>
                                                {convertContentVN(text)}
                                                {index < transaction.content.split(',').length - 1 ? ', ' : ''}
                                            </span>
                                        ))}
                                    </th>
                                    <td className="p-2">{`${transaction?.child.firstName} ${transaction?.child.lastName}`}</td>
                                    <td className="p-2">{`${transaction.month}/${transaction.year}`}</td>
                                    <td className="p-2">{formatCurrencyVN(transaction.amount)}</td>
                                    <td className="p-2">{formatCreatedAt(transaction.createdAt)}</td>
                                    <td className="p-2"></td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HistoryPayment;
