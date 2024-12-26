import { CheckmarkCircle02Icon, Loading02Icon, PaymentSuccess01Icon } from 'hugeicons-react';
import React from 'react';
import Button from '~/components/Button';
import Loading from '~/components/Loading';
import { formatCurrencyVN } from '~/utils/currency';
import SelectedMonthYear from '~/components/SelectedMonthYear';
import { formatCreatedAt } from '~/utils/time';

const TuitionDetail = ({
    handleOnClick,
    openUICustomLoading,
    tuitionDetailData,
    handleChangeCurrentMonth,
    currentMonth,
    time,
}) => {
    return (
        <div>
            {tuitionDetailData?._id ? (
                <div>
                    <div className="border mx-12">
                        <div className="p-5">
                            <header className="flex items-center ">
                                <div className="flex-1">
                                    <p className="font-bold">TRƯỜNG MẦM NON KINDERGARTEN ABC</p>
                                    <p className="text-xs">Địa chỉ: 123 Đường ABC, Thành phố XYZ, Việt Nam</p>
                                </div>
                                <div className="flex-1">
                                    <p className="font-bold text-3xl">THÔNG BÁO HỌC PHÍ</p>
                                    <div className="font-bold flex items-center space-x-4">
                                        <p>
                                            CHI TIẾT HỌC PHÍ THÁNG:{' '}
                                            <span className="text-error">{`${time.month}/${time.year}`}</span>
                                        </p>
                                        <SelectedMonthYear
                                            handleChangeCurrentMonth={handleChangeCurrentMonth}
                                            currentDate={currentMonth}
                                        />
                                    </div>
                                </div>
                            </header>
                            <div className="font-bold  mt-6 flex justify-between mb-2">
                                <div>
                                    <p>
                                        <span className="underline">Kính gửi phụ huynh em:</span>
                                        <span>{` ${tuitionDetailData.firstName} ${tuitionDetailData.lastName}`}</span>
                                    </p>
                                </div>
                                <Button
                                    primary
                                    roundedMd
                                    disable={openUICustomLoading || tuitionDetailData.totalFees === 0}
                                    icon={
                                        openUICustomLoading ? (
                                            <Loading02Icon className="animate-spin" />
                                        ) : (
                                            <PaymentSuccess01Icon />
                                        )
                                    }
                                    onClick={handleOnClick}
                                >
                                    Thanh toán ngay
                                </Button>
                            </div>
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
                                                Đơn vị tính
                                            </th>
                                            <th scope="col" className="px-2 py-3">
                                                Số lượng
                                            </th>
                                            <th scope="col" className="px-2 py-3">
                                                Đơn giá
                                            </th>
                                            <th scope="col" className="px-2 py-3">
                                                Số tiền phải thu
                                            </th>
                                            <th scope="col" className="px-2 py-3">
                                                Ghi chú
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className={`border-b dark:border-gray-700`}>
                                            <th
                                                scope="row"
                                                className="p-2 font-bold text-gray-900 whitespace-nowrap uppercase"
                                            >
                                                I,
                                            </th>
                                            <th className="p-2 font-bold text-gray-900 whitespace-nowrap uppercase">
                                                Khoản thu trong tháng
                                            </th>
                                            <td className="p-2"></td>
                                            <td className="p-2"></td>
                                            <td className="p-2"></td>
                                            <td className="p-2"></td>
                                            <td className="p-2"></td>
                                        </tr>
                                        {/*class*/}
                                        <tr
                                            className={`bg-white 
                                    border-b  hover:bg-gray-300`}
                                        >
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            ></th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData?.class?.length > 0
                                                    ? `Học lớp ${tuitionDetailData.class[0].name}`
                                                    : 'Chưa có lớp'}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                Tháng
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                1
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData?.class?.length > 0
                                                    ? `${formatCurrencyVN(tuitionDetailData.class[0].tuition)}`
                                                    : '-'}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData?.class?.length > 0
                                                    ? `${formatCurrencyVN(tuitionDetailData.class[0].tuition)}`
                                                    : '-'}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData?.class?.[0]?.isPaid ? (
                                                    <p className="flex space-x-4 items-center text-success font-bold">
                                                        {`Đã thanh toán vào ${formatCreatedAt(tuitionDetailData.class[0].payments[0].createdAt)} `}
                                                        <CheckmarkCircle02Icon />
                                                    </p>
                                                ) : (
                                                    ''
                                                )}
                                            </th>
                                        </tr>
                                        {/*skill*/}
                                        {tuitionDetailData?.skill?.length > 0 &&
                                            tuitionDetailData?.skill.map((item, index) => {
                                                return (
                                                    <tr
                                                        key={index}
                                                        className={`bg-white 
                                    border-b  hover:bg-gray-300`}
                                                    >
                                                        <th
                                                            scope="row"
                                                            className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                                        ></th>
                                                        <th
                                                            scope="row"
                                                            className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                                        >
                                                            {`Học kĩ năng ${item.name}`}
                                                        </th>
                                                        <th
                                                            scope="row"
                                                            className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                                        >
                                                            Tháng
                                                        </th>
                                                        <th
                                                            scope="row"
                                                            className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                                        >
                                                            1
                                                        </th>
                                                        <th
                                                            scope="row"
                                                            className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                                        >
                                                            {formatCurrencyVN(item.tuition)}
                                                        </th>
                                                        <th
                                                            scope="row"
                                                            className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                                        >
                                                            {formatCurrencyVN(item.tuition)}
                                                        </th>
                                                        <th
                                                            scope="row"
                                                            className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                                        >
                                                            {item.isPaid ? (
                                                                <p className="flex space-x-4 items-center text-success font-bold">
                                                                    {`Đã thanh toán vào ${formatCreatedAt(item.payments[0].createdAt)} `}
                                                                    <CheckmarkCircle02Icon />
                                                                </p>
                                                            ) : (
                                                                ''
                                                            )}
                                                        </th>
                                                    </tr>
                                                );
                                            })}
                                        {/*transportation*/}

                                        <tr
                                            className={`bg-white 
                                    border-b  hover:bg-gray-300`}
                                        >
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            ></th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                Dịch vụ đưa đón
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                Tháng
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                1
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData?.transportation?.length > 0
                                                    ? `${formatCurrencyVN(tuitionDetailData.transportation[0].tuition)}`
                                                    : '-'}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData?.transportation?.length > 0
                                                    ? `${formatCurrencyVN(tuitionDetailData.transportation[0].tuition)}`
                                                    : '-'}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData?.transportation?.length
                                                    ? ''
                                                    : // <Button primary href={'/register-transport'} target="_self">
                                                      //     Đăng ký dịch vụ đưa đón ngay
                                                      // </Button>
                                                      ''}
                                                {tuitionDetailData?.transportation?.[0]?.isPaid ? (
                                                    <p className="flex space-x-4 items-center text-success font-bold">
                                                        {`Đã thanh toán vào ${formatCreatedAt(tuitionDetailData.transportation[0].payments[0].createdAt)} `}
                                                        <CheckmarkCircle02Icon />
                                                    </p>
                                                ) : (
                                                    ''
                                                )}
                                            </th>
                                        </tr>

                                        {/*days learn*/}
                                        <tr
                                            className={`bg-white 
                                    border-b  hover:bg-gray-300`}
                                        >
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            ></th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                Số ngày học tháng {time.month}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                ngày
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData.class.length > 0
                                                    ? `${tuitionDetailData.currentMonthDaysInMonthLearn}`
                                                    : '-'}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData?.eatFees?.length > 0
                                                    ? `${formatCurrencyVN(tuitionDetailData.eatFees[0].tuition)}`
                                                    : '-'}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData?.eatFees?.length > 0
                                                    ? `${formatCurrencyVN(
                                                          tuitionDetailData.eatFees[0]?.tuition *
                                                              tuitionDetailData.currentMonthDaysInMonthLearn,
                                                      )}`
                                                    : '-'}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData?.eatFees?.[0]?.isPaid ? (
                                                    <p className="flex space-x-4 items-center text-success font-bold">
                                                        {`Đã thanh toán vào ${formatCreatedAt(tuitionDetailData.eatFees[0].payments[0].createdAt)} `}
                                                        <CheckmarkCircle02Icon />
                                                    </p>
                                                ) : (
                                                    ''
                                                )}
                                                {tuitionDetailData.class.length > 0 ? (
                                                    <p>
                                                        <span>{`Phụ huynh cần nộp đầy đủ tiền cho số ngày đi học tháng ${time.month} này,`}</span>
                                                        <br></br> tháng sau sẽ được trả lại tiền dựa theo số ngày nghỉ
                                                    </p>
                                                ) : (
                                                    ''
                                                )}
                                            </th>
                                        </tr>
                                        {/*cashback attendence*/}
                                        <tr
                                            className={`bg-white 
                                    border-b  hover:bg-gray-300`}
                                        >
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            ></th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                Số ngày nghỉ tháng {time.month - 1 <= 0 ? 12 : time.month - 1}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                ngày
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {!tuitionDetailData.isFirstMonthLearn &&
                                                tuitionDetailData.class.length > 0
                                                    ? `${tuitionDetailData.prevMonthDaysInMonthLearn - tuitionDetailData.countAttendence}`
                                                    : '-'}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData.class.length > 0 &&
                                                !tuitionDetailData.isFirstMonthLearn
                                                    ? `${formatCurrencyVN(tuitionDetailData.eatFees[0].tuition)}`
                                                    : '-'}
                                            </th>
                                            <th scope="row" className="p-2 font-medium text-error whitespace-nowrap ">
                                                -{' '}
                                                {tuitionDetailData.class.length > 0 &&
                                                !tuitionDetailData.isFirstMonthLearn
                                                    ? `${formatCurrencyVN((tuitionDetailData.prevMonthDaysInMonthLearn - tuitionDetailData.countAttendence) * tuitionDetailData.eatFees[0].tuition)}`
                                                    : '-'}
                                            </th>
                                            <th
                                                scope="row"
                                                className="p-2 font-medium text-gray-900 whitespace-nowrap "
                                            >
                                                {tuitionDetailData.class.length > 0 &&
                                                !tuitionDetailData.isFirstMonthLearn
                                                    ? ''
                                                    : ''}
                                            </th>
                                        </tr>

                                        <tr className={`border-b dark:border-gray-700`}>
                                            <th
                                                scope="row"
                                                className="p-2 font-bold text-gray-900 whitespace-nowrap uppercase"
                                            >
                                                II,
                                            </th>
                                            <th className="p-2 font-bold text-gray-900 whitespace-nowrap uppercase">
                                                Thu khác
                                            </th>
                                            <td className="p-2"></td>
                                            <td className="p-2"></td>
                                            <td className="p-2"></td>
                                            <td className="p-2"></td>
                                            <td className="p-2"></td>
                                        </tr>
                                        <tr className={`border-b  bg-gray-300`}>
                                            <th
                                                scope="row"
                                                className="p-2 font-bold text-gray-900 whitespace-nowrap uppercase"
                                            ></th>
                                            <th className="p-2 font-bold text-gray-900 whitespace-nowrap uppercase">
                                                Tổng cộng
                                            </th>
                                            <td className="p-2"></td>
                                            <td className="p-2"></td>
                                            <td className="p-2"></td>
                                            <td className="p-2 underline font-bold">
                                                {formatCurrencyVN(tuitionDetailData.totalFees)}
                                            </td>
                                            <td className="p-2"></td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <Loading></Loading>
            )}
        </div>
    );
};

export default TuitionDetail;
