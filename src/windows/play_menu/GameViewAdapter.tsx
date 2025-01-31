import {observer} from "mobx-react-lite";
import {CSSProperties, ReactNode} from "react";
import {useScreenSpecs} from "../../components/adapt/ScreenSpecs";
import {logger} from "../../logging/main";

const console = logger("windows/play_menu")

export const GameViewAdapter = observer(function GameViewAdapter({children}: {
    children: ReactNode
}) {
    const screenSpecs = useScreenSpecs()
    const layoutMode = screenSpecs.layoutMode

    // При маленькой ширине отображаться не будет
    console.assert(layoutMode === "Free" || layoutMode === "Tight")

    const fixedWidth = 800 * screenSpecs.scaleFactor
    const controlPanelGapValue = 30 * screenSpecs.scaleFactor

    const baseStyle: CSSProperties = {
        paddingRight: `${controlPanelGapValue}px`
    }

    const specificStyle: CSSProperties = layoutMode === "Free" ? {
        width: `${fixedWidth}px`
    } : {
        flex: 1
    }

    const style = {...baseStyle, ...specificStyle}

    return (
        <div style={style}>
            {children}
        </div>
    )
})