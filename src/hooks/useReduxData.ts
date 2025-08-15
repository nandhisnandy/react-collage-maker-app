import { COLLAGE_TEMPLATES } from "@/constants/canvasConfig"
import { useAppSelector } from "@/redux/hooks"
import type { RootStateType } from "@/redux/store"

function useCanvasData() {
  const canvas = useAppSelector((state: RootStateType) => state.canvas.canvas)

  return { canvas }
}

function useCanvasConfigData() {
  const activeTemplateIndex = useAppSelector(
    (state: RootStateType) => state.canvas.template,
  )
  const activeRatioIndex = useAppSelector(
    (state: RootStateType) => state.canvas.ratio,
  )
  const activeTemplate = COLLAGE_TEMPLATES[activeTemplateIndex]

  return {
    activeRatioIndex,
    activeTemplateIndex,
    activeTemplate,
  }
}

function useCanvasImageData() {
  const uploadCount = useAppSelector(
    (state: RootStateType) => state.selection.images.length,
  )
  const maxImageUploads = useAppSelector(
    (state: RootStateType) => COLLAGE_TEMPLATES[state.canvas.template].config,
  ).length
  const selectedImageIndex = useAppSelector(
    (state: RootStateType) => state.selection.selectedImageIndex,
  )
  const images = useAppSelector(
    (state: RootStateType) => state.selection.images,
  )
  const uploadedImagePool = useAppSelector(
    (state: RootStateType) => state.selection.uploadedImagePool,
  )
  const hasUploadedImages = useAppSelector(
    (state: RootStateType) => state.canvas.hasUploadedImages,
  )

  return {
    images,
    maxImageUploads,
    selectedImageIndex,
    uploadCount,
    uploadedImagePool,
    hasUploadedImages,
  }
}

function useTabData() {
  const activeTab = useAppSelector((state: RootStateType) => state.canvas.tab)

  return { activeTab }
}

export { useCanvasData, useCanvasConfigData, useCanvasImageData, useTabData }
