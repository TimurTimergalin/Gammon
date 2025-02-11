import {useCallback, useEffect, useRef, useState} from "react";
import {SwitchSelect} from "./SwitchSelect";
import {AccentedButton} from "../../AccentedButton";
import {useNavigate} from "react-router";
import {useFetch} from "../../../common/hooks";
import {connect, disconnect} from "../../../requests/requests";
import {logResponseError} from "../../../requests/util";
import {playUri} from "../../../requests/paths";
import styled from "styled-components";
import {firstEntryMargin, playButtonStyle, tabEntryStyle} from "./style";
import {logger} from "../../../logging/main";

const console = logger("components/play_menu/new_control_panel")

const AnimateEllipsis = ({children}: { children: string }) => {
    const [numberOfDots, setNumberOfDots] = useState(3)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setNumberOfDots(
                numberOfDots === 3 ? 1 : numberOfDots === 1 ? 2 : 3
            )
        }, 300)
        return () => clearTimeout(timeout)
    }, [numberOfDots]);

    return children + ".".repeat(numberOfDots)
}

const PlayButton = ({onClick}: { onClick: () => void }) => {
    const [clicked, setClicked] = useState(false)

    const callback = () => {
        setClicked(true)
        onClick()
    }

    return (
        <AccentedButton onClick={callback} disabled={clicked}>
            {clicked ? <AnimateEllipsis>Поиск</AnimateEllipsis> : "Играть"}
        </AccentedButton>
    )
}

const PlainRemoteGameTab = ({className}: { className?: string }) => {
    const gameMode = useRef(0)
    const pointsUntil = useRef(0)
    const startedConnection = useRef(false)
    const navigate = useNavigate()
    const [fetch, fetchCleanups] = useFetch()

    const gameModes = ["Короткие нарды"]
    const pointsOptions = ["1", "3", "5", "7"]

    const callback = useCallback(() => {
        startedConnection.current = true
        const gameMode = "SHORT_BACKGAMMON"  // Должен зависеть от gameMode
        const points =
            pointsUntil.current === 0 ? 1 :
                pointsUntil.current === 1 ? 3 :
                    pointsUntil.current === 2 ? 5 : 7
        connect(fetch, gameMode, points)
            .then(resp => {
                startedConnection.current = false
                return resp
            })
            .then(resp => {
                    logResponseError(resp, "connecting to a game")
                    return resp.text()
                }
            )
            .then(parseInt)
            .then(roomId => isNaN(roomId) ? console.error("Unable to get roomId") : navigate(playUri(roomId)))
    }, [fetch, navigate])

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

    useEffect(() => {
        return () => console.debug("De-render")
    }, []);

    return (
        <div className={className}>
            <SwitchSelect options={gameModes} callback={(i) => gameMode.current = i}/>
            <SwitchSelect options={pointsOptions} callback={(i) => pointsUntil.current = i}/>
            <PlayButton onClick={callback}/>
        </div>
    )
}

export const RemoteGameTab = styled(PlainRemoteGameTab)`
    & {
        display: flex;
        flex-direction: column;
    }

    & > :nth-child(-n + 2) {
        ${tabEntryStyle}
    }

    & > :nth-child(1) {
        ${firstEntryMargin}
    }

    & > :nth-child(3) {
        ${playButtonStyle}
    }
`