import React, { useEffect, useState } from 'react';
// import { notifications } from '~/testValue/user';
import { truncateString } from '~/utils/message';
import { formatCreatedAt } from '~/utils/time';
import PopoverComp from '../Popover';
import Button from '~/components/Button';
import { Notification02Icon } from 'hugeicons-react';
import { socket } from '~/services/socket';
import socketMessages from '~/config/configSocketEmit';
import { toast } from 'react-toastify';

const DropdownNotification = React.memo(({ user }) => {
    const [notifying, setNotifying] = useState(false);
    const [notifications, setNotifications] = useState([]);

    function handleOpen() {
        setNotifying(false);
    }

    useEffect(() => {
        if (user?._id) {
            socket.connect();
            socket.emit('online', user._id);

            // socket.on(socketMessages.RECEIVE_MESSAGE, (data) => {
            //     console.log('heloMAINAP', data);
            // });

            socket.on(socketMessages.RECEIVE_NOTIFY, (data) => {
                console.log('heloHeader', data);
                setNotifications((prev) => [data, ...prev]);
                setNotifying(true);
                toast(data.content || 'Có thông báo mới!');
            });

            // Cleanup to avoid multiple connections and event listeners
            return () => {
                socket.off(socketMessages.RECEIVE_MESSAGE);
                socket.off(socketMessages.RECEIVE_NOTIFY);
                socket.disconnect();
            };
        }
    }, [user]);

    return (
        <PopoverComp
            button={<Button outlineInfo icon={<Notification02Icon size={18} />}></Button>}
            notifying={notifying}
            title={`${notifications.length > 0 ? 'Thông báo' : 'Không có thông báo'}`}
            right
            onClick={handleOpen}
            width={'200'}
        >
            {notifications.map((noti, index) => (
                <div
                    key={index}
                    className="group w-100 relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
                >
                    <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                        <span className="h-10 w-10 rounded-full mr-2">
                            {noti.user.avatar && <img src={noti.user.avatar} alt="User" />}
                        </span>
                    </div>
                    <div className="flex-auto">
                        <a href="{item.href}" className="block font-semibold text-gray-900">
                            <span className="absolute inset-0" />
                        </a>
                        <p className="mt-1 text-gray-600">{truncateString(noti.content, 40)}</p>
                        <p className="mt-1 text-gray-600">{formatCreatedAt(noti.createdAt)}</p>
                    </div>
                </div>
            ))}
        </PopoverComp>
    );
});

export default DropdownNotification;
