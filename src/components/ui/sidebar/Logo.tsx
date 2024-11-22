import {CSSProperties} from "react";

export const Logo = () => {
    const imagStyle: CSSProperties = {
        marginLeft: "auto",
        marginRight: "auto",
        userSelect: "none"
    }
    const containerStyle = {display: "flex", marginTop: "20px"};
    return (
        <div style={containerStyle}>
            <img src={"placeholder.svg"} alt={"logo"} width={"65%"} style={imagStyle}/>
        </div>
    )
}