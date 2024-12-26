import PageTitle from '~/common/PageTitle';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '~/config/configAxios';
import { getAllHistoryPayment } from '~/api/payment';
import { convertContentVN } from '~/utils/message';
import { formatCurrencyVN } from '~/utils/currency';
import { formatCreatedAt } from '~/utils/time';
import Loading from '~/components/Loading';

const Transactions = () => {
    const [transactions, setTransactions] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchHistoryPayment = async () => {
            try {
                setIsLoading(true);
                const res = await axios({
                    method: getAllHistoryPayment.method,
                    url: getAllHistoryPayment.url,
                });
                if (res.data.status === 200) {
                    setTransactions(res.data.data);
                } else {
                    setTransactions(null);
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                setTransactions(null);
            }
        };

        fetchHistoryPayment();
    }, []);
    const handleClick = (childId, month, year) => {
        navigate(`/payment/detail?childId=${childId}&month=${month}&year=${year}`);
    };
    return (
        <div>
            <PageTitle title="Kindergarten | Transactions" />
            <div className="relative shadow-md sm:rounded-lg mx-8 mt-8">
                {isLoading ? (
                    <Loading />
                ) : (
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
                                    Phụ huynh
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
                            {transactions &&
                                transactions.map((transaction, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b hover:bg-gray-300 hover:cursor-pointer`}
                                        onClick={() =>
                                            handleClick(transaction.childId, transaction.month, transaction.year)
                                        }
                                    >
                                        <th
                                            scope="row"
                                            className="p-2 font-bold text-gray-900 whitespace-nowrap uppercase"
                                        >
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
                                        <td className="p-2">{`${transaction?.user?.firstName} ${transaction?.user?.lastName}`}</td>
                                        <td className="p-2">{`${transaction?.child?.firstName} ${transaction?.child?.lastName}`}</td>
                                        <td className="p-2">{`${transaction.month}/${transaction.year}`}</td>
                                        <td className="p-2">{formatCurrencyVN(transaction.amount)}</td>
                                        <td className="p-2">{formatCreatedAt(transaction.createdAt)}</td>
                                        <td className="p-2"></td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Transactions;
