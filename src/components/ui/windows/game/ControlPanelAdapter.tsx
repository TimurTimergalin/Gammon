import {CSSProperties, ReactNode} from "react";
import {useScreenSpecs} from "../../adapt/ScreenSpecs.ts";
import {observer} from "mobx-react-lite";

export const ControlPanelAdapter = observer(function ControlPanelAdapter({children, height}: {
    children: ReactNode,
    height?: number
}) {
    const screenSpecs = useScreenSpecs();
    const layoutMode = screenSpecs.layoutMode

    const baseStyle: CSSProperties = {
        display: "flex"
    }
    const baseHeight = height || 300

    const fixedHeight = (height || baseHeight) * screenSpecs.height / 900

    const specificStyle: CSSProperties =
        layoutMode === "Free" ? {
            aspectRatio: 400 / baseHeight,
            height: `${fixedHeight}px`
        } : layoutMode === "Tight" ? {
            height: `${fixedHeight}px`,
            flex: 1
        } : layoutMode === "Shrinking" ? {
            width: "18%",
            aspectRatio: 200 / baseHeight
        } : {
            width: "calc(100% - 30px)",
        }

    return (
        <div style={{...specificStyle, ...baseStyle}}>
            {children}
        </div>
    )
})