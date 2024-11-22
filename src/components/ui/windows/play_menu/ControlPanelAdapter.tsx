import {observer} from "mobx-react-lite";
import {CSSProperties, ReactNode} from "react";
import {useScreenSpecs} from "../../adapt/ScreenSpecs.ts";

export const ControlPanelAdapter = observer(function ControlPanelAdapter({children}: {
    children: ReactNode
}) {
    const screenSpecs = useScreenSpecs()
    const layoutMode = screenSpecs.layoutMode

    const fixedWidth = 300 * screenSpecs.scaleFactor
    const fixedHeight = 400 * screenSpecs.scaleFactor

    const baseStyle: CSSProperties = {
        height: fixedHeight,
        display: "flex"
    }

    const specificStyle: CSSProperties = layoutMode === "Free" || layoutMode === "Tight" ? {
        width: fixedWidth
    } : layoutMode === "Shrinking" ? {
        flex: 1,
        maxWidth: "80%",
    } : {
        width: "80%",
    }

    const style = {...baseStyle, ...specificStyle}

    return (
        <div style={style}>
            {children}
        </div>
    )
})