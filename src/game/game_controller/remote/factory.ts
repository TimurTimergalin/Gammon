import {logResponseError} from "../../../requests/util";
import {getConfig} from "../../../requests/requests";
import {RemoteSet} from "../../game_rule/RemoteSet";
import {GameContext} from "../../GameContext";
import {RuleSet} from "../../game_rule/RuleSet";
import {RemoteConnectorImpl} from "./RemoteConnector";
import {RemoteGameController} from "./RemoteGameController";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";
import {FetchType} from "../../../common/requests";

async function getConfigJson(fetch: FetchType, roomId: number) {
    const resp = await getConfig(fetch, roomId)
    logResponseError(resp, "getting config")
    return await resp.json()
}

export async function remoteGameInit<RemoteConfig, Index, Prop, RemoteMove>(
    {remoteSet, ruleSet, roomId, gameContext, fetch}: {
        remoteSet: RemoteSet<RemoteConfig, Index, Prop, RemoteMove>,
        ruleSet: RuleSet<Index, Prop>,
        roomId: number,
        gameContext: GameContext,
        fetch: FetchType
    }
) {
    const configGetter = async (roomId: number) => {
        const remoteConfig = await getConfigJson(fetch, roomId) as RemoteConfig
        return remoteSet.configParser.mapConfig(remoteConfig)
    }

    const config = await configGetter(roomId)

    const indexMapper = ruleSet.indexMapperFactory(config.userPlayer)

    const board = new BoardSynchronizer(
        gameContext.boardState,
        config.placement,
        indexMapper,
        ruleSet.propMapper
    )
    const connector = new RemoteConnectorImpl({
        moveMapper: remoteSet.remoteMoveMapper,
        roomId: roomId,
        configGetter: configGetter,
        fetch: fetch
    })

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
        labelState: gameContext.labelState,
        endWindowState: gameContext.endWindowState,
        boardAnimationSwitch: gameContext.boardAnimationSwitch,
        scoreState: gameContext.scoreState
    })

    controller.init(config)

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