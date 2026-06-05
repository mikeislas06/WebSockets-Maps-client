import {
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';
import type { Client, Coords } from '../types';
import Cookies from 'js-cookie';

type ConnectionStatus = 'offline' | 'connecting' | 'connected' | 'disconnected' | 'error';

// Tipados específicos
export type SocketMessage =
    | {
        type: 'CLIENT_REGISTERED',
        payload: {
            name: string;
            color: string;
            coords: Coords;
        }
    }
    | {
        type: 'CLIENT_MOVED',
        payload: {
            clientId: string;
            coords: Coords;
        }
    }
    | {
        type: 'GET_CLIENTS'
    }

export type SocketResponse =
    | {
        type: 'ERROR',
        payload: { message: string }
    }
    | {
        type: "WELCOME",
        payload: Client
    }
    | {
        type: "CLIENTS_STATE",
        payload: Client[]
    }
    | {
        type: "CLIENT_JOINED",
        payload: Client
    }
    | {
        type: "CLIENT_MOVED",
        payload: Client
    }
    | {
        type: "CLIENT_LEFT",
        payload: { clientId: string }
    }

export type SocketMessagListener = (message: SocketResponse) => void;

interface WebSocketContextState {
    status: ConnectionStatus;
    socketId: string | null;
    // Methods
    connectToServer: (name: string, color: string, coords: Coords) => void;
    disconnect: () => void;
    send: (message: SocketMessage) => void;
    subscribeToMessages: (listener: SocketMessagListener) => void
}

export const WebSocketContext = createContext({} as WebSocketContextState);

const messageListenersRef = new Set<SocketMessagListener>();
let connecting = false;

interface Props {
    children: ReactNode;
    url: string;
}

export const WebSocketProvider = ({ children, url }: Props) => {
    const [status, setStatus] = useState<ConnectionStatus>('offline');
    const [socketId, setSocketId] = useState<string | null>(null);

    const socket = useRef<WebSocket | null>(null);
    const shouldReconnectRef = useRef(false);

    const disconnect = () => {
        socket.current?.close();
        socket.current = null;
        shouldReconnectRef.current = false;
        setStatus('offline');
    }

    const connect = useCallback(() => {
        if (connecting) return;
        connecting = true;

        setStatus("connecting");

        const name = Cookies.get('name');
        const color = Cookies.get('color') || 'gray';
        const coordsStr = Cookies.get('coords');

        let wsUrl = url;
        if (name && coordsStr) {
            // Use URL object if possible. ws/wss are valid.
            try {
                const urlObj = new URL(url);
                urlObj.searchParams.append('name', name);
                urlObj.searchParams.append('color', color);
                urlObj.searchParams.append('coords', coordsStr);
                wsUrl = urlObj.toString();
            } catch (e) {
                // fallback if url is somehow invalid for URL constructor
                wsUrl = `${url}?name=${encodeURIComponent(name)}&color=${encodeURIComponent(color)}&coords=${encodeURIComponent(coordsStr)}`;
            }
        }

        const ws = new WebSocket(wsUrl);
        shouldReconnectRef.current = true;

        ws.addEventListener('open', () => {
            connecting = false;
            socket.current = ws;
            setStatus('connected');
        });

        ws.addEventListener('close', () => {



            socket.current = null;
            setStatus('disconnected');
        });

        ws.addEventListener('error', (event) => {
            console.log({ customError: event });
        });

        ws.addEventListener('message', (event) => {
            try {
                const message = JSON.parse(event.data);

                if (message.type === "WELCOME") {
                    setSocketId(message.payload.clientId)
                }

                messageListenersRef.forEach(listener => listener(message));

            } catch (error) {
                console.error(`Invalid socket message: ${error}`)
            }
        });

        return ws;
    }, [url]);

    const connectToServer = (name: string, color: string, coords: Coords) => {

        if (status === "connecting" || status === "connected") return;

        Cookies.set('name', name);
        Cookies.set('color', color);
        Cookies.set('coords', JSON.stringify(coords));

        connect();
    };

    const subscribeToMessages = (listener: SocketMessagListener) => {
        messageListenersRef.add(listener);

        return () => {
            messageListenersRef.delete(listener);
        }
    }

    // Reconnection function
    useEffect(() => {

        if (!shouldReconnectRef.current) return;

        let interval: ReturnType<typeof setInterval>;
        if (status === 'disconnected') {
            interval = setInterval(() => {
                connect();
            }, 1000);
        }

        return () => {
            if (interval) {
                clearInterval(interval);
            }
        };
    }, [status, connect]);

    const send = (message: SocketMessage) => {
        if (!socket.current) throw new Error('Socket not connected');

        const jsonMessage = JSON.stringify(message);
        socket.current?.send(jsonMessage);
    };

    return (
        <WebSocketContext
            value={{
                status: status,
                send: send,
                connectToServer: connectToServer,
                disconnect: disconnect,
                socketId: socketId,
                subscribeToMessages: subscribeToMessages
            }}
        >
            {children}
        </WebSocketContext>
    );
};