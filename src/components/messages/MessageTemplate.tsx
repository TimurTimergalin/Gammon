import styled from "styled-components";
import {ReactNode, useContext} from "react";
import {MessageContainerContext} from "./MessageContainerContext";
import {MessagesStateContext} from "../../controller/messages/context";

const PlainMessageTemplate = ({className, children, onClose=()=>{}}: {className?: string, children?: ReactNode | ReactNode[], onClose?: () => void}) => {
    const index = useContext(MessageContainerContext)
    const messagesState = useContext(MessagesStateContext)

    return (
        <div className={className}>
            {children}
            <img src={"/close.svg"} alt={"Закрыть"} onClick={() => {
                onClose()
                messagesState.remove(index)
            }}/>
        </div>
    )
}

export const MessageTemplate = styled(PlainMessageTemplate)`
    border-radius: 10px;
    position: relative;
    
    >img {
        position: absolute;
        top: 5px;
        right: 5px;
        width: 25px;
        height: 25px;
        font-size: 8px;
        color: white;
        cursor: pointer;
    }
`