import Button from '~/components/Button';
import axios from '~/config/configAxios';
import { createPaymen, getTuitionDetail } from '~/api/payment';
import { toast } from 'react-toastify';
import React, { useEffect, useState } from 'react';
import { ArrowLeft01Icon, Cancel01Icon } from 'hugeicons-react';
import PaymentDetail from '~/pages/Payment/PaymentDetail';
import TuitionDetail from '~/pages/Payment/TuitionDetail';
import useParamByKey from '~/hooks/useParamByKey';
import { useNavigate } from 'react-router-dom';
import Loading from '~/components/Loading';
import { getCurrentMonthYear } from '~/utils/time';

export async function createPaymentLink(formData) {
    try {
        const res = await axios({
            method: createPaymen.method,
            url: createPaymen.url,
            data: formData,
        });
        return res.data;
    } catch (error) {
        return error.response.data;
    }
}

const fetchDataTuition = async (childId, time) => {
    console.log('childId', childId);
    const data = { childId: childId, time };
    try {
        const res = await axios({
            method: getTuitionDetail.method,
            url: getTuitionDetail.url,
            params: data,
        });
        return res.data;
    } catch (error) {
        return null;
    }
};

const isValidTimeLessThanNow = (_month = 1, _year = 1) => {
    const currentMonth = getCurrentMonthYear().split('-')[1];
    const currentYear = getCurrentMonthYear().split('-')[0];
    if (_month <= 0 || _year <= 0) {
        return false;
    }
    if (_year > currentYear) {
        return false;
    }
    if (_year === currentYear && _month > currentMonth) {
        return false;
    }

    return true;
};

function Payment() {
    const navigate = useNavigate();
    const [openUICustomLoading, setOpenUICustomLoading] = useState(false);
    const [checkoutData, setCheckoutData] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [tuitionDetailData, setTuitionDetailData] = useState();
    const [paramChildId] = useParamByKey('childId');
    const [paramMonth] = useParamByKey('month');
    const [paramYear] = useParamByKey('year');
    const [isLoading, setIsLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonthYear());
    const [time, setTime] = useState({
        month: isValidTimeLessThanNow(paramMonth, paramYear) ? paramMonth : getCurrentMonthYear().split('-')[1],
        year: isValidTimeLessThanNow(paramMonth, paramYear) ? paramYear : getCurrentMonthYear().split('-')[0],
    });

    useEffect(() => {
        if (!paramChildId) {
            navigate('/payment');
        }
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const res = await fetchDataTuition(paramChildId, time);
                const dataTuition = res.data.tuitionFees;

                setTuitionDetailData(dataTuition);
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching tuition data:', error);
                setIsLoading(false);
            }
        };
        fetchData();
    }, [fetchDataTuition, paramChildId, time]);

    const handleChangeCurrentMonth = (month) => {
        setCurrentMonth(month);
        setTime({ month: month.split('-')[1], year: month.split('-')[0] });
    };

    const openUICustom = (checkoutResponse) => {
        const { accountName, accountNumber, amount, description, orderCode, qrCode, bin } = checkoutResponse;

        setCheckoutData({
            accountName,
            accountNumber,
            amount,
            description,
            orderCode,
            qrCode,
            bin,
        });
        setOpenUICustomLoading(false);
        setShowModal(true);
    };

    const createPaymentLinkHandle = async function (callbackFunction, setLoading) {
        setLoading(true);
        if (!paramChildId) {
            toast.error('Chưa xác định được id trẻ!');
            return;
        }
        try {
            const body = {
                description: `KINDER _ Thanh toan hoc phi`,
                productName: 'Ten ne',
                amount: tuitionDetailData.totalFees,
                returnUrl: 'http://localhost:3000/payment',
                cancelUrl: 'http://localhost:3000/payment',
                payFor: tuitionDetailData.payFor,
                time: time,
                childId: paramChildId,
            };
            let response = await createPaymentLink(body);
            if (response.error !== 0) throw new Error('Call Api failed: ');
            callbackFunction(response.data);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            toast.error('Có lỗi xảy ra');
        }
    };

    return (
        <div>
            <div className=" flex justify-start">
                <Button text className="mx-12" href={'/payment'} target="_self" icon={<ArrowLeft01Icon />}>
                    Quay lại trang quản lí
                </Button>
            </div>
            {!isLoading ? (
                <div>
                    {isLoading}
                    <TuitionDetail
                        handleOnClick={() => createPaymentLinkHandle(openUICustom, setOpenUICustomLoading)}
                        openUICustomLoading={openUICustomLoading}
                        tuitionDetailData={tuitionDetailData}
                        handleChangeCurrentMonth={handleChangeCurrentMonth}
                        currentMonth={currentMonth}
                        time={time}
                    />

                    <div className="App">
                        {showModal && (
                            <div
                                id="default-modal"
                                tabIndex="-1"
                                aria-hidden="true"
                                className="fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden bg-white bg-opacity-40"
                            >
                                <div className="relative p-4 w-3/4">
                                    <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                                        <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                                                Thanh toán
                                            </h3>
                                            <Button
                                                primary
                                                icon={<Cancel01Icon />}
                                                small
                                                onClick={() => setShowModal(false)}
                                                className="rounded-md  bg-red-500"
                                            ></Button>
                                        </div>
                                        <div className="p-4 md:p-5 space-y-4 text-gray-500">
                                            <PaymentDetail checkoutData={checkoutData} setShowModal={setShowModal} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}{' '}
                    </div>
                </div>
            ) : (
                <Loading>Đang load</Loading>
            )}
        </div>
    );
}

export default Payment;
