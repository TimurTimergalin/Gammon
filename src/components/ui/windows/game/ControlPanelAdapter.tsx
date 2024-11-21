import {CSSProperties, ReactNode, useContext} from "react";
import {LayoutModeContext} from "../../adapt/LayoutModeContext.ts";

export const ControlPanelAdapter = ({children}: {
    children: ReactNode
}) => {
    const layoutMode = useContext(LayoutModeContext)

    const baseStyle: CSSProperties = {
        display: "flex"
    }

    const specificStyle: CSSProperties =
        layoutMode === "Free" ? {
            width: "400px",
            height: "300px"
        } : layoutMode === "Tight" ? {
            height: "300px",
            flex: 1
        } : layoutMode === "Shrinking" ? {
            width: "20%",
            aspectRatio: 2 / 3
        } : {
            width: "calc(100% - 30px)",
        }

    return (
        <div style={{...specificStyle, ...baseStyle}}>
            {children}
        </div>
    )
}