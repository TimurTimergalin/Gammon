import {RuleSet} from "../../game/game_rule/RuleSet";
import {RemoteSet} from "../../game/game_rule/RemoteSet";
import {useFullGameContext} from "../../game/GameContext";
import {useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {GameController} from "../../game/game_controller/GameController";
import {LabelMapper} from "../../game/game_rule/LabelMapper";
import {remoteGameInit} from "../../game/game_controller/remote/factory";
import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer";
import GameView from "../../components/game/GameView";
import {ControlPanel} from "../../components/game/control_panel/ControlPanel";
import {GameContextHolder} from "../../components/game/GameContextHolder";
import {GamePart} from "../../parts/GamePart";
import {logger} from "../../logging/main";

const console = logger("windows/game")

interface RemoteGameWindowProps<RemoteConfig, Index, Prop, RemoteMove> {
    ruleSet: RuleSet<Index, Prop>,
    remoteSet: RemoteSet<RemoteConfig, Index, Prop, RemoteMove>
}

const InnerRemoteGameWindow = <RemoteConfig, Index, Prop, RemoteMove>(
    {ruleSet, remoteSet}: RemoteGameWindowProps<RemoteConfig, Index, Prop, RemoteMove>
) => {
    const gameContext = useFullGameContext()
    const {roomId} = useParams()

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
            return cleanup.cleanup
        }
    }, [cleanup])

    useEffect(() => {
        remoteGameInit({
            gameContext: gameContext,
            remoteSet: remoteSet,
            roomId: roomIdParsed,
            ruleSet: ruleSet
        }).then(({controller, cleanup, labelMapper}) => {
            setGameController(controller)
            setCleanup({cleanup: cleanup})
            labelMapper_.current = labelMapper
        })
    }, [gameContext, remoteSet, roomIdParsed, ruleSet]);

    return (
        <GameAndControlPanelContainer>
            {gameController !== undefined &&
                <GamePart displayButtons={true}>
                    <GameView gameController={gameController} labelMapper={labelMapper_.current}/>
                </GamePart>
            }
            <ControlPanel/>
        </GameAndControlPanelContainer>
    )
}

export const RemoteGameWindow = <RemoteConfig, Index, Prop, RemoteMove>(
    props: RemoteGameWindowProps<RemoteConfig, Index, Prop, RemoteMove>
) => (
    <GameContextHolder>
        <InnerRemoteGameWindow {...props} />
    </GameContextHolder>
)