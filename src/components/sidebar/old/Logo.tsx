import {observer} from "mobx-react-lite";
import {useScreenSpecs} from "../../../controller/adapt/ScreenSpecs";
import {useNavigate} from "react-router";
import {CSSProperties} from "react";

export const Logo = observer(function Logo() {
    const screenSpecs = useScreenSpecs()
    const layoutMode = screenSpecs.layoutMode
    const navigate = useNavigate()

    const imagStyle: CSSProperties = {
        width: "100%",
        userSelect: "none"
    }

    const iconSrc = layoutMode === "Free" || layoutMode === "Collapsed" ? "/expanded_icon.svg" : "/collapsed_icon.svg"

    const verticalMargin = 20

    const containerStyle: CSSProperties = {
        display: "flex",
        marginTop: verticalMargin,
        marginBottom: verticalMargin,
        cursor: "pointer"
    };
    return (
        <div style={containerStyle}>
            <img src={iconSrc} alt={"logo"} style={imagStyle} onClick={() => navigate("/")}/>
        </div>
    )
})