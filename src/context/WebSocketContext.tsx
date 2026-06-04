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
        const ws = new WebSocket(url);
        shouldReconnectRef.current = true;

        ws.addEventListener('open', () => {
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
        console.log({ name, color, coords })
        Cookies.set('name', name);
        Cookies.set('color', color);
        Cookies.set('coords', JSON.stringify(coords));

        connect();
    };

    const subscribeToMessage = (listener: SocketMessagListener) => {
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
                console.log('Reconnecting every 1 second...');
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
        if (!socket) throw new Error('Socket not connected');
        if (status !== 'connected')
            throw new Error('Socket not connected (status)');

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
                subscribeToMessages: subscribeToMessage
            }}
        >
            {children}
        </WebSocketContext>
    );
};