import {CSSProperties} from "react";
import {textHeight} from "./size_constants.ts";
import {useScreenSpecs} from "../adapt/ScreenSpecs.ts";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {useNavigate} from "react-router";

const PlainTextWithIcon = observer(function TextWithIcon({text, imageSrc, imageAlt, className, navigateTo}: {
    text: string,
    imageSrc: string,
    imageAlt: string,
    className?: string,
    navigateTo: string
}) {
    const screenSpecs = useScreenSpecs();
    const layoutMode = screenSpecs.layoutMode
    const scaleMode = screenSpecs.scaleMode
    const navigate = useNavigate()

    const expanded = layoutMode === "Free" || layoutMode === "Collapsed"

    const imageSize = 0.7 * textHeight * screenSpecs.scaleFactor

    const imageStyle: CSSProperties = {
        height: expanded ? `${imageSize}px` : "auto",
        width: expanded ? "auto" : `${imageSize}px`,
        userSelect: "none"
    }

    const fontSizeValue = scaleMode === "Normal" ? 1.3 : scaleMode === "Minimized" ? 0.8 : 0.5

    const textMarginLeft = 15 * screenSpecs.scaleFactor

    const textStyle: CSSProperties = {
        marginLeft: `${textMarginLeft}px`,
        lineHeight: "1em",
        marginTop: 0,
        marginBottom: 0,
        userSelect: "none",
        color: "white",
        fontSize: `${fontSizeValue}em`,
        fontFamily: "Comfortaa, serif",
        fontWeight: 400,
    }

    return (
        <div
            className={className}
            onClick={() => navigate(navigateTo)}
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

export const TextWithIcon = styled(PlainTextWithIcon)`
    & {
        display: flex;
        flex-direction: row;
        align-items: center;
        height: ${() => textHeight};
        padding-left: 7%;
        padding-top: 7%;
        padding-bottom: 7%;
        align-self: stretch;
    }
    
    &:hover {
        background-color: #332c26;
    }
`