import {ReactNode, useCallback, useState} from "react";
import {LayoutMode} from "./LayoutMode.ts";
import {useLayoutMeasure} from "../../../hooks.ts";
import {LayoutModeContext} from "./LayoutModeContext.ts";

export const Adapter = ({children}: {
    children: ReactNode | ReactNode[]
}) => {
    const [windowWidth, setWindowWidth] = useState<number>(0)
    const measureWindowWidth = useCallback(
        () => {
            setWindowWidth(document.body.offsetWidth)
        }, []
    )
    useLayoutMeasure(measureWindowWidth)

    const layoutMode: LayoutMode =
        windowWidth >= 1430 ? "Free" :
        windowWidth >= 1120 ? "Tight" :
        windowWidth >= 762 ? "Shrinking" : "Collapsed"

    return (
        <LayoutModeContext.Provider value={layoutMode}>
            {children}
        </LayoutModeContext.Provider>
    )
}