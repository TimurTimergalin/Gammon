import {ReactNode} from "react";
import styled from "styled-components";

const PlainControlButton = ({children, disabled, className, onClick}: {
    children: ReactNode | ReactNode[]
    disabled: boolean,
    className?: string,
    onClick: () => void
}) => (
    <button disabled={disabled} onClick={onClick} className={className}>{children}</button>
)
export const ControlButton = styled(PlainControlButton)`
    & {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 8%;
        padding: 0;
        margin-left: 1%;
        user-select: none;
        background-color: #ff7f2a;
        border-radius: 10%;
        border: 0;
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