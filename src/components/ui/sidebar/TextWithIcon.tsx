import {CSSProperties} from "react";
import {textHeight} from "./size_constants.ts";
import {useScreenSpecs} from "../adapt/ScreenSpecs.ts";
import {observer} from "mobx-react-lite";

export const TextWithIcon = observer(function TextWithIcon({text, imageSrc, imageAlt}: {
    text: string,
    imageSrc: string,
    imageAlt: string
}) {
    const screenSpecs = useScreenSpecs();
    const layoutMode = screenSpecs.layoutMode
    const scaleMode = screenSpecs.scaleMode

    const expanded = layoutMode === "Free" || layoutMode === "Collapsed"

    const imageSize = 0.7 * textHeight * screenSpecs.height / 900

    const imageStyle: CSSProperties = {
        height: expanded ? `${imageSize}px` : "auto",
        width: expanded ? "auto" : `${imageSize}px`,
        userSelect: "none"
    }

    const fontSizeValue = scaleMode === "Normal" ? 1.3 : scaleMode === "Minimized" ? 0.8 : 0.5

    const textMarginLeft = 15 * screenSpecs.height / 900

    const textStyle: CSSProperties = {
        marginLeft: `${textMarginLeft}px`,
        lineHeight: "1em",
        marginTop: 0,
        marginBottom: 0,
        userSelect: "none",
        color: "white",
        fontSize: `${fontSizeValue}em`
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
})