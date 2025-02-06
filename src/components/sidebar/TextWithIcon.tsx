import {CSSProperties, ReactNode} from "react";
import {textHeight} from "./size_constants";
import {useScreenSpecs} from "../../adapt/ScreenSpecs";
import {observer} from "mobx-react-lite";
import styled from "styled-components";
import {useNavigate} from "react-router";
import {fontFamily} from "../../common/font";

const PlainTextWithIcon = observer(function TextWithIcon({text, children, className, navigateTo}: {
    text: string,
    children: ReactNode,
    className?: string,
    navigateTo: string
}) {
    const screenSpecs = useScreenSpecs();
    const layoutMode = screenSpecs.layoutMode
    const navigate = useNavigate()

    const expanded = layoutMode === "Free" || layoutMode === "Collapsed"

    const imageSize = 0.7 * textHeight

    const imageStyle: CSSProperties = {
        height: expanded ? `${imageSize}px` : "auto",
        width: expanded ? "auto" : `${imageSize}px`,
        userSelect: "none"
    }

    const fontSizeValue = 1.1

    const textMarginLeft = 15

    const textStyle: CSSProperties = {
        marginLeft: `${textMarginLeft}px`,
        lineHeight: "1em",
        marginTop: 0,
        marginBottom: 0,
        userSelect: "none",
        color: "white",
        fontSize: `${fontSizeValue}em`,
        fontFamily: `${fontFamily}, sans-serif`,
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
        padding-left: 15%;
        padding-top: 7%;
        padding-bottom: 7%;
        align-self: stretch;
    }
    
    &:hover {
        background-color: #332c26;
    }
`