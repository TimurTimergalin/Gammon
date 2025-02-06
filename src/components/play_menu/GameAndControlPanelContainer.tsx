import {observer} from "mobx-react-lite";
import {CSSProperties, ReactNode} from "react";
import {useScreenSpecs} from "../../adapt/ScreenSpecs";
import {GameViewAdapter} from "./GameViewAdapter";
import {ControlPanelAdapter} from "./ControlPanelAdapter";

export const GameAndControlPanelContainer = observer(function GameAndControlPanelContainer({children}: {
    children: [ReactNode, ReactNode]
}) {
    const screenSpecs = useScreenSpecs()
    const layoutMode = screenSpecs.layoutMode

    const [game, controlPanel] = children

    const padding = 15 * screenSpecs.scaleFactor

    const baseStyle: CSSProperties = {
        flex: 1,
        alignSelf: "stretch",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: padding
    }

    const specificStyle: CSSProperties = layoutMode === "Collapsed" ? {
        flexDirection: "column"
    } : {
        flexDirection: "row"
    }

    const style = {...baseStyle, ...specificStyle}

    return (
        <div style={style}>
            {(layoutMode === "Free" || layoutMode === "Tight") &&
                <GameViewAdapter>
                    {game}
                </GameViewAdapter>
            }
            <ControlPanelAdapter>
                {controlPanel}
            </ControlPanelAdapter>
        </div>
    )
})