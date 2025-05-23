import styled from "styled-components";
import {useContext} from "react";
import {MessagesStateContext} from "../../controller/messages/context";
import {MessageContainer} from "./MessageContainer";
import {observer} from "mobx-react-lite";

const PlainMessagesQueue = observer(({className}: { className?: string }) => {
    const messagesState = useContext(MessagesStateContext)


    const nodes = messagesState.messages.map(([index, node]) => <MessageContainer index={index}
                                                                                  key={index}>{node}</MessageContainer>).reverse()
    console.log("Messages to display: ", nodes)
    return (
        <div className={className}>
            {nodes}
        </div>
    )
})

export const MessagesQueue = styled(PlainMessagesQueue)`
    display: flex;
    flex-direction: column-reverse;

    ${MessageContainer} {
        align-self: stretch;
        margin-bottom: 10px;
    }
`
