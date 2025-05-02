import {observer} from "mobx-react-lite";
import type {Route} from "../../../../.react-router/types/src/routes/play/remote/+types/play_new";
import {useFullGameContext} from "../../../game/GameContext";
import {useEffect, useState} from "react";
import {useFetch} from "../../../common/hooks";
import {remoteGameInit} from "../../../game/game_controller/remote/factory";
import {GamePage} from "../../../components/game_page/new/GamePage";
import GameView from "../../../components/game/GameView";
import {EndWindow} from "../../../components/game/end_window/EndWindow";
import {RemotePlayEndWindowContent} from "./_deps/RemotePlayEndWindowContent";
import {GameContextHolder} from "../../../components/game/GameContextHolder";


const InnerNewRemoteGamePage = observer(function InnerNewRemoteGamePage(
    {params}: Route.ComponentProps
) {
    const gameContext = useFullGameContext()

    const roomId = params.roomId
    const roomIdParsed = parseInt(roomId!)

    const [cleanup, setCleanup] = useState<undefined | { cleanup: () => void }>(undefined)
    const [gameLoaded, setGameLoaded] = useState(false)

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
            gameContext.playersInfo.player1 = player1
            gameContext.playersInfo.player2 = player2
        })
    }, [fetch, gameContext, roomIdParsed])

    return (
        <GamePage displayControls={true}>
            {gameLoaded &&
                <GameView />
            }
            <EndWindow>
                <RemotePlayEndWindowContent />
            </EndWindow>
        </GamePage>
    )
})

export default function NewRemoteGamePage(props: Route.ComponentProps) {
    return (
        <GameContextHolder>
            <InnerNewRemoteGamePage {...props} />
        </GameContextHolder>
    )
}
