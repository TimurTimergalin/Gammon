import {logResponseError} from "../../../requests/util.ts";
import {getConfig} from "../../../requests/requests.ts";
import {RemoteSet} from "../../game_rule/RemoteSet.ts";
import {GameContext} from "../../GameContext.ts";
import {RuleSet} from "../../game_rule/RuleSet.ts";
import {RemoteConnectorImpl} from "./RemoteConnector.ts";
import {RemoteGameController} from "./RemoteGameController.ts";
import {BoardSynchronizer} from "../rules/BoardSynchronizer.ts";

async function getConfigJson(roomId: number) {
    const resp = await getConfig(roomId)
    logResponseError(resp, "getting config")
    return await resp.json()
}

export async function remoteGameControllerFactory<RemoteConfig, Index, Prop, RemoteMove>(
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
        userPlayer: config.userPlayer
    })

    gameContext.diceState.dice1 = config.dice[0]
    gameContext.diceState.dice2 = config.dice[1]

    connector.onMovesMade = controller.onMovesMade
    connector.onNewDice = controller.onNewDice
    connector.onEnd = controller.onEnd

    connector.subscribe()

    return {
        controller: controller,
        cleanup: connector.unsubscribe
    }
}