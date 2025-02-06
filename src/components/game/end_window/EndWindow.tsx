import {CSSProperties, ReactNode} from "react";
import styled, {keyframes} from "styled-components";
import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";

const PlainEndWindowTitle = ({className, children}: { className?: string, children: string }) => {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

const EndWindowTitle = styled(PlainEndWindowTitle)`
    background-color: lightgray;
    border-top-left-radius: inherit;
    border-top-right-radius: inherit;
    height: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #2f2e2d;
    font-weight: 600;
    font-size: 20px;
`

const PlainEndWindow = ({className, title, children}: {
    className?: string,
    title?: string,
    children?: ReactNode | ReactNode[],
}) => {
    const toDisplay = title !== undefined

    const containerStyle: CSSProperties = {
        position: "absolute",
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        alignContent: "center",
        pointerEvents: "none"
    }

    return (
        <div style={containerStyle}>
            {toDisplay &&
                <div className={className}>
                    <EndWindowTitle>{title}</EndWindowTitle>
                    <div>
                        {children}
                    </div>
                </div>
            }
        </div>
    )
}

const windowAppearanceAnimation = keyframes`
    from {
        transform: translate(0, -12%);
        opacity: 0;
    }
    
    to {
        transform: translate(0, 0);
        opacity: 100;
    }
`

const EndWindowStyle = styled(PlainEndWindow)`
    width: 300px;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    border-radius: 20px;
    background-color: white;
    animation: ${windowAppearanceAnimation} 0.3s ease-out;
    pointer-events: auto;
`

export const EndWindow = observer(function EndWindow({children}: {children?: ReactNode | ReactNode[]}) {
    const endWindowState = useGameContext("endWindowState")

    return <EndWindowStyle title={endWindowState.title}>{children}</EndWindowStyle>
})