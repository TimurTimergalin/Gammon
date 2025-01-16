import {RuleSet} from "../../../../game/game_rule/RuleSet.ts";
import {RemoteSet} from "../../../../game/game_rule/RemoteSet.ts";
import {useFullGameContext} from "../../../../game/GameContext.ts";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import {GameController} from "../../../../game/game_controller/GameController.ts";
import {remoteGameControllerFactory} from "../../../../game/game_controller/remote/factory.ts";
import {GameAndControlPanelContainer} from "./GameAndControlPanelContainer.tsx";
import GameView from "../../../game/GameView.tsx";
import {ControlPanel} from "../../../game/control_panel/ControlPanel.tsx";
import {GameContextHolder} from "../../../game/GameContextHolder.tsx";

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

    useEffect(() => {
        if (cleanup !== undefined) {
            return cleanup.cleanup
        }
    }, [cleanup])

    useEffect(() => {
        remoteGameControllerFactory({
            gameContext: gameContext,
            remoteSet: remoteSet,
            roomId: roomIdParsed,
            ruleSet: ruleSet
        }).then(({controller, cleanup}) => {
            setGameController(controller)
            setCleanup({cleanup: cleanup})
        })
    }, [gameContext, remoteSet, roomIdParsed, ruleSet]);

    return (
        <GameAndControlPanelContainer>
            {gameController !== undefined &&
                <GameView gameController={gameController} />
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