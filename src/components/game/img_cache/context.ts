import {createContext, useContext} from "react";
import {ImgCache} from "./ImgCache";

const imgCacheContext = createContext<ImgCache | null>(null)
export const RawProvider = imgCacheContext.Provider

export const useImgCache = (src: string) => {
    const imgCache = useContext(imgCacheContext)
    return imgCache === null ? src : imgCache.get(src)
}

export const useImgPlaceholder = () => {
    const imgCache = useContext(imgCacheContext)
    return imgCache?.getPlaceholder() ?? ImgCache.placeholder
}