import { ConnectForm } from "./components/ConnectForm"
import MapPage from "./pages/MapPage"

const SocketsMapApp = () => {
  return (
    <>
      <ConnectForm onSubmit={() => { }} />
      <MapPage />
    </>
  )
}

export default SocketsMapApp