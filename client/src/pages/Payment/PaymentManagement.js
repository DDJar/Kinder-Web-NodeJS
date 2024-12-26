import React, { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import Button from '~/components/Button';
import axios from '~/config/configAxios';
import { getMyChildrenLearn } from '~/api/payment';
import { BookOpen02Icon, CheckmarkCircle02Icon } from 'hugeicons-react';
import { getCurrentMonthYear } from '~/utils/time';
import SelectedMonthYear from '~/components/SelectedMonthYear';

const getChildrenData = async (time) => {
    const res = await axios({
        method: getMyChildrenLearn.method,
        url: getMyChildrenLearn.url,
        params: { time },
    });
    return res.data;
};

const PaymentManagement = () => {
    // eslint-disable-next-line no-unused-vars
    const [childrenData, setChildrenData] = useState();
    const [currentMonth, setCurrentMonth] = useState(getCurrentMonthYear());
    const [time, setTime] = useState({
        month: getCurrentMonthYear().split('-')[1],
        year: getCurrentMonthYear().split('-')[0],
    });

    const handleChangeCurrentMonth = (month) => {
        setCurrentMonth(month);
        setTime({ month: month.split('-')[1], year: month.split('-')[0] });
    };

    useEffect(() => {
        const _getChildrenData = async () => {
            try {
                const res = await getChildrenData(time);
                if (res.status === 200) {
                    console.log(res.data.tuitionFees);
                    setChildrenData(res.data.tuitionFees);
                } else {
                    console.error(res.status);
                }
            } catch (error) {
                console.log(error);
            }
        };
        _getChildrenData();
    }, [getChildrenData, time]);
    return (
        <div className="mx-12 pb-100 pt-8">
            <div className=" flex justify-start mb-8">
                <Button primary className="mx-12" href={'/payment/history'} target="_self" icon={<BookOpen02Icon />}>
                    Xem lịch sử thanh toán
                </Button>
                <div className="flex items-center space-x-4">
                    <h6>
                        Thời gian: tháng {time.month}/{time.year}
                    </h6>
                    <SelectedMonthYear handleChangeCurrentMonth={handleChangeCurrentMonth} currentDate={currentMonth} />
                </div>
            </div>
            <div className="flex flex-wrap justify-around">
                {childrenData?.map((child) => (
                    <div key={child._id} className="text-center space-y-4">
                        <div className=" flex justify-center ">
                            <img
                                src={child.avatar || `img/default-avt.png`}
                                alt={`${child.firstName}'s avatar`}
                                className="size-30 rounded-full"
                            />
                        </div>
                        <p>
                            {child.firstName} {child.lastName}
                        </p>
                        {child.isLearning ? (
                            <Button
                                outlinePrimary={child.isPaid}
                                primary={!child.isPaid}
                                roundedMd
                                to={`/payment/detail?childId=${child._id}&month=${time.month}&year=${time.year}`}
                                target={`_self`}
                            >
                                {child.isPaid ? (
                                    <p className="flex space-x-4 items-center text-success font-bold">
                                        Đã thanh toán <CheckmarkCircle02Icon />
                                    </p>
                                ) : (
                                    'Thanh toan ngay'
                                )}
                            </Button>
                        ) : (
                            <Button
                                outlinePrimary={!child.isPaid}
                                primary={child.isPaid}
                                roundedMd
                                to={`/children/${child._id}/register`}
                                disable={!child.isPaid}
                                target={`_self`}
                            >
                                {!child.isPaid ? 'Thời điểm này con chưa đi học' : 'Đăng kí cho con đi học ngay'}
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default PaymentManagement;
