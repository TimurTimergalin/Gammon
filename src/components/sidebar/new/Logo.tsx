import {useNavigate} from "react-router";
import {CSSProperties} from "react";

export const NewLogo = ({iconSrc}: { iconSrc: string }) => {
    const navigate = useNavigate()

    const imgStyle: CSSProperties = {
        width: "100%",
        userSelect: "none"
    }

    const containerStyle: CSSProperties = {
        display: "flex",
        marginTop: 20,
        marginBottom: 20,
        cursor: "pointer"
    }

    return (
        <div style={containerStyle}>
            <img src={iconSrc} alt={"ONBOARD"} onClick={() => navigate("/")} style={imgStyle}/>
        </div>
    )
}