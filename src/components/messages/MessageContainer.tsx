import styled from "styled-components";
import {ReactNode} from "react";
import {MessageContainerContext} from "./MessageContainerContext";

const PlainMessageContainer = ({className, children, index}: {children: ReactNode, className?: string, index: number}) => {
    return (
        <div className={className}>
            <MessageContainerContext.Provider value={index}>
                {children}
            </MessageContainerContext.Provider>
        </div>
    )
}

export const MessageContainer = styled(PlainMessageContainer)`
    display: flex;
    align-items: stretch;
    >* {
        flex: 1;
    }
`
