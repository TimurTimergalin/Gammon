import {ReactNode, useContext} from "react";
import {LayoutModeContext} from "../../adapt/LayoutModeContext.ts";

export const GameViewAdapter = ({children}: {
    children: ReactNode
}) => {
    const layoutMode = useContext(LayoutModeContext)

    const controlPanelGap = "30px"
    const width =
        layoutMode === "Collapsed" ? "calc(100% - 30px)" :
        layoutMode === "Shrinking" ? "80%" : "800px"

    return (
        <div style={{
            width: width,
            maxHeight: "80%",
            paddingRight: layoutMode === "Collapsed" ? 0 : controlPanelGap,
            paddingBottom: layoutMode === "Collapsed" ? controlPanelGap : 0
        }}>
            {children}
        </div>
    )
}