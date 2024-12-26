import { useEffect, useState } from 'react';
import { MapContainer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import useGeoLocation from '~/hooks/useGeoLocation';
import Button from '~/components/Button';
import MainMaps from '~/pages/BusServices/MainMaps';
import { socket } from '~/services/socket';
import socketMessages from '~/config/configSocketEmit';
import { useUserProvider } from '~/hooks/user/useUserProvider';
import useParamByKey from '~/hooks/useParamByKey';
import { useNavigate } from 'react-router-dom';
import Loading from '~/components/Loading';
import axios from '~/config/configAxios';
import { getChildrenTransportDetails } from '~/api/user';

export const MY_POSITION_TEXT = 'my-position';
export const BUS_POSITION_TEXT = 'bus-position';

function Maps() {
    const navigate = useNavigate();
    const location = useGeoLocation();
    const { user } = useUserProvider();

    const [paramChildId] = useParamByKey('childId');
    const [zoomLevel, setZoomLevel] = useState(13);
    const [selectedZoomPosition, setSelectedZoomPosition] = useState(MY_POSITION_TEXT);
    const [isStartBus, setIsStartBus] = useState(false);
    const [room, setRoom] = useState(null);
    const [childInfo, setChildInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [roomId, setRoomId] = useState(null);
    useEffect(() => {
        if (!paramChildId) {
            navigate('/unauthorized');
        }
        const fetchChildren = async () => {
            try {
                setIsLoading(true);
                const res = await axios({
                    method: getChildrenTransportDetails.method,
                    url: getChildrenTransportDetails.url,
                    params: { userId: user?._id, childId: paramChildId },
                });
                if (res.data.status == 200) {
                    setChildInfo(res.data.data);
                    let _temId = `${res.data.data?.transportDetail?.driverId?._id}_driver_room`;
                    setRoomId(_temId);
                    // socket.emit(socketMessages.BUS_JOIN_ROOM, _temId);
                } else {
                    console.error(res.data.message);
                }
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
                console.error('Error fetching children', error);
            }
        };
        fetchChildren();
    }, [user?._id, paramChildId]);
    useEffect(() => {
        if (roomId) {
            socket.emit(socketMessages.BUS_JOIN_ROOM, roomId);
        }
        socket.on(socketMessages.BUS_LOCATION, (data) => {
            setRoom(data);
            setIsStartBus(data?.isStart);
        });
        return () => {
            socket.off(socketMessages.BUS_LOCATION);
        };
    }, [roomId]);

    const handleZoomLevelIncrease = () => {
        if (zoomLevel >= 18) return;
        setZoomLevel((prevState) => prevState + 1);
    };
    const handleZoomLevelDecrease = () => {
        if (zoomLevel <= 1) return;
        setZoomLevel((prevState) => prevState - 1);
    };

    return (
        <div>
            {!isLoading ? (
                <>
                    <header className="bg-warning text-center">
                        Cháu{' '}
                        <span className="font-bold">
                            {childInfo?.firstName} {childInfo?.lastName}
                        </span>{' '}
                        đi trên xe <span className="font-bold">{childInfo?.transportDetail?.name}</span> biển số{' '}
                        <span className="font-bold">{childInfo?.transportDetail?.busNumber}</span> do bác{' '}
                        <span className="font-bold">
                            {childInfo?.transportDetail?.driverId?.firstName}{' '}
                            {childInfo?.transportDetail?.driverId?.lastName}
                        </span>{' '}
                        lái có số điện thoại là{' '}
                        <span className="font-bold">{childInfo?.transportDetail?.driverId?.phone}</span>{' '}
                    </header>
                    <div className="flex justify-between ml-10 mr-10">
                        <div className="flex space-x-4">
                            <Button primary roundedMd onClick={() => setSelectedZoomPosition(MY_POSITION_TEXT)}>
                                Về vị trí
                            </Button>
                            {isStartBus ? (
                                <Button
                                    outlinePrimary
                                    roundedMd
                                    onClick={() => setSelectedZoomPosition(BUS_POSITION_TEXT)}
                                >
                                    Vị trí xe Bus
                                </Button>
                            ) : (
                                <Button outlineInfo roundedMd disable>
                                    Bác tài chưa bắt đầu!
                                </Button>
                            )}
                        </div>
                        <div className="flex space-x-4">
                            <Button primary roundedMd onClick={handleZoomLevelIncrease}>
                                +
                            </Button>
                            <Button outlinePrimary roundedMd onClick={handleZoomLevelDecrease}>
                                -
                            </Button>
                        </div>
                    </div>
                    <MapContainer
                        center={location.coordinates}
                        style={{ height: '100vh', width: '100%' }}
                        zoom={zoomLevel}
                    >
                        <MainMaps
                            selectedZoomPosition={selectedZoomPosition}
                            zoomLevel={zoomLevel}
                            room={room}
                        ></MainMaps>
                    </MapContainer>
                </>
            ) : (
                <Loading />
            )}
        </div>
    );
}

export default Maps;
