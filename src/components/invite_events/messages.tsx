import styled from "styled-components";
import {MessageTemplate} from "../messages/MessageTemplate";
import {useContext} from "react";
import {MessageContainerContext} from "../messages/MessageContainerContext";
import {MessagesStateContext} from "../../controller/messages/context";
import {answerChallenge} from "../../requests/requests";
import {useNavigate} from "react-router";
import {AccentedButton} from "../AccentedButton";
import {GreyButton} from "../profile/edit/common";

const PlainChallengeCancelledMessage = ({className}: {className?: string}) => {
    return (
        <MessageTemplate className={className}>
            Вызов был отменен
        </MessageTemplate>
    )
}

export const ChallengeCancelledMessage = styled(PlainChallengeCancelledMessage)`
    background-color: #f2bfbf;
    height: 70px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 30px;
    color: black;
`

const PlainConnectionErrorMessage = ({className}: {className?: string}) => {
    return (
        <MessageTemplate className={className}>
            Не удалось установить соединение
        </MessageTemplate>
    )
}

export const ConnectionErrorMessage = styled(PlainConnectionErrorMessage)`
    background-color: #f2bfbf;
    height: 70px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 30px;
    color: black;
`


const PlainChallengeReceivedMessage = ({className, userId, username, gameType, points, blitz}: {
    className?: string,
    userId: number,
    username: string,
    gameType: "Короткие нарды" | "Длинные нарды",
    points: number,
    blitz: boolean
}) => {
    const messageId = useContext(MessageContainerContext)
    const messagesState = useContext(MessagesStateContext)
    const navigate = useNavigate()

    const onAccept = () => {
        answerChallenge(fetch, userId, true)
            .then(resp => {
                if (!resp.ok) {
                    throw new Error()
                }
                return resp.json()
            })
            .then(({matchId}) => {
                navigate(`/play/${matchId}`)
            })
            .catch(
                () => messagesState.insert(<ChallengeCancelledMessage />)
            )
        messagesState.remove(messageId)
    }

    const onReject = () => {
        answerChallenge(fetch, userId, false).then()
    }


    return (
        <MessageTemplate className={className} onClose={onReject}>
            <div>
                <p>{username} бросил вам вызов:</p>
                <p>{gameType} {blitz ? "(Блиц)" : ""} до {points}</p>
            </div>
            <AccentedButton onClick={onAccept}>Принять</AccentedButton>
            <GreyButton onClick={() => {
                onReject();
                messagesState.remove(messageId)
            }}>Отклонить</GreyButton>
        </MessageTemplate>
    )
}

export const ChallengeReceivedMessage = styled(PlainChallengeReceivedMessage)`
    background-color: white;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 30px;
    color: black;
    height: 90px;
    
    >button:nth-of-type(1) {
        margin-left: auto;
    }
    >button:nth-of-type(2) {
        margin-left: 7px;
    }
    >button {
        height: 50px;
        border-radius: 10px;
    }
`

const PlainChallengeRejectedMessage = ({className, username}: {className?: string, username: string}) => {
    return (
        <MessageTemplate className={className}>
            {username} отверг ваш вызов
        </MessageTemplate>
    )
}

export const ChallengeRejectedMessage = styled(PlainChallengeRejectedMessage)`
    background-color: #f2bfbf;
    height: 70px;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 30px;
    color: black;
`