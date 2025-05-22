import {ReactNode, useContext, useEffect, useRef} from "react";
import {MessagesStateContext} from "../../controller/messages/context";
import {challengeEventsUri} from "../../requests/paths";
import {ChallengeReceivedMessage, ChallengeRejectedMessage} from "./messages";
import {userInfo} from "../../requests/requests";
import {useNavigate} from "react-router";
import {useAuthContext} from "../../controller/auth_status/context";
import {observer} from "mobx-react-lite";

export const ChallengeEventHandler = observer(({children}: { children?: ReactNode | ReactNode[] }) => {
    const messagesState = useContext(MessagesStateContext)
    const eventSource = useRef<EventSource | null>(null)
    const navigate = useNavigate()
    const authStatus = useAuthContext()

    useEffect(() => {
        const eventSource_ = new EventSource(challengeEventsUri, {withCredentials: true})
        console.log("Connecting to events")
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
                    navigate(`/play/${data.gameId}`)
                } else {
                    console.warn(`Неизвестный тип сообщения: ${data.type}`)
                }
            } catch(e) {
                console.error(e)
            }
        }

        eventSource_.onerror = (e) => console.error(e)
        eventSource.current = eventSource_
        return () => {
            console.log("Disconnecting from events")
            eventSource_.close()
            eventSource.current = null
        }
    }, [messagesState, navigate, authStatus.id])

    return children
})
