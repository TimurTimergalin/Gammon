import {CSSProperties, ReactNode, useContext} from "react";
import {LayoutModeContext} from "../../adapt/LayoutModeContext.ts";
import {GameViewAdapter} from "./GameViewAdapter.tsx";
import {ControlPanelAdapter} from "./ControlPanelAdapter.tsx";

export const GameAndControlPanelContainer = ({children}: {
    children: [ReactNode, ReactNode]
}) => {
    const layoutMode = useContext(LayoutModeContext)
    const [game, controlPanel] = children
    const flexDirection = layoutMode === "Collapsed" ? "column" : "row"
    const style: CSSProperties = {
        display: "flex",
        flexDirection: flexDirection,
        alignItems: "center",
        paddingLeft: layoutMode === "Free" ? "15px" : "auto",
        paddingRight: layoutMode === "Free" ? "15px" : "auto",
        paddingTop: "15px",
        paddingBottom: "15px",
        margin: layoutMode === "Free" || layoutMode === "Collapsed" ? "auto" : 0,
        flex: layoutMode === "Free" || layoutMode === "Collapsed" ? "0 1 auto" : 1,
    }

    return (
        <div style={style}>
            <GameViewAdapter>
                {game}
            </GameViewAdapter>
            <ControlPanelAdapter>
                {controlPanel}
            </ControlPanelAdapter>
        </div>
    )
}