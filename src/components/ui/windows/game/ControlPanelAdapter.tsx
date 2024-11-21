import {CSSProperties, ReactNode} from "react";
import {useScreenSpecs} from "../../adapt/ScreenSpecs.ts";
import {observer} from "mobx-react-lite";

export const ControlPanelAdapter = observer(function ControlPanelAdapter({children}: {
    children: ReactNode
}) {
    const screenSpecs = useScreenSpecs();
    const layoutMode = screenSpecs.layoutMode

    const baseStyle: CSSProperties = {
        display: "flex"
    }

    const fixedHeight = 300 * screenSpecs.height / 900

    const specificStyle: CSSProperties =
        layoutMode === "Free" ? {
            aspectRatio: 4 / 3,
            height: `${fixedHeight}px`
        } : layoutMode === "Tight" ? {
            height: `${fixedHeight}px`,
            flex: 1
        } : layoutMode === "Shrinking" ? {
            width: "18%",
            aspectRatio: 2 / 3
        } : {
            width: "calc(100% - 30px)",
        }

    return (
        <div style={{...specificStyle, ...baseStyle}}>
            {children}
        </div>
    )
})