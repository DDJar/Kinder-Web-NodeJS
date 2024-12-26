import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Button from '~/components/Button';
import { getChildren } from '~/api/user';
import { setChildren } from '~/redux/action';
import Sidebar from '../ProfileSidebar';
import axios from 'axios';
import { useUserProvider } from '~/hooks/user/useUserProvider';

const ChildrenProfile = () => {
    const currentYear = new Date().getFullYear();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user } = useUserProvider();
    const children = useSelector((state) => state.children);

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                const res = await axios({
                    method: getChildren.method,
                    url: getChildren.url,
                    params: { userId: user._id },
                });
                if (res.data.status === 200) {
                    dispatch(setChildren(res.data.data.children));
                } else {
                    console.error('Failed to fetch children', res.data.message);
                }
            } catch (error) {
                console.error('Error fetching children', error);
            }
        };

        fetchChildren();
    }, [dispatch, user._id]);

    const handleChildClick = (childId) => {
        navigate(`/children/${childId}`);
    };
    const hasChildren = Array.isArray(children) && children.length > 0;

    return (
        <div className="flex">
            <Sidebar />
            <div className="w-3/4 bg-white p-6 shadow-md rounded-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold">Thông tin con</h2>
                    <Link to="/add-child">
                        <Button primary>Tạo thông tin con</Button>
                    </Link>
                </div>
                {!hasChildren ? (
                    <p>Bạn chưa thêm thông tin con.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {children.map((child) => (
                            <div
                                key={child._id}
                                className="bg-gray-100 p-4 rounded-lg shadow-md cursor-pointer"
                                onClick={() => handleChildClick(child._id)}
                            >
                                <img
                                    src={`${child.avatar}`}
                                    alt="avatar"
                                    className="w-32 h-32 object-cover rounded-full mb-4 mx-auto"
                                />
                                <h3 className="text-lg font-semibold text-center">{`${child.firstName} ${child.lastName}`}</h3>
                                <p className="text-center">
                                    {currentYear - new Date(child.dateOfBirth).getFullYear()} Tuổi{' '}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChildrenProfile;
