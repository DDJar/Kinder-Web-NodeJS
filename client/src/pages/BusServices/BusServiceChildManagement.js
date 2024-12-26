import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { getChildren } from '~/api/user';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import Button from '~/components/Button';

const BusServiceChildManagement = () => {
    const { user } = useUserProvider();
    const [children, setChildren] = useState([]);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const res = await axios({
                    method: getChildren.method,
                    url: getChildren.url,
                    params: { userId: user?._id },
                });
                if (res.data.status === 200) {
                    setChildren(res.data.data.children);
                } else {
                    console.error('Failed to fetch children', res.data.message);
                }
                console.log('Data', res.data.data.children);
            } catch (error) {
                console.error('Error fetching children', error);
            }
        };
        fetchChildren();
    }, [user?._id]);
    return (
        <div>
            <h4 className="mx-20 pt-10">Xem trẻ trên bản đồ</h4>
            <div className="flex justify-center mx-20 space-x-6 pb-40">
                {children.length > 0 &&
                    children.map((child) => (
                        <div key={child._id} className="bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer">
                            <img
                                src={child.avatar || `img/default-avt.png`}
                                alt="avatar"
                                className="w-32 h-32 object-cover rounded-full mb-4 mx-auto"
                            />
                            <h3 className="text-lg font-semibold text-center">{`${child.firstName} ${child.lastName}`}</h3>
                            {child?.transportation.length >= 1 && child?.transportation[0] ? (
                                <div className="flex flex-col items-center">
                                    <Button primary to={`/bus-services/maps?childId=${child._id}`} target={`_self`}>
                                        Xem vị trí bé{' '}
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Button outlinePrimary to={`/register-transport`} target={`_self`}>
                                        Đăng kí ngay
                                    </Button>
                                    <p>Bé chưa đăng kí dịch vụ đưa đón</p>
                                </div>
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default BusServiceChildManagement;
