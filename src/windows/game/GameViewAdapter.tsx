import {ReactNode} from "react";
import {observer} from "mobx-react-lite";
import {useScreenSpecs} from "../../components/adapt/ScreenSpecs";

export const GameViewAdapter = observer(function GameViewAdapter({children}: {
    children: ReactNode
}) {
    const screenSpecs = useScreenSpecs()
    const layoutMode = screenSpecs.layoutMode

    const fixedWidth = 900 * screenSpecs.scaleFactor + 0.01 * screenSpecs.width // Размер svg всегда должен меняться при изменении размера окна - иначе его clientRect будет считаться неправильно
    const controlPanelGapValue = 30 * screenSpecs.scaleFactor

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