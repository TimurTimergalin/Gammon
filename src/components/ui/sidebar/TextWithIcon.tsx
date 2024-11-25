import {CSSProperties, ReactNode} from "react";
import {textHeight} from "./size_constants.ts";
import {useScreenSpecs} from "../adapt/ScreenSpecs.ts";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {useNavigate} from "react-router";

const PlainTextWithIcon = observer(function TextWithIcon({text, children, className, navigateTo}: {
    text: string,
    children: ReactNode,
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

    const fontSizeValue = scaleMode === "Normal" ? 1.1 : scaleMode === "Minimized" ? 0.75 : 0.4

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
            <div style={imageStyle}>
                {children}
            </div>
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
        height: ${() => textHeight}px;
        padding-left: 7%;
        padding-top: 7%;
        padding-bottom: 7%;
        align-self: stretch;
    }
    
    &:hover {
        background-color: #332c26;
    }
`