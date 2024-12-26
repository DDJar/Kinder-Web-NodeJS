import { useEffect, useState } from 'react';

function useGeoLocation() {
    const [location, setLocation] = useState({
        loaded: false,
        coordinates: { lat: '', lng: '' },
    });
    const onSuccess = (location) => {
        setLocation({
            loaded: true,
            coordinates: {
                lat: location.coords.latitude,
                lng: location.coords.longitude,
            },
        });
    };
    const onError = (error) => {
        setLocation({
            loaded: true,
            error,
        });
    };
    useEffect(() => {
        let setIntervalId;
        setIntervalId = setInterval(() => {
            if (!('geolocation' in navigator)) {
                onError({
                    code: 0,
                    message: 'Geolocation not supported',
                });
            }
            navigator.geolocation.getCurrentPosition(onSuccess, onError);
        }, 3000);
        return () => {
            clearInterval(setIntervalId);
        };
    }, []);
    return location;
}

export default useGeoLocation;
