import {RuleSet} from "../../../game/game_rule/RuleSet";
import {RemoteSet} from "../../../game/game_rule/RemoteSet";
import {useFullGameContext} from "../../../game/GameContext";
import {useEffect, useState} from "react";
import {remoteGameInit} from "../../../game/game_controller/remote/factory";
import {GameAndControlPanelContainer} from "../../../components/game_page/GameAndControlPanelContainer";
import GameView from "../../../components/game/GameView";
import {ControlPanel} from "../../../components/game/control_panel/ControlPanel";
import {GameContextHolder} from "../../../components/game/GameContextHolder";
import {GamePart} from "../../../components/game_page/GamePart";
import {logger} from "../../../logging/main";
import {backgammonRuleSet} from "../../../game/game_rule/backgammon/RuleSet";
import {backgammonRemoteSetV1} from "../../../game/game_rule/backgammon/remote_v1/RemoteSet";

import type {Route} from "../../../../.react-router/types/src/routes/+types";
import {EndWindow} from "../../../components/game/end_window/EndWindow";
import {RemotePlayWindowContent} from "./_deps/RemotePlayEndWindowContent";
import {useFetch} from "../../../common/hooks";
import {observer} from "mobx-react-lite";
import {PlayerState} from "../../../game/player_info/PlayerState";

const console = logger("windows/game")

interface RemoteGameWindowProps<RemoteConfig, Index, Prop, RemoteMove> {
    ruleSet: RuleSet<Index, Prop>,
    remoteSet: RemoteSet<RemoteConfig, Index, Prop, RemoteMove>
}

const InnerRemoteGameWindow = observer(<RemoteConfig, Index, Prop, RemoteMove>(
    {ruleSet, remoteSet, params}: RemoteGameWindowProps<RemoteConfig, Index, Prop, RemoteMove> & Route.ComponentProps
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
    }, [fetch, gameContext, remoteSet, roomIdParsed, ruleSet]);

    return (
        <GameAndControlPanelContainer>
            <div style={{width: "100%", height: "100%", position: "relative"}}>
                {gameLoaded &&
                    <GamePart displayButtons={true} player1={player1} player2={player2}>
                        <GameView/>
                    </GamePart>
                }
                <EndWindow>
                    <RemotePlayWindowContent/>
                </EndWindow>
            </div>
            <ControlPanel/>
        </GameAndControlPanelContainer>
    )
})

export const RemoteGamePage = <RemoteConfig, Index, Prop, RemoteMove>(
    props: RemoteGameWindowProps<RemoteConfig, Index, Prop, RemoteMove> & Route.ComponentProps
) => (
    <GameContextHolder>
        <InnerRemoteGameWindow {...props} />
    </GameContextHolder>
)

export default function Component(props: Route.ComponentProps) {
    return <RemoteGamePage ruleSet={backgammonRuleSet} remoteSet={backgammonRemoteSetV1} {...props}/>;
}