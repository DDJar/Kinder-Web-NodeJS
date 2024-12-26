import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import BankPayment from '~/pages/Payment/BankPayment';
import { Idea01Icon } from 'hugeicons-react';

const PaymentDetail = ({ checkoutData, setShowModal }) => {
    // eslint-disable-next-line no-unused-vars
    const [selectedIndex, setSelectedIndex] = useState(0);
    // eslint-disable-next-line no-unused-vars
    const location = useLocation();
    // const paramsValue = location.state;
    const paramsValue = checkoutData;
    if (paramsValue === null || paramsValue.qrCode == null) {
        return <div>Some thing went wrong!</div>;
    }
    // eslint-disable-next-line no-unused-vars
    const handleListItemClick = (event, index) => {
        // setSelectedIndex(index);
    };
    return (
        <div>
            <div className="flex justify-center space-x-4">
                <Idea01Icon className="text-yellow-400 " />
                <p className="text-center ">
                    Mở App Ngân hàng bất kỳ để <span className="font-bold">quét mã QR</span> hoặc
                    <span className="font-bold"> chuyển khoản</span> chính xác số tiền bên dưới
                </p>
            </div>
            <BankPayment paramsValue={paramsValue} setShowModal={setShowModal} />
        </div>
    );
};

export default PaymentDetail;
