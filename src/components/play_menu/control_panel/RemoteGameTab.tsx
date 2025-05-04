import {CSSProperties, useCallback, useContext, useEffect, useRef, useState} from "react";
import {SwitchSelect} from "./SwitchSelect";
import {AccentedButton} from "../../AccentedButton";
import {Link, useNavigate} from "react-router";
import {useFetch} from "../../../common/hooks";
import {connect, disconnect} from "../../../requests/requests";
import {logResponseError} from "../../../requests/util";
import {playUri} from "../../../requests/paths";
import styled from "styled-components";
import {firstEntryMargin, playButtonStyle, tabEntryStyle} from "./style";
import {observer} from "mobx-react-lite";
import {useAuthContext} from "../../../controller/auth_status/context";
import {ControlPanelContext} from "../../../controller/play_menu/ControlPanelContext";


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

const PlainAuthRemoteGameTab = observer(({className}: { className?: string }) => {
    const gameMode = useRef(0)
    const pointsUntil = useRef(0)
    const startedConnection = useRef(false)
    const navigate = useNavigate()
    const controlPanelState = useContext(ControlPanelContext)
    const [fetch, fetchCleanups] = useFetch()

    const gameModes = ["Короткие нарды", "Длинные нарды"]
    const pointsOptions = ["1", "3", "5", "7"]

    const callback = useCallback(() => {
        startedConnection.current = true
        controlPanelState.enabled = false
        const game = gameMode.current === 0 ? "SHORT_BACKGAMMON" : "REGULAR_GAMMON"
        const points =
            pointsUntil.current === 0 ? 1 :
                pointsUntil.current === 1 ? 3 :
                    pointsUntil.current === 2 ? 5 : 7
        connect(fetch, game, points)
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
    }, [controlPanelState, fetch, navigate])

    useEffect(() => {
        fetchCleanups.add(
            async () => {
                if (startedConnection.current) {
                    await disconnect(fetch)
                    controlPanelState.enabled = true
                    console.debug("Disconnected")
                }
            }
        )
    }, [controlPanelState, fetch, fetchCleanups]);

    useEffect(() => {
        return () => console.debug("De-render")
    }, []);

    const screenStyle = {
        position: "absolute",
        width: "100%",
        height: "100%",
        backgroundColor: "#66666666",
    } satisfies CSSProperties

    return (
        <div className={className}>
            <SwitchSelect options={gameModes} callback={(i) => gameMode.current = i}/>
            <SwitchSelect options={pointsOptions} callback={(i) => pointsUntil.current = i}/>
            <PlayButton onClick={callback}/>
            {!controlPanelState.enabled &&
                <div style={screenStyle} />
            }
        </div>
    )
})

const AuthRemoteGameTab = styled(PlainAuthRemoteGameTab)`
    & {
        display: flex;
        flex-direction: column;
        position: relative;
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

const PlainNonAuthRemoteGameTab = ({className}: {className?: string}) => {
    const linkStyle = {
        color: "#ff7f2a"
    } satisfies CSSProperties

    return (
        <div className={className}>
            <p>Чтобы играть с другими игроками необходимо <Link to={"/sign-in"} style={linkStyle}>войти</Link></p>
        </div>
    )
}

const NonAuthRemoteGameTab = styled(PlainNonAuthRemoteGameTab)`
    & {
        display: flex;
        flex-direction: column;
    }
    
    & >:nth-child(1) {
        ${tabEntryStyle};
        text-align: center;
    }
`

export const RemoteGameTab = observer(function RemoteGameTab() {
    const authStatus = useAuthContext()

    if (authStatus.id === null) {
        return <NonAuthRemoteGameTab />
    } else {
        return <AuthRemoteGameTab />
    }
})