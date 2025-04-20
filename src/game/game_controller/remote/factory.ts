import {logResponseError} from "../../../requests/util";
import {backgammonHistory, getBackgammonConfig} from "../../../requests/requests";
import {RemoteSet} from "../../game_rule/RemoteSet";
import {GameContext} from "../../GameContext";
import {RuleSet} from "../../game_rule/RuleSet";
import {RemoteConnectorImpl} from "./RemoteConnector";
import {RemoteGameController} from "./RemoteGameController";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";
import {FetchType} from "../../../common/requests";
import {Color, oppositeColor} from "../../../common/color";
import {RemoteHistoryEntry, remoteHistoryMapper} from "./remoteHistoryMapper";
import {forceType} from "../../../common/typing";
import {GameHistoryEntry} from "../../game_history_state/GameHistoryState";

async function getConfigJson(fetch: FetchType, roomId: number) {
    const resp = await getBackgammonConfig(fetch, roomId)
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
        const rawRemoteConfig = await getConfigJson(fetch, roomId)
        const remoteConfig = await remoteSet.configParser.preprocessConfig(fetch, rawRemoteConfig)
        return remoteSet.configParser.mapConfig(remoteConfig)
    }

    const historyGetter = async (roomId: number): Promise<[GameHistoryEntry[], Color]> => {
        const remoteHistory = await (await backgammonHistory(fetch, roomId)).json()
        console.log(remoteHistory)
        forceType<{items: RemoteHistoryEntry<RemoteMove>[], firstToMove: "WHITE" | "BLACK"}>(remoteHistory)
        const res: GameHistoryEntry[] = []
        const firstToMove = remoteHistory.firstToMove === "WHITE" ? Color.WHITE : Color.BLACK
        let currentPlayer = firstToMove

        for (const entry of remoteHistory.items) {
            res.push(remoteHistoryMapper({
                remoteMoveMapper: remoteSet.remoteMoveMapper,
                historyEncoder: ruleSet.historyEncoder,
                remoteHistoryEntry: entry,
                player: currentPlayer
            }))
            currentPlayer = oppositeColor(currentPlayer)
        }
        return [res, firstToMove]
    }
    const [config, [historyEntries, firstToMove]] = await Promise.all([configGetter(roomId), historyGetter(roomId)])

    gameContext.gameHistoryState.clear()
    gameContext.gameHistoryState.currentGame = {firstToMove: firstToMove}
    historyEntries.forEach(e => gameContext.gameHistoryState.add(e))

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
        scoreState: gameContext.scoreState,
        doubleCubeState: gameContext.doubleCubeState,
        gameHistoryState: gameContext.gameHistoryState,
        historyEncoder: ruleSet.historyEncoder
    })

    gameContext.labelState.labelMapper = ruleSet.labelMapperFactory(config.userPlayer)
    gameContext.gameControllerSetter.set(controller)
    gameContext.doubleCubeState.positionMapper = ruleSet.doubleCubePositionMapperFactory(config.userPlayer)

    controller.init(config)

    connector.onMovesMade = controller.onMovesMade
    connector.onNewDice = controller.onNewDice
    connector.onEnd = controller.onEnd
    connector.onOfferDouble = controller.onOfferDouble
    connector.onAcceptDouble = controller.onAcceptDouble

    connector.subscribe()

    return {
        cleanup: connector.unsubscribe,
        player1: config.userPlayer === Color.WHITE ? config.players.white : config.players.black,
        player2: config.userPlayer === Color.WHITE ? config.players.black : config.players.white
    }
}