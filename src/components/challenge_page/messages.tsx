import styled from "styled-components";
import {MessageTemplate} from "../messages/MessageTemplate";
import {AccentedButton} from "../AccentedButton";
import {cancelChallenge} from "../../requests/requests";
import {useContext} from "react";
import {MessageContainerContext} from "../messages/MessageContainerContext";
import {MessagesStateContext} from "../../controller/messages/context";

const PlainChallengeCreatedMessage = ({className, userId}: {className?: string, userId: number}) => {
    const messageId = useContext(MessageContainerContext)
    const messagesState = useContext(MessagesStateContext)

    return (
        <MessageTemplate className={className}>
            Вызов Отправлен
            <AccentedButton onClick={() => {
                cancelChallenge(fetch, userId).then()
                messagesState.remove(messageId)
            }}>Отменить</AccentedButton>
        </MessageTemplate>
    )
}

export const ChallengeCreatedMessage = styled(PlainChallengeCreatedMessage)`
    background-color: white;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 30px;
    color: black;
    height: 70px;
    
    ${AccentedButton} {
        margin-left: auto;
        height: 50px;
        border-radius: 10px;
    }
`

const PlainErrorMessage = ({className}: {className?: string}) => {
    return (
        <MessageTemplate className={className}>
            Не удалось отправить вызов
        </MessageTemplate>
    )
}

export const ErrorMessage = styled(PlainErrorMessage)`
    background-color: #f2bfbf;
    height: 70px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 30px;
    color: black;
`