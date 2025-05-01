import {useNavigate} from "react-router";
import {textHeight} from "../size_constants";
import {CSSProperties, ReactNode} from "react";
import {fontFamily} from "../../../common/font";
import {observer} from "mobx-react-lite";
import {useSideBarLayout} from "../../new_adapt/SideBarContext";
import styled from "styled-components";
import {iconStyle} from "../icon_style";

type SideBarIconProps = {
    text: string,
    children: ReactNode,
    className?: string,
    navigateTo: string
}
const IconWithText = ({text, children, className, navigateTo}: SideBarIconProps) => {
    const navigate = useNavigate()
    const imageSize = 0.7 * textHeight
    const imageStyle: CSSProperties = {
        height: imageSize,
        width: "auto",
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
        <div className={className} onClick={() => navigate(navigateTo)}>
            <div style={imageStyle}>
                {children}
            </div>
            <p style={textStyle}>
                {text}
            </p>
        </div>
    )
}
const IconWithoutText = ({children, className, navigateTo}: Omit<SideBarIconProps, "text">) => {
    const navigate = useNavigate()
    const imageSize = 0.7 * textHeight
    const imageStyle: CSSProperties = {
        height: "auto",
        width: imageSize,
        userSelect: "none"
    }

    return (
        <div className={className} onClick={() => navigate(navigateTo)}>
            <div style={imageStyle}>
                {children}
            </div>
        </div>
    )
}
const PlainSideBarIcon = observer(function PlainSideBarIcon(props: SideBarIconProps) {
    const sideBarLayout = useSideBarLayout()
    if (sideBarLayout.mode === "Diminished") {
        return <IconWithoutText {...props}>{props.children}</IconWithoutText>
    }
    return <IconWithText {...props}>{props.children}</IconWithText>
})
export const SideBarIcon = styled(PlainSideBarIcon)`
    ${iconStyle}
`