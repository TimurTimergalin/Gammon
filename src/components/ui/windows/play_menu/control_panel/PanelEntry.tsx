import {CSSProperties, ReactNode} from "react";
import {observer} from "mobx-react-lite";
import {useScreenSpecs} from "../../../adapt/ScreenSpecs.ts";

export const PanelEntry = observer(function PanelEntry({children}: {
    children: ReactNode | ReactNode[]
}) {
    const screenSpecs = useScreenSpecs()

    const height = 100 * screenSpecs.scaleFactor

    const style: CSSProperties = {
        display: "flex",
        width: "100%",
        height: `${height}px`,
        marginLeft: "10%",
        marginRight: "10%"
    }

    return (
        <div style={style}>
            {children}
        </div>
    )
})