import QRCode from 'qrcode.react';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

import Button from '~/components/Button';
import { getListBank } from '~/api/payos';
import { socket } from '~/services/socket';
import socketMessages from '~/config/configSocketEmit';
// eslint-disable-next-line no-unused-vars
import axios from '~/config/configAxios';
import { CheckmarkCircle02Icon } from 'hugeicons-react';
import { formatCurrencyVN } from '~/utils/currency';
import { SERVER_URL } from '~/config';

const BankPayment = ({ paramsValue, setShowModal }) => {
    // eslint-disable-next-line no-unused-vars
    const [bank, setBank] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [showModalSuccess, setShowModalSuccess] = useState(false);
    const navigate = useNavigate();

    const handleCopyText = (textToCopy) => {
        // Tạo một textarea ẩn để sao chép nội dung
        toast.success('Sao chép thành công');
        navigator.clipboard.writeText(textToCopy);
    };
    const cancelOrderHandle = async () => {
        setShowModal(false);
    };
    // eslint-disable-next-line no-unused-vars
    const confirmPaidHandle = async () => {
        const payload = {
            code: '00',
            desc: paramsValue.desc || 'des',
            success: true,
            data: {
                amount: paramsValue.amount,
                description: paramsValue.description,
                reference: paramsValue.reference,
                transactionDateTime: paramsValue.transactionDateTime,
                orderCode: paramsValue.orderCode,
                paymentLinkId: paramsValue.paymentLinkId,
            },
        };
        try {
            // eslint-disable-next-line no-unused-vars
            const res = await axios({
                method: 'POST',
                url: `${SERVER_URL}/payments/receive-hook`,
                data: payload,
            });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (!paramsValue?.bin) return;
        (async () => {
            try {
                const res = await getListBank();
                const bank = res.data.filter((bank) => bank.bin === paramsValue.bin);
                setBank(bank[0]);
            } catch (error) {
                console.error(error);
            }
        })();
        let setTimeOutId = null;
        socket.emit(socketMessages.PAYMENT_JOIN_ROOM, paramsValue.orderCode);
        socket.on(socketMessages.PAYMENT_UPDATE, (data) => {
            console.log('socketMessages.PAYMENT_UPDATE: ', data.data.code);
            console.log('paramsValue', paramsValue);

            if (data.data.code === '00') {
                setShowModalSuccess(true);
                setTimeOutId = setTimeout(() => {
                    navigate('/payment/history');
                }, 3000);
            }
        });
        return () => {
            clearTimeout(setTimeOutId);
            socket.emit(socketMessages.PAYMENT_LEAVE_ROOM, paramsValue.orderCode);
            socket.off(socketMessages.PAYMENT_UPDATE);
        };
    }, []);
    return (
        <div className="">
            <div className="flex justify-between m-5 space-x-4">
                <div className="flex-1 flex flex-col items-center m-4">
                    <div className="w-1/2 m-4">
                        <QRCode
                            value={paramsValue.qrCode}
                            level="M"
                            includeMargin={true}
                            renderAs="svg"
                            fgColor={'#25174E'}
                            bgColor="transparent"
                            style={{ borderRadius: 10, width: '100%', height: '100%' }}
                            className="!bg-gradient-to-br from-green-200 via-purple-200 to-green-200"
                        />
                    </div>
                    <div className="flex flex-col items-center">
                        <Button outlinePrimary roundedMd onClick={cancelOrderHandle}>
                            Huỷ
                        </Button>
                        <Button primary roundedMd onClick={confirmPaidHandle} className="opacity-0">
                            Tôi đã chuyển tiền
                        </Button>
                    </div>
                </div>
                <div className=" flex-1">
                    <div className="flex">
                        <img src={bank?.logo} width={100} height={55} alt="Bank-logo" />
                        <div>
                            Ngân hàng <br></br>
                            <span className="font-bold">{bank?.name}</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <h6>Chủ tài khoản: {paramsValue.accountName}</h6>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>
                                Số tài khoản : <p className="font-bold">{paramsValue.accountNumber}</p>
                            </p>
                            <Button outlinePrimary roundedMd onClick={() => handleCopyText(paramsValue.accountNumber)}>
                                Sao chép
                            </Button>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>
                                {' '}
                                Số tiền : <p className="font-bold">{formatCurrencyVN(paramsValue.amount)}</p>
                            </p>
                            <Button outlinePrimary roundedMd onClick={() => handleCopyText(paramsValue.amount)}>
                                Sao chép
                            </Button>
                        </div>
                        <div className="flex justify-between items-center">
                            <p>
                                Nội dung : <p className="font-bold">{paramsValue.description}</p>
                            </p>
                            <Button outlinePrimary roundedMd onClick={() => handleCopyText(paramsValue.description)}>
                                Sao chép
                            </Button>
                        </div>
                        <div>
                            Lưu ý : Nhập chính xác nội dung{' '}
                            <span className="!font-bold">{paramsValue.description}</span> khi chuyển khoản
                        </div>
                    </div>
                </div>
            </div>
            <div className="App">
                {showModalSuccess && (
                    <div
                        id="default-modal"
                        tabIndex="-1"
                        aria-hidden="true"
                        className="fixed top-0 right-0 left-0 z-99 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden"
                    >
                        <div className="relative p-4 w-1/4">
                            <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                <div className="p-4 md:p-5 space-y-4 text-gray-500 text-center flex-col justify-center">
                                    <div className="flex justify-center">
                                        <CheckmarkCircle02Icon className="text-success size-30" />
                                    </div>
                                    <h4>Thanh toán thành công!!!</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                )}{' '}
            </div>
        </div>
    );
};
export default BankPayment;
