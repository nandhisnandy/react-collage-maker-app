import { useCanvasAction } from "@/hooks/useReduxAction"
import clsx from "clsx"
import { useRef } from "react"
import toast from "react-hot-toast"

export default function InitialUploadScreen() {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const { addImagesToPoolAction, setHasUploadedImagesAction } = useCanvasAction()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (!files || files.length === 0) return

    const fileUrls: string[] = []
    let processedFiles = 0

    Array.from(files).forEach((file) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string
        if (dataUrl) {
          fileUrls.push(dataUrl)
        }
        processedFiles++

        // When all files are processed
        if (processedFiles === files.length) {
          addImagesToPoolAction(fileUrls)
          setHasUploadedImagesAction(true)
          toast.success(`${fileUrls.length} image(s) uploaded successfully!`, {
            id: "initial-upload",
          })
        }
      }
      reader.readAsDataURL(file)
    })

    // Reset input value
    event.target.value = ""
  }

  const handleUploadClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="mx-4 w-full max-w-md rounded-lg bg-neutral-900 p-8 text-center">
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-white">
            Create Your Collage
          </h1>
          <p className="text-gray-400">
            Start by uploading the images you want to include in your collage
          </p>
        </div>

        <div className="mb-6">
          <div
            onClick={handleUploadClick}
            className={clsx(
              "cursor-pointer rounded-lg border-2 border-dashed border-gray-600",
              "flex min-h-[200px] items-center justify-center p-6",
              "transition-colors hover:border-indigo-500 hover:bg-neutral-800",
            )}
          >
            <div className="text-center">
              <div className="mb-4 text-6xl text-gray-500">📸</div>
              <p className="mb-2 text-lg font-medium text-white">
                Click to upload images
              </p>
              <p className="text-sm text-gray-400">
                Select multiple images to create your collage
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleUploadClick}
          className={clsx(
            "w-full rounded-lg px-6 py-3 font-semibold text-white",
            "bg-indigo-600 transition-colors hover:bg-indigo-700",
          )}
        >
          Upload Images
        </button>

        <p className="mt-4 text-xs text-gray-500">
          Supports JPG, PNG, GIF formats. No sign-up required.
        </p>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>
    </div>
  )
}