import {createContext, useCallback, useContext} from "react";
import {ImgCache} from "./ImgCache";

export const imgCacheContext = createContext<ImgCache | null>(null)
export const RawProvider = imgCacheContext.Provider

export const useImgCache = (src: string) => {
    const imgCache = useContext(imgCacheContext)
    return imgCache === null ? src : imgCache.get(src)
}

export const useImgPlaceholder = () => {
    const imgCache = useContext(imgCacheContext)
    return imgCache?.getPlaceholder() ?? ImgCache.placeholder
}

export const useInvalidate = () => {
    const imgCache = useContext(imgCacheContext)
    return useCallback((src: string) => imgCache?.invalidate(src), [imgCache])
}