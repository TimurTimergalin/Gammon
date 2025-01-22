import {CSSProperties, ReactNode} from "react";
import styled from "styled-components";

const PlainAccentedButton = ({children, disabled, className, onClick, style = {}}: {
    children: ReactNode | ReactNode[]
    disabled: boolean,
    className?: string,
    onClick: () => void,
    style?: CSSProperties
}) => (
    <button disabled={disabled} onClick={onClick} className={className} style={style} type={"button"}>{children}</button>
)
export const AccentedButton = styled(PlainAccentedButton)`
    & {
        justify-content: center;
        align-items: center;
        user-select: none;
        background-color: #ff7f2a;
        border: 0;
        font-family: Comfortaa, sans-serif;
        color: white;
    }
    &[disabled], &:disabled {
        background-color: #976646;
    }
    
    &:hover:enabled {
        background-color: #ff954e;
    }
    
    &:active:enabled {
        background-color: #ff7f2a;
    }
`