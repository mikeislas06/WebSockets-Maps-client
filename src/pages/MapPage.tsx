import { ConnectForm } from '../components/ConnectForm';
import useSocketMap from '../hooks/useSocketMap';

import './MapPage.css';
import 'mapbox-gl/dist/mapbox-gl.css';

const MapPage = () => {

    const { mapContainer, map, connectToServer, me } = useSocketMap();

    const handleSubmit = (name: string, color: string) => {
        const currentLocation = map.current?.getCenter();
        if (!currentLocation) return;
        connectToServer(
            name, color, { lat: currentLocation.lat, lng: currentLocation.lng }
        )
    }
    return (
        <>
            {
                me ? (
                    <div className='user-info'>
                        <h3 style={{ color: me.color }}>
                            {me.name}
                        </h3>
                        <p>
                            Color: {me.color}
                        </p>
                        <p>
                            Location: {me.coords.lat.toFixed(2)}, {me.coords.lng.toFixed(2)}
                        </p>
                        {
                            me.updatedAt && (
                                <p>
                                    {
                                        new Date(me.updatedAt).toLocaleString()
                                    }
                                </p>
                            )
                        }
                    </div>
                ) : (
                    <ConnectForm onSubmit={handleSubmit} />
                )
            }
            <div className="map-container" ref={mapContainer}>

            </div>
        </>
    )
}

export default MapPage