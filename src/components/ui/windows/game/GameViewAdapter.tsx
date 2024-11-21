import {ReactNode} from "react";
import {useScreenSpecs} from "../../adapt/ScreenSpecs.ts";
import {observer} from "mobx-react-lite";

export const GameViewAdapter = observer(function GameViewAdapter({children}: {
    children: ReactNode
}) {
    const screenSpecs = useScreenSpecs()
    const layoutMode = screenSpecs.layoutMode

    const fixedWidth = 900 * screenSpecs.height / 900
    const controlPanelGapValue = 30 * screenSpecs.height / 900

    const controlPanelGap = `${controlPanelGapValue}px`
    const width =
        layoutMode === "Collapsed" ? `calc(100% - 30px)` :
            layoutMode === "Shrinking" ? "82%" : `${fixedWidth}px`

    return (
        <div style={{
            width: width,
            paddingRight: layoutMode === "Collapsed" ? 0 : controlPanelGap,
            paddingBottom: layoutMode === "Collapsed" ? controlPanelGap : 0
        }}>
            {children}
        </div>
    )
})