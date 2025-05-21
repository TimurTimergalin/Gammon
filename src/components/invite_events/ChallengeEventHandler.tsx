import {ReactNode, useContext, useEffect, useRef} from "react";
import {MessagesStateContext} from "../../controller/messages/context";
import {challengeEventsUri} from "../../requests/paths";
import {ChallengeReceivedMessage, ChallengeRejectedMessage, ConnectionErrorMessage} from "./messages";
import {userInfo} from "../../requests/requests";
import {useNavigate} from "react-router";

export const ChallengeEventHandler = ({children}: { children?: ReactNode | ReactNode[] }) => {
    const messagesState = useContext(MessagesStateContext)
    const eventSource = useRef<EventSource | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const eventSource_ = new EventSource(challengeEventsUri, {withCredentials: true})

        eventSource_.onmessage = ev => {
            try {
                const data = JSON.parse(ev.data)
                if (data.type === undefined) {
                    console.warn("Событие без типа")
                } else if (data.type === "INVITE") {
                    userInfo(fetch, data.by)
                        .then(resp => resp.json())
                        .then(json => {
                            messagesState.insert(<ChallengeReceivedMessage
                                gameType={data.gameType === "SHORT_BACKGAMMON" ? "Короткие нарды" : "Длинные нарды"}
                                blitz={data.timePolicy === "BLITZ"} userId={data.by} username={json.username}
                                points={data.points}/>)
                        })
                } else if (data.type === "REJECT_INVITE") {
                    userInfo(fetch, data.by)
                        .then(resp => resp.json())
                        .then(json => {
                            messagesState.insert(<ChallengeRejectedMessage username={json.username} />)
                        })
                } else if (data.type === "ACCEPT_INVITE") {
                    navigate(`/play/${data.matchId}`)
                } else {
                    console.warn(`Неизвестный тип сообщения: ${data.type}`)
                }
            } catch {
                messagesState.insert(<ConnectionErrorMessage/>)
            }
        }
        
        eventSource_.onerror = () => messagesState.insert(<ConnectionErrorMessage />)
        eventSource.current = eventSource_
    }, [messagesState, navigate])

    return children
}
