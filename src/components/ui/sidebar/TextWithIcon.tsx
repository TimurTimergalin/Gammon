import {CSSProperties, useContext} from "react";
import {LayoutModeContext} from "../adapt/LayoutModeContext.ts";
import {textHeight} from "./size_constants.ts";

export const TextWithIcon = ({text, imageSrc, imageAlt}: {
    text: string,
    imageSrc: string,
    imageAlt: string
}) => {
    const layoutMode = useContext(LayoutModeContext)

    const expanded = layoutMode === "Free" || layoutMode === "Collapsed"

    const imageStyle: CSSProperties = {
        height: expanded ? "70%" : "auto",
        width: expanded ? "auto" : "70%",
        userSelect: "none"
    }

    const textStyle: CSSProperties = {
        marginLeft: "15px",
        lineHeight: "1em",
        marginTop: 0,
        marginBottom: 0,
        userSelect: "none",
        color: "white",
        fontSize: "1.3em",
        fontFamily: "\"Arial\", sans-serif"
    }

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                height: textHeight,
                marginLeft: "15%"
            }}
        >
            <img src={imageSrc} alt={imageAlt} style={imageStyle}/>
            {expanded &&
                <p style={textStyle}>
                    {text}
                </p>
            }
        </div>
    )
}