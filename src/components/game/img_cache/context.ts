import {createContext} from "react";
import {ImgCache} from "./ImgCache";

export const imgCacheContext = createContext<ImgCache | null>(null)
export const RawProvider = imgCacheContext.Provider