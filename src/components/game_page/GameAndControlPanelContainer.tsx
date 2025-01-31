import {CSSProperties, ReactNode} from "react";
import {GameViewAdapter} from "./GameViewAdapter";
import {ControlPanelAdapter} from "./ControlPanelAdapter";
import {observer} from "mobx-react-lite";
import {useScreenSpecs} from "../../adapt/ScreenSpecs";

export const GameAndControlPanelContainer = observer(function GameAndControlPanelContainer({children}: {
    children: [ReactNode, ReactNode]
}) {
    const screenSpecs = useScreenSpecs()
    const layoutMode = screenSpecs.layoutMode

    const padding = 15 * screenSpecs.scaleFactor

    const [game, controlPanel] = children
    const flexDirection = layoutMode === "Collapsed" ? "column" : "row"
    const style: CSSProperties = {
        display: "flex",
        flexDirection: flexDirection,
        alignItems: "center",
        paddingLeft: layoutMode === "Free" ? `${padding}px` : "auto",
        paddingRight: layoutMode === "Free" ? `${padding}px` : "auto",
        paddingTop: `${padding}px`,
        paddingBottom: `${padding}px`,
        marginLeft: layoutMode === "Free" ? "auto" : 0,
        marginRight: layoutMode === "Free" ? "auto" : 0,
        marginTop: layoutMode === "Collapsed" ? "auto" : 0,
        marginBottom: layoutMode === "Collapsed" ? "auto" : 0,
        flex: layoutMode === "Free" || layoutMode === "Collapsed" ? "0 1 auto" : 1,
    }

    return (
        <div style={style}>
            <GameViewAdapter>
                {game}
            </GameViewAdapter>
            <ControlPanelAdapter height={420}>
                {controlPanel}
            </ControlPanelAdapter>
        </div>
    )
})