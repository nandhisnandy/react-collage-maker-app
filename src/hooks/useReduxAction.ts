import {
  changeTab,
  changeRatioByIndex,
  changeTemplateByIndex,
  setCanvas,
  setHasUploadedImages,
} from "@/redux/canvasSlice"
import { useAppDispatch } from "@/redux/hooks"
import {
  clearAllImages,
  clearSelectedImage,
  newImage,
  setSelectedImage,
  setImageFilterValue,
  addImagesToPool,
  removeImageFromPool,
} from "@/redux/selectedImageSlice"
import type { ImageFilterUpdate, SelectedTabType, UploadedImage } from "@/types"
import type { Canvas } from "fabric"

function useTabAction() {
  const dispatch = useAppDispatch()
  const changeTabAction = (tab: SelectedTabType) => {
    dispatch(changeTab(tab))
  }
  return { changeTabAction }
}

function useRatioAction() {
  const dispatch = useAppDispatch()
  const changeRatio = (index: number) => {
    dispatch(changeRatioByIndex(index))
  }
  return { changeRatio }
}

function useTemplateAction() {
  const dispatch = useAppDispatch()
  const changeTemplate = (index: number) => {
    dispatch(changeTemplateByIndex(index))
  }
  return { changeTemplate }
}

function useImageFilterAction() {
  const dispatch = useAppDispatch()
  const changeFilterValue = (values: ImageFilterUpdate) => {
    dispatch(setImageFilterValue(values))
  }
  return { changeFilterValue }
}

function useCanvasAction() {
  const dispatch = useAppDispatch()
  const addImageAction = (imagePayload: UploadedImage) => {
    dispatch(newImage(imagePayload))
  }
  const clearSelectedImageAction = () => {
    dispatch(clearSelectedImage())
  }
  const setCanvasAction = (canvas: Canvas) => {
    dispatch(setCanvas(canvas))
  }
  const setSelectedImageAction = (id: string) => {
    dispatch(setSelectedImage(id))
  }
  const addImagesToPoolAction = (images: string[]) => {
    dispatch(addImagesToPool(images))
  }
  const removeImageFromPoolAction = (index: number) => {
    dispatch(removeImageFromPool(index))
  }
  const setHasUploadedImagesAction = (hasImages: boolean) => {
    dispatch(setHasUploadedImages(hasImages))
  }
  return {
    addImageAction,
    clearSelectedImageAction,
    setCanvasAction,
    setSelectedImageAction,
    addImagesToPoolAction,
    removeImageFromPoolAction,
    setHasUploadedImagesAction,
  }
}

export {
  useTabAction,
  useRatioAction,
  useTemplateAction,
  useImageFilterAction,
  useCanvasAction,
}
