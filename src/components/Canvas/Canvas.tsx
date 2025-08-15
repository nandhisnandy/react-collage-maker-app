import { OBJECT_LOCKED, ASPECT_RATIOS } from "@/constants/canvasConfig"
import { useCanvasAction, useTabAction } from "@/hooks/useReduxAction"
import { useCanvasConfigData, useCanvasImageData } from "@/hooks/useReduxData"
import { CustomImageObject } from "@/types"
import * as fabric from "fabric"
import { useEffect, useRef } from "react"
import toast from "react-hot-toast"

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const cellIndexRef = useRef<number>(0)

  // Get necessary Redux data via hooks
  const { activeTemplateIndex, activeRatioIndex, activeTemplate } =
    useCanvasConfigData()
  const { uploadedImagePool } = useCanvasImageData()

  const {
    addImageAction,
    clearSelectedImageAction,
    setCanvasAction,
    setSelectedImageAction,
    removeImageFromPoolAction,
  } = useCanvasAction()

  const { changeTabAction } = useTabAction()

  // Auto-populate canvas with images from pool
  const populateCanvasWithImages = (canvas: fabric.Canvas, cells: fabric.Rect[]) => {
    uploadedImagePool.forEach((imageDataUrl, poolIndex) => {
      if (poolIndex < cells.length) {
        const cell = cells[poolIndex]
        const config = activeTemplate.config[poolIndex]
        
        // Load image from pool
        fabric.Image.fromURL(imageDataUrl).then((img) => {
          const imgId = `img_${new Date().getTime()}_${poolIndex}`

          // Set position to selected cell
          img.set({
            id: imgId,
            left: cell.left,
            top: cell.top,
            selectable: true,
            hasControls: true,
            clipPath: cell,
            perPixelTargetFind: true,
          }) as CustomImageObject

          // Scale accordingly to look good
          if (config.scaleTo === "width") {
            img.scaleToWidth(cell.width + 1)
          } else if (config.scaleTo === "height") {
            img.scaleToHeight(cell.height + 1)
          }

          // Save image in redux
          addImageAction({
            id: imgId,
            filters: {
              brightness: 0,
              contrast: 0,
              noise: 0,
              saturation: 0,
              vibrance: 0,
              blur: 0,
            },
          })

          canvas.add(img)
          canvas.remove(cell) // Remove the placeholder cell
          canvas.renderAll()
        })
      }
    })
  }

  // Canvas initialization
  useEffect(() => {
    if (canvasRef.current && wrapperRef.current) {
      // Reset cell index
      cellIndexRef.current = 0
      
      // 0. Calculate canvas ratio by initial client width
      const panelWidth =
        wrapperRef.current.clientWidth > 640
          ? 640 // fixed 640px canvas on >640px devices
          : wrapperRef.current.clientWidth - 16 // 16px margin
      const ratio = ASPECT_RATIOS[activeRatioIndex].getCanvasSize(
        panelWidth,
        wrapperRef.current.clientHeight - 16,
      )

      // 1. Setup canvas
      const canvas = new fabric.Canvas(canvasRef.current, {
        backgroundColor: "#1a1a1a",
        width: ratio.width,
        height: ratio.height,
        selection: false,
        controlsAboveOverlay: false,
        allowTouchScrolling: true,
        imageSmoothingEnabled: false,
      })

      // 1.1 Clone canvas
      setCanvasAction(canvas)

      // 2. Setup objects & its properties
      const cells: fabric.Rect[] = []
      activeTemplate.config.forEach((config) => {
        const PROPERTIES = config.rectFabric(ratio.height, ratio.width)
        const cell = new fabric.Rect(PROPERTIES).set(OBJECT_LOCKED)
        cells.push(cell)

        // 3. Define image upload event handler
        const handleImageUpload = (selectedCell: fabric.Rect) => {
          // Check if there are images in the pool to use
          if (uploadedImagePool.length > 0 && cellIndexRef.current < uploadedImagePool.length) {
            const imageDataUrl = uploadedImagePool[cellIndexRef.current]
            
            // Load image from pool
            fabric.Image.fromURL(imageDataUrl).then((img) => {
              const imgId = `img_${new Date().getTime()}_${cellIndexRef.current}`

              // Set position to selected cell
              img.set({
                id: imgId,
                left: selectedCell.left,
                top: selectedCell.top,
                selectable: true,
                hasControls: true,
                clipPath: selectedCell,
                perPixelTargetFind: true,
              }) as CustomImageObject

              // Scale accordingly to look good
              if (config.scaleTo === "width") {
                img.scaleToWidth(selectedCell.width + 1)
              } else if (config.scaleTo === "height") {
                img.scaleToHeight(selectedCell.height + 1)
              }

              // Save image in redux
              addImageAction({
                id: imgId,
                filters: {
                  brightness: 0,
                  contrast: 0,
                  noise: 0,
                  saturation: 0,
                  vibrance: 0,
                  blur: 0,
                },
              })

              canvas.add(img)
              canvas.remove(selectedCell)
              canvas.renderAll()
              
              cellIndexRef.current++
              
              toast.success("Image added to collage.", {
                id: "toast-uploaded",
              })

              // Switch to More tab, to show controls on active object
              changeTabAction("more")
            })
          } else {
            toast.error("No more images available. Upload more images to continue.", {
              id: "toast-no-images",
            })
          }
        }

        // 4. Attach event handler
        cell.on("mouseup", () => {
          handleImageUpload(cell)
        })

        // 5. Render
        canvas.add(cell)
      })

      // Auto-populate with images from pool
      if (uploadedImagePool.length > 0) {
        setTimeout(() => {
          populateCanvasWithImages(canvas, cells)
        }, 100) // Small delay to ensure canvas is ready
      }

      // 6. Render all looped objects
      canvas.renderAll()

      // 7. Attach event handler on object selection
      const handleImageSelect = (selected: CustomImageObject) => {
        // Change tab on select
        changeTabAction("more")

        // Set selected image
        setSelectedImageAction(selected.id)
      }

      canvas.on("selection:created", ({ selected }) => {
        handleImageSelect(selected[0] as CustomImageObject)
      })

      canvas.on("selection:updated", ({ selected }) => {
        handleImageSelect(selected[0] as CustomImageObject)
      })

      canvas.on("selection:cleared", () => {
        clearSelectedImageAction()
      })

      // On cell hover
      canvas.on("mouse:over", (e) => {
        e.target?.set("fill", `${e.target.fill}40`)
        e.target?.set("backgroundColor", "#121212")
        canvas.renderAll()
      })

      canvas.on("mouse:out", (e) => {
        const fillColor = e.target?.fill as string
        e.target?.set("fill", fillColor.substring(0, 7))
        e.target?.set("backgroundColor", "")
        canvas.renderAll()
      })

      // Unselect active image event handler
      const unselectObject = (e: MouseEvent) => {
        // Only target parent element
        if (e.target === wrapperRef.current) {
          canvas.discardActiveObject()
          canvas.requestRenderAll()
        }
      }

      // Attach handler
      wrapperRef.current.addEventListener("click", unselectObject)

      // 8. Clean up the canvas when the component unmounts
      return () => {
        wrapperRef.current?.removeEventListener("click", unselectObject)
        canvas.dispose()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRatioIndex, activeTemplateIndex, uploadedImagePool.length])

  return (
    <div
      ref={wrapperRef}
      className="flex h-[calc(100vh-14rem)] items-center justify-center sm:h-[calc(99vh-3rem)]"
    >
      <div>
        <canvas ref={canvasRef} />
      </div>
      <div className="hidden">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" />
      </div>
    </div>
  )
}
