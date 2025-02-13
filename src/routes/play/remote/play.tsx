import {RuleSet} from "../../../game/game_rule/RuleSet";
import {RemoteSet} from "../../../game/game_rule/RemoteSet";
import {useFullGameContext} from "../../../game/GameContext";
import {useEffect, useRef, useState} from "react";
import {GameController} from "../../../game/game_controller/GameController";
import {LabelMapper} from "../../../game/game_rule/LabelMapper";
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

const console = logger("windows/game")

interface RemoteGameWindowProps<RemoteConfig, Index, Prop, RemoteMove> {
    ruleSet: RuleSet<Index, Prop>,
    remoteSet: RemoteSet<RemoteConfig, Index, Prop, RemoteMove>
}

const InnerRemoteGameWindow = <RemoteConfig, Index, Prop, RemoteMove>(
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


    const [gameController, setGameController] = useState<GameController | undefined>(undefined)

    const [cleanup, setCleanup] = useState<undefined | { cleanup: () => void }>(undefined)

    const labelMapper_ = useRef<LabelMapper | undefined>(undefined)

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
            remoteSet: remoteSet,
            roomId: roomIdParsed,
            ruleSet: ruleSet,
            fetch: fetch
        }).then(({controller, cleanup, labelMapper}) => {
            setGameController(controller)
            setCleanup({cleanup: cleanup})
            labelMapper_.current = labelMapper
        })
    }, [fetch, gameContext, remoteSet, roomIdParsed, ruleSet]);

    return (
        <GameAndControlPanelContainer>
            <div style={{width: "100%", height: "100%", position: "relative"}}>
                {gameController !== undefined &&
                    <GamePart displayButtons={true}>
                        <GameView gameController={gameController} labelMapper={labelMapper_.current}/>
                    </GamePart>
                }
                <EndWindow>
                    <RemotePlayWindowContent/>
                </EndWindow>
            </div>
            <ControlPanel/>
        </GameAndControlPanelContainer>
    )
}

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