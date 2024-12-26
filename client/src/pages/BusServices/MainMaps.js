import useGeoLocation from '~/hooks/useGeoLocation';
import { Marker, Popup, TileLayer, useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import osm from '~/pages/BusServices/osm-providers';
import { BUS_POSITION_TEXT, MY_POSITION_TEXT } from '~/pages/BusServices/Maps';
import L from 'leaflet';
import locationIcon from '~/images/icon/location_on_24dp.png';
import locationIconBus from '~/images/icon/directions_bus_24dp.png';

const markerIcon = new L.icon({
    iconUrl: locationIcon,
    iconSize: [35, 35],
    iconAnchor: [17, 46],
    popupAnchor: [3, -46],
});
const markerIconBus = new L.icon({
    iconUrl: locationIconBus,
    iconSize: [35, 35],
    iconAnchor: [17, 46],
    popupAnchor: [3, -46],
});
const MainMaps = ({ selectedZoomPosition, zoomLevel, room }) => {
    const [locationBus, setLocationBus] = useState(null);
    useEffect(() => {
        if (room?.isStart && room.users.length >= 1 && room.users[0].role === 'DRIVER') {
            setLocationBus(room.users[0].location);
        }
        console.log('romm tay doi:', room);
    }, [room]);
    const location = useGeoLocation();
    const map = useMap();
    useEffect(() => {
        if (location.loaded && location.coordinates) {
            map.flyTo(location.coordinates, zoomLevel);
        }
    }, [location]);

    if (location?.error?.code === 1) {
        window.alert('Hãy cấp quyền truy cập vị trí!');
    }
    useEffect(() => {
        switch (selectedZoomPosition) {
            case MY_POSITION_TEXT:
                if (location.coordinates) {
                    map.flyTo(location.coordinates, zoomLevel);
                }
                break;
            case BUS_POSITION_TEXT:
                if (locationBus.coordinates) {
                    map.flyTo(locationBus.coordinates, zoomLevel);
                }
                break;
            default:
                break;
        }
    }, [selectedZoomPosition, zoomLevel]);
    return (
        <div>
            <TileLayer url={osm.maptiler.url} attribution={osm.maptiler.attribution} />

            {location.loaded && !location.error && (
                <Marker position={[location.coordinates?.lat, location.coordinates?.lng]} icon={markerIcon}>
                    <Popup>
                        <p>Vị trí của bạn</p>
                    </Popup>
                </Marker>
            )}
            {locationBus?.loaded && !locationBus?.error && (
                <Marker position={[locationBus.coordinates.lat, locationBus.coordinates.lng]} icon={markerIconBus}>
                    <Popup>
                        <p>Vị trí của xe</p>
                    </Popup>
                </Marker>
            )}
        </div>
    );
};

export default MainMaps;
