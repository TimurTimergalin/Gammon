import {RuleSet} from "../../game/game_rule/RuleSet.ts";
import {RemoteSet} from "../../game/game_rule/RemoteSet.ts";
import {useFullGameContext} from "../../game/GameContext.ts";
import {useParams} from "react-router";
import {useEffect, useRef, useState} from "react";
import {GameController} from "../../game/game_controller/GameController.ts";
import {LabelMapper} from "../../game/game_rule/LabelMapper.ts";
import {remoteGameInit} from "../../game/game_controller/remote/factory.ts";
import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../components/game/GameView.tsx";
import {ControlPanel} from "../../components/game/control_panel/ControlPanel.tsx";
import {GameContextHolder} from "../../components/game/GameContextHolder.tsx";


interface RemoteGameWindowProps<RemoteConfig, Index, Prop, RemoteMove> {
    ruleSet: RuleSet<Index, Prop>,
    remoteSet: RemoteSet<RemoteConfig, Index, Prop, RemoteMove>
}

const InnerRemoteGameWindow = <RemoteConfig, Index, Prop, RemoteMove>(
    {ruleSet, remoteSet}: RemoteGameWindowProps<RemoteConfig, Index, Prop, RemoteMove>
) => {
    const gameContext = useFullGameContext()
    const { roomId } = useParams()

    useEffect(() => {
        console.assert(roomId !== undefined)
    }, [roomId]);
    
    const roomIdParsed = parseInt(roomId!)
    
    useEffect(() => {
        console.assert(!isNaN(roomIdParsed))
    }, [roomIdParsed]);


    const [gameController, setGameController] = useState<GameController | undefined>(undefined)

    const [cleanup, setCleanup] = useState<undefined | {cleanup: () => void}>(undefined)

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
                <GameView gameController={gameController} labelMapper={labelMapper_.current}/>
            }
            <ControlPanel />
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