import {ReactNode, useRef} from "react";
import {ImgCache} from "./ImgCache";
import {RawProvider} from "./context";

export const ImgCacheProvider = ({children}: {children?: ReactNode | ReactNode[]}) => {
    const imgCache = useRef(new ImgCache())

    return <RawProvider value={imgCache.current}>{children}</RawProvider>
}