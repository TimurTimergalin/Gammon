import {ReactNode, useContext} from "react";
import {LayoutModeContext} from "./LayoutModeContext.ts";

export const AdaptiveWindow = ({children}: {
    children: ReactNode | ReactNode[]
}) => {
    const layoutMode = useContext(LayoutModeContext)
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
}