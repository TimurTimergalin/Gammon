import {ComponentProps, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router";
import {connect, disconnect} from "../../../../requests/requests";
import {logResponseError} from "../../../../requests/util";
import {AccentedButton} from "../../../../components/AccentedButton";
import {endWindowButtonStyle, endWindowContentStyle, returnToMenuButtonStyle} from "../../_deps/styles";
import styled from "styled-components";
import {useGameContext} from "../../../../game/GameContext";
import {useFetch} from "../../../../common/hooks";


const ReturnToMenuButton = (props: ComponentProps<"button">) => {
    const navigate = useNavigate()

    return (
        <button onClick={() => navigate("/play")} {...props}>На главную</button>
    )
}

const NewGameButton = (props: ComponentProps<"button">) => {
    const [disabled, setDisabled] = useState(false)
    const navigate = useNavigate()
    const endWindowState = useGameContext("endWindowState")
    const scoreState = useGameContext("scoreState")

    const startedConnection = useRef(false)
    const [fetch, fetchCleanups] = useFetch()

    const onClick = () => {
        startedConnection.current = true
        setDisabled(true)
        connect(fetch, "SHORT_BACKGAMMON", scoreState.total)
            .then(resp => {
                startedConnection.current = false
                return resp
            })
            .then(resp => {
                logResponseError(resp, "connecting to a game")
                return resp.text()
            })
            .then(parseInt)
            .then(roomId => isNaN(roomId) ? console.error("Unable to get roomId") : navigate(`/play/${roomId}`))
            .then(() => endWindowState.title = undefined)
    }

    useEffect(() => {
        fetchCleanups.push(
            async () => {
                if (startedConnection.current) {
                    await disconnect(fetch)
                    console.debug("Disconnected")
                }
            }
        )
    }, [fetch, fetchCleanups]);

    return (
        <AccentedButton onClick={onClick} {...props} disabled={disabled}>Новая игра</AccentedButton>
    )
}

const StyledReturnToMenuButton = styled(ReturnToMenuButton)`
    ${returnToMenuButtonStyle}
`

const StyledNewGameButton = styled(NewGameButton)`${endWindowButtonStyle}`

const PlainRemotePlayEndWindowContent = ({className}: {className?: string}) => {
    return (
        <div style={{display: "flex", flexDirection: "column"}}>
            <div className={className}>
                <StyledNewGameButton />
                <StyledReturnToMenuButton />
            </div>
        </div>
    )
}

export const RemotePlayEndWindowContent = styled(PlainRemotePlayEndWindowContent)`
    ${endWindowContentStyle}
`

