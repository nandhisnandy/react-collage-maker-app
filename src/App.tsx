import Canvas from "@/components/Canvas/Canvas"
import MenuBar from "@/components/Menu/MenuBar"
import EditingPanel from "@/components/Tab/TabPanel"
import InitialUploadScreen from "@/components/Upload/InitialUploadScreen"
import { useCanvasImageData } from "@/hooks/useReduxData"
import store from "@/redux/store"
import { Toaster } from "react-hot-toast"
import { Provider } from "react-redux"

function AppContent() {
  const { hasUploadedImages } = useCanvasImageData()

  if (!hasUploadedImages) {
    return <InitialUploadScreen />
  }

  return (
    <div className="flex flex-row flex-wrap overflow-hidden">
      <aside className="absolute bottom-0 z-10 order-2 w-full border-gray-800 sm:relative sm:order-1 sm:w-3/12 sm:border-r sm:bg-neutral-900">
        <EditingPanel />
      </aside>

      <main className="order-1 w-full sm:order-2 sm:w-9/12">
        <MenuBar />
        <Canvas />
      </main>
    </div>
  )
}

function App() {
  return (
    <Provider store={store}>
      <Toaster />
      <AppContent />
    </Provider>
  )
}

export default App
