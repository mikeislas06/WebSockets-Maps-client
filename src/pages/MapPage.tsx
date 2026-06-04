import useSocketMap from '../hooks/useSocketMap';

import './MapPage.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapPage = () => {

    const { mapContainer } = useSocketMap();

    return (
        <>
            <div className="map-container" ref={mapContainer}>

            </div>
        </>
    )
}

export default MapPage