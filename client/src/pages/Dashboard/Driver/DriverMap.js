/* eslint-disable no-unused-vars */
import Button from '~/components/Button';
import { socket } from '~/services/socket';
import { useEffect, useState } from 'react';
import socketMessages from '~/config/configSocketEmit';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import useGeoLocation from '~/hooks/useGeoLocation';

const DriverMap = () => {
    const { user } = useUserProvider();
    const [isStart, setIsStart] = useState(false);
    const [roomId, setRoomId] = useState(`${user?._id}_driver_room`);
    const location = useGeoLocation();

    useEffect(() => {
        if (user?._id) {
            setRoomId(`${user?._id}_driver_room`);
        }
    }, [user?._id]);

    function startRoom() {
        if (!user || isStart) return;
        socket.emit(socketMessages.BUS_DRIVER_START_RUN, roomId);
        setIsStart(true);
    }

    function cancleStartRoom() {
        if (!user || !isStart) return;
        socket.emit(socketMessages.BUS_DRIVER_CANCLE_START_RUN, roomId);
        setIsStart(false);
    }

    useEffect(() => {
        if (!isStart) return;
        if (!location?.loaded) return;
        const data = {
            roomId: roomId,
            _id: user?._id,
            role: user?.role,
            location: location,
        };
        socket.emit(socketMessages.BUS_SHARE_LOCATION, data);
    }, [isStart, location, roomId]);

    useEffect(() => {
        return () => {
            socket.emit(socketMessages.BUS_DRIVER_CANCLE_START_RUN, roomId);
            setIsStart(false);
        };
    }, []);
    return (
        <div>
            {!isStart ? (
                <Button roundedMd primary onClick={startRoom}>
                    Bắt đầu đi
                </Button>
            ) : (
                <Button roundedMd info onClick={cancleStartRoom}>
                    Hủy
                </Button>
            )}
        </div>
    );
};
export default DriverMap;
