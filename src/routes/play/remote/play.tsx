import {useFullGameContext} from "../../../game/GameContext";
import {useEffect, useState} from "react";
import {remoteGameInit} from "../../../game/game_controller/remote/factory";
import {GameAndControlPanelContainer} from "../../../components/game_page/old/GameAndControlPanelContainer";
import GameView from "../../../components/game/GameView";
import {NormalControlPanel} from "../../../components/game/control_panel/ControlPanel";
import {GameContextHolder} from "../../../components/game/GameContextHolder";
import {GamePart} from "../../../components/game_page/old/GamePart";
import {logger} from "../../../logging/main";

import type {Route} from "../../../../.react-router/types/src/routes/+types";
import {EndWindow} from "../../../components/game/end_window/EndWindow";
import {RemotePlayEndWindowContent} from "./_deps/RemotePlayEndWindowContent";
import {useFetch} from "../../../common/hooks";
import {observer} from "mobx-react-lite";
import {PlayerState} from "../../../game/player_info/PlayerState";

const console = logger("windows/game")



const InnerRemoteGameWindow = observer((
    {params}:  Route.ComponentProps
) => {
    const gameContext = useFullGameContext()

    const {roomId} = params
    useEffect(() => {
        console.assert(roomId !== undefined)
    }, [roomId]);

    const roomIdParsed = parseInt(roomId!)

    useEffect(() => {
        console.assert(!isNaN(roomIdParsed))
    }, [roomIdParsed]);

    const [cleanup, setCleanup] = useState<undefined | { cleanup: () => void }>(undefined)
    const [gameLoaded, setGameLoaded] = useState(false)

    const [player1, setPlayer1] = useState<PlayerState | undefined>()
    const [player2, setPlayer2] = useState<PlayerState | undefined>()

    useEffect(() => {
        if (cleanup !== undefined) {
            const newCleanup = () => {
                window.removeEventListener("unload", newCleanup)
                cleanup.cleanup()
            }
            window.addEventListener("unload", newCleanup)
            return newCleanup
        }
    }, [cleanup])

    const [fetch] = useFetch()

    useEffect(() => {
        remoteGameInit({
            gameContext: gameContext,
            roomId: roomIdParsed,
            fetch: fetch
        }).then(({cleanup, player1, player2}) => {
            setGameLoaded(true)
            setCleanup({cleanup: cleanup})
            setPlayer1(player1)
            setPlayer2(player2)
        })
    }, [fetch, gameContext, roomIdParsed]);

    return (
        <GameAndControlPanelContainer>
            <div style={{width: "100%", height: "100%", position: "relative"}}>
                {gameLoaded &&
                    <GamePart displayControls={true} player1={player1} player2={player2}>
                        <GameView/>
                    </GamePart>
                }
                <EndWindow>
                    <RemotePlayEndWindowContent/>
                </EndWindow>
            </div>
            <NormalControlPanel/>
        </GameAndControlPanelContainer>
    )
})

export const RemoteGamePage = (
    props: Route.ComponentProps
) => (
    <GameContextHolder>
        <InnerRemoteGameWindow {...props} />
    </GameContextHolder>
)

export default function Component(props: Route.ComponentProps) {
    return <RemoteGamePage {...props}/>;
}