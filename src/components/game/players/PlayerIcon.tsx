import {observer} from "mobx-react-lite";
import {CSSProperties} from "react";

export const PlayerIcon = observer(function PlayerIcon({username, iconSrc}:{
    username: string,
    iconSrc: string
}) {
    const containerStyle: CSSProperties = {
        padding: "10px",
        display: "flex",
        height: "30px",
        marginLeft: "10px",
        userSelect: "none"
    }

    const textStyle: CSSProperties = {
        marginLeft: "10px",
        marginTop: 0,
        marginBottom: 0,
        height: "min-content",
        alignSelf: "center"
    }

    return (
        <div style={containerStyle}>
            <img src={iconSrc} alt={"Icon"} style={{backgroundColor: "#252323", padding: "2px"}}/>
            <p style={textStyle}>{username}</p>
        </div>
    )
})