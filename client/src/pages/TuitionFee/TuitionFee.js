import React, { useEffect, useState } from 'react';
import useParamByKey from '~/hooks/useParamByKey';
import axios from '~/config/configAxios';

import PageTitle from '~/common/PageTitle';
import Button from '~/components/Button';
import DetailsFee from './DetailsFee';
import { getTuitionFees } from '~/api/payment';

const children = [
    {
        _id: 1,
        firstName: 'Văn A',
        lastName: 'Nguyễn',
        class: 'Lá',
        detailsFees: [
            { _id: '123', name: 'lớp lá', value: 100 },
            { _id: '123s', name: 'Kĩ năng 1', value: 100 },
            { _id: '123s', name: 'Kĩ năng 2', value: 100 },
            { _id: '12s3', name: 'Kĩ năng 3', value: 100 },
        ],
        vouchers: [
            {
                _id: 123,
                title: 'Giảm 2 con',
                discount: 10,
            },
            {
                _id: 133,
                title: 'Sự kiện tháng 7',
                discount: 10,
            },
        ],
    },
    {
        _id: 2,
        firstName: 'Văn B',
        lastName: 'Bùi',
        class: 'Mầm',
        detailsFees: [
            { _id: '123', name: 'lớp mầm', value: 100 },
            { _id: '123s', name: 'Kĩ năng 1', value: 100 },
            { _id: '123s', name: 'Kĩ năng 2', value: 100 },
            { _id: '12s3', name: 'Kĩ năng 3', value: 100 },
        ],
    },
];

function TuitionFee() {
    // eslint-disable-next-line no-unused-vars
    const [param, setParam] = useParamByKey('child');

    // eslint-disable-next-line no-unused-vars
    const [selectedChild, setSelectedChild] = useState(null);
    const fetchTuitionFees = async () => {
        const res = await axios({
            method: getTuitionFees.method,
            url: getTuitionFees.url,
        });
        if (res.status === 401) {
            navigator('/login');
        }
        console.log(res);
    };
    useEffect(() => {
        //call API get details tuition fees all child
        fetchTuitionFees();
        if (param) {
            setSelectedChild(children.find((child) => child._id == param));
        }
    }, [param]);

    return (
        <div className="rounded-lg w-full flex justify-center">
            <PageTitle title="Kindergarten | tuitionfee" />
            <div className="bg-white rounded-lg w-full container flex flex-col space-y-4 p-6">
                <div className="space-x-8">
                    <div className="border-r border-gray-200 p-4">
                        <ul className="flex  space-x-4 ">
                            {children.map((child) => (
                                <Button
                                    roundedMd
                                    key={child._id}
                                    className={`p-4 mb-2 rounded cursor-pointer ${
                                        selectedChild && selectedChild._id === child._id ? 'bg-primary' : 'bg-gray-100'
                                    }`}
                                    onClick={() => setParam(child._id)}
                                >
                                    <div className="flex space-x-4">
                                        {child.avatar ? (
                                            <img src={child.avatar} alt="Child Avt" className="" />
                                        ) : (
                                            <img src="default-avt.png" alt="Child Avt" className="w-20" />
                                        )}
                                        <div className="text-left">
                                            <p className="font-semibold">{`${child.lastName} ${child.firstName}`}</p>
                                            <p>Mã học sinh: {child._id}</p>
                                            <p>Lớp: {child.class ? child.class : 'Chưa có lớp'}</p>
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </ul>
                    </div>

                    {/* Thông tin học phí */}
                    <div>
                        <h4 className="font-bold mb-2">Thông tin học phí</h4>
                        {selectedChild ? (
                            <div>
                                <DetailsFee key={selectedChild._id} child={selectedChild} />
                            </div>
                        ) : (
                            <p>Vui lòng chọn một học sinh</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TuitionFee;
