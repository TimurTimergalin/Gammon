import {logResponseError} from "../../../requests/util";
import {getConfig} from "../../../requests/requests";
import {RemoteSet} from "../../game_rule/RemoteSet";
import {GameContext} from "../../GameContext";
import {RuleSet} from "../../game_rule/RuleSet";
import {RemoteConnectorImpl} from "./RemoteConnector";
import {RemoteGameController} from "./RemoteGameController";
import {BoardSynchronizer} from "../rules/BoardSynchronizer";

async function getConfigJson(roomId: number) {
    const resp = await getConfig(roomId)
    logResponseError(resp, "getting config")
    return await resp.json()
}

export async function remoteGameInit<RemoteConfig, Index, Prop, RemoteMove>(
    {remoteSet, ruleSet, roomId, gameContext}: {
        remoteSet: RemoteSet<RemoteConfig, Index, Prop, RemoteMove>,
        ruleSet: RuleSet<Index, Prop>,
        roomId: number,
        gameContext: GameContext
    }
) {
    const configJson = await getConfigJson(roomId) as RemoteConfig
    const config = remoteSet.configParser.mapConfig(configJson)


    const indexMapper = ruleSet.indexMapperFactory(config.userPlayer)

    const board = new BoardSynchronizer(
        gameContext.boardState,
        config.placement,
        indexMapper,
        ruleSet.propMapper
    )
    const connector = new RemoteConnectorImpl(remoteSet.remoteMoveMapper, roomId)

    const controller = new RemoteGameController({
        board: board,
        connector: connector,
        player: config.player,
        controlButtonsState: gameContext.controlButtonsState,
        diceState: gameContext.diceState,
        indexMapper: indexMapper,
        legalMovesTracker: gameContext.legalMovesTracker,
        rules: ruleSet.rules,
        userPlayer: config.userPlayer,
        labelState: gameContext.labelState
    })

    gameContext.diceState.dice1 = config.dice[0]
    gameContext.diceState.dice2 = config.dice[1]
    controller.calculateDice()

    connector.onMovesMade = controller.onMovesMade
    connector.onNewDice = controller.onNewDice
    connector.onEnd = controller.onEnd

    connector.subscribe()

    return {
        controller: controller,
        cleanup: connector.unsubscribe,
        labelMapper: ruleSet.labelMapperFactory(config.userPlayer)
    }
}