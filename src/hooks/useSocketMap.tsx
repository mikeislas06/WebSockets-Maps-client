import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

const useSocketMap = () => {
    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map>(null);

    useEffect(() => {

        if (!mapContainer.current) return;
        if (map.current) return;

        map.current = new mapboxgl.Map({
            accessToken: import.meta.env.VITE_MAPBOX_API_TOKEN, // associates the map with your Mapbox account and its permissions
            container: mapContainer.current, // container ID
            center: [-122.467895, 37.800126], // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 14.5, // starting zoom
            attributionControl: false
        });
    }, [])


    return {
        map,
        mapContainer
    }
}

export default useSocketMap