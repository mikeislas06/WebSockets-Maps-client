import { use, useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { WebSocketContext, type SocketResponse } from '../context/WebSocketContext';
import Cookies from 'js-cookie';
import type { Client } from '../types';

const clientMarkers = new Map<string, mapboxgl.Marker>();


const useSocketMap = () => {

    const { status, connectToServer, subscribeToMessages, send } = use(WebSocketContext)

    const mapContainer = useRef<HTMLDivElement>(null);
    const map = useRef<mapboxgl.Map>(null);
    const [me, setMe] = useState<Client | null>(null);

    useEffect(() => {
        const name = Cookies.get('name');
        const color = Cookies.get('color');
        const coordsString = Cookies.get('coords');

        if (!name || !color || !coordsString) return;
        if (status !== 'offline') return;

        const coords = JSON.parse(coordsString);
        connectToServer(name, color, coords)
    }, [connectToServer, status])

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

    const createMarker = (client: Client, draggable: boolean = false): mapboxgl.Marker => {
        if (!map.current) return;
        if (clientMarkers.has(client.clientId)) return;

        const marker = new mapboxgl.Marker({
            color: client.color || 'gray',
        })
            .setLngLat([client.coords.lng, client.coords.lat])
            .setDraggable(draggable)
            .setPopup(new mapboxgl.Popup().setHTML(`<h3>${client.name}</h3>`))
            .addTo(map.current)
            .on('drag', (event) => {
                Cookies.set('coords', JSON.stringify(event.target.getLngLat()));
                send({
                    type: 'CLIENT_MOVED',
                    payload: {
                        clientId: client.clientId,
                        coords: event.target.getLngLat()
                    }
                })
            })

        clientMarkers.set(client.clientId, marker);
        return marker;
    }

    const removeMarker = (clientId: string) => {
        if (!clientMarkers.has(clientId)) return;

        const marker = clientMarkers.get(clientId);

        if (!marker) return;

        marker.remove();
    }

    const moveMarker = (client: Client) => {
        if (!clientMarkers.has(client.clientId)) return;

        const marker = clientMarkers.get(client.clientId);

        if (!marker) return;

        marker.setLngLat([client.coords.lng, client.coords.lat]);
    }

    const handleReponse = (response: SocketResponse) => {
        const { type, payload } = response;

        switch (type) {
            case 'WELCOME': {
                setMe(payload);
                createMarker(payload, true);
                break;
            }
            case 'CLIENTS_STATE': {
                payload.forEach(client => createMarker(client, false))
                break;
            }
            case 'CLIENT_JOINED': {
                createMarker(payload, false)
                break;
            }
            case 'CLIENT_MOVED': {
                moveMarker(payload)
                break;
            }
            case 'CLIENT_LEFT': {
                removeMarker(payload.clientId);
                break;
            }
        }
    }

    useEffect(() => {

        return subscribeToMessages(handleReponse);

    }, [subscribeToMessages]);


    return {
        map,
        me,
        mapContainer,
        connectToServer
    }
}

export default useSocketMap