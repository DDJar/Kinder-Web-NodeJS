import { useEffect, useState } from 'react';
import Button from '~/components/Button';

const DetailsFee = ({ child }) => {
    // eslint-disable-next-line no-unused-vars
    const [totalFee, setTotalFee] = useState(
        child.detailsFees?.reduce((total, current) => total + current.value, 0) || 0,
    );
    // eslint-disable-next-line no-unused-vars
    const [selectedVounchers, setSelectedVounchers] = useState([]);
    // function handleTotalFees() {}
    useEffect(() => {
        setTotalFee(() => {
            let fees = child.detailsFees?.reduce((total, current) => total + current.value, 0) || 0;
            let totalDiscount = selectedVounchers.reduce((total, current) => total + current.discount, 0) || 0;
            return fees - totalDiscount >= 0 ? fees - totalDiscount : 0;
        });
    }, [selectedVounchers, child.detailsFees]);
    const handleVoucherChange = (voucher) => {
        if (selectedVounchers.some((v) => v._id === voucher._id)) {
            setSelectedVounchers((prev) => prev.filter((v) => v._id !== voucher._id));
        } else {
            setSelectedVounchers((prev) => [...prev, voucher]);
        }
    };

    return (
        <div className=" border rounded bg-gray-100 transition-opacity duration-1000 p-3">
            <h5 className="font-bold">Thông tin thanh toán</h5>
            <div className="flex justify-between">
                <table className="w-fit select-none">
                    <thead>
                        <tr className="text-left">
                            <th className=" p-2">Nội dung</th>
                            <th className=" p-2">Đơn giá</th>
                        </tr>
                    </thead>
                    <tbody>
                        {child.detailsFees.map((fee) => (
                            <tr
                                key={fee._id}
                                className="hover:bg-slate-200  border-b dark:bg-gray-800 dark:border-gray-700 "
                            >
                                <td className=" p-2">{fee.name}</td>
                                <td className=" p-2">{fee.value} vnđ</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="">
                    <div>
                        <h6>Vouncher</h6>
                    </div>
                    {child.vouchers?.map((voucher) => (
                        <div key={voucher._id}>
                            <input
                                type="checkbox"
                                id={voucher._id}
                                onChange={() => handleVoucherChange(voucher)}
                            ></input>
                            <label htmlFor={voucher._id} className="select-none hover: cursor-pointer">
                                {voucher.title} (<span className="text-error">- {voucher.discount} vnđ</span>)
                            </label>
                        </div>
                    ))}
                    <p className="mt-4">
                        Tổng tiền: {child.detailsFees?.reduce((total, current) => total + current.value, 0) || 0} vnđ
                    </p>
                    <p>
                        Giảm học phí: {selectedVounchers.reduce((total, current) => total + current.discount, 0) || 0}{' '}
                        vnđ
                    </p>
                    <p className="text-xl underline">Cần thanh toán: {totalFee}</p>
                    <Button primary roundedMd>
                        Thanh Toán
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default DetailsFee;
