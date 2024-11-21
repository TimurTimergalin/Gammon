import {ReactNode} from "react";
import {useScreenSpecs} from "./ScreenSpecs.ts";
import {observer} from "mobx-react-lite";

export const AdaptiveWindow = observer(function AdaptiveWindow({children}: {
    children: ReactNode | ReactNode[]
}) {
    const layoutMode = useScreenSpecs().layoutMode
    const direction = layoutMode === "Collapsed" ? "column" : "row";
    return (
        <div style={{
            display: "flex",
            flexDirection: direction,
            width: "100%",
            height: "100%",
            backgroundColor: "#33130d"
        }}>
            {children}
        </div>
    )
})