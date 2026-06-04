import { WebSocketProvider } from "./context/WebSocketContext"
import MapPage from "./pages/MapPage"

const SocketsMapApp = () => {
  return (
    <WebSocketProvider url={import.meta.env.VITE_SOCKET_URL || 'ws://localhost:3000'}>
      <MapPage />
    </WebSocketProvider>
  )
}

export default SocketsMapApp