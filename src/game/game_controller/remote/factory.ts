import {backgammonHistory, getBackgammonConfig} from "../../../requests/requests";
import {RemoteSet} from "../../game_rule/RemoteSet";
import {GameContext} from "../../GameContext";
import {RuleSet} from "../../game_rule/RuleSet";
import {RemoteConnectorImpl} from "./RemoteConnector";
import {RemoteGameController} from "./RemoteGameController";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";
import {FetchType} from "../../../common/requests";
import {Color, oppositeColor} from "../../../common/color";
import {remoteHistoryMapper} from "./remoteHistoryMapper";
import {GameHistoryEntry} from "../../game_history_state/GameHistoryState";
import {mapRemoteColor} from "../../game_rule/common_remote/common";
import {HistoryEncoder} from "../../game_rule/HistoryEncoder";
import {RemoteMoveMapper} from "../../game_rule/RemoteMoveMapper";
import {PlayerState} from "../../player_info/PlayerState";
import {backgammonRuleSet} from "../../game_rule/backgammon/RuleSet";
import {nardeRuleSet} from "../../game_rule/narde/RuleSet";
import {backgammonRemoteSetV1} from "../../game_rule/backgammon/remote_v1/RemoteSet";
import {nardeRemoteSetV1} from "../../game_rule/narde/remote_v1/RemoteSet";


type RemoteGameType = "SHORT_BACKGAMMON" | "REGULAR_GAMMON"


async function getConfig(fetch: FetchType, roomId: number): Promise<[ReturnType<JSON['parse']>, RemoteGameType]> {
    const resp = await getBackgammonConfig(fetch, roomId)
    const config = await resp.json()
    return [config, config.gameData.type]
}

async function getHistory<RemoteMove, Index>(
    roomId: number,
    fetch: FetchType,
    historyEncoder: HistoryEncoder<Index>,
    remoteMoveMapper: RemoteMoveMapper<RemoteMove, Index>
): Promise<[GameHistoryEntry[], Color]> {
    const remoteHistory = await (await backgammonHistory(fetch, roomId)).json()
    const res: GameHistoryEntry[] = []
    const firstToMove = mapRemoteColor(remoteHistory.firstToMove)
    let currentPlayer = firstToMove

    for (const entry of remoteHistory.items) {
        res.push(remoteHistoryMapper({
            remoteMoveMapper: remoteMoveMapper,
            historyEncoder: historyEncoder,
            remoteHistoryEntry: entry,
            player: currentPlayer
        }))
        currentPlayer = oppositeColor(currentPlayer)
    }
    return [res, firstToMove]
}

async function remoteGameInitInner<RemoteConfig, Index, Prop, RemoteMove>(
    {remoteSet, ruleSet, roomId, gameContext, fetch, remoteConfig, history}: {
        remoteSet: RemoteSet<RemoteConfig, Index, Prop, RemoteMove>,
        ruleSet: RuleSet<Index, Prop>,
        roomId: number,
        gameContext: GameContext,
        fetch: FetchType,
        remoteConfig: RemoteConfig,
        history: [GameHistoryEntry[], Color]
    }
) {
    const [historyEntries, firstToMove] = history

    const config = remoteSet.configParser.mapConfig(remoteConfig)

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

    const configGetter = async (roomId: number) => {
        const [raw] = await getConfig(fetch, roomId)
        return remoteSet.configParser.mapConfig(
            await remoteSet.configParser.preprocessConfig(fetch, raw)
        )
    }

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

export async function remoteGameInit({roomId, gameContext, fetch}: {
    roomId: number,
    gameContext: GameContext,
    fetch: FetchType
}): Promise<{ cleanup: () => void, player1: PlayerState, player2: PlayerState }> {
    const [raw, gameType] = await getConfig(fetch, roomId)
    console.log(gameType)
    const ruleSet = gameType === "SHORT_BACKGAMMON" ? backgammonRuleSet : nardeRuleSet
    const remoteSet = gameType === "SHORT_BACKGAMMON" ? backgammonRemoteSetV1 : nardeRemoteSetV1
    const [history, config] = await Promise.all([
        getHistory(roomId, fetch, ruleSet.historyEncoder, remoteSet.remoteMoveMapper),
        remoteSet.configParser.preprocessConfig(fetch, raw)
    ])

    return remoteGameInitInner({
        fetch: fetch,
        roomId: roomId,
        remoteConfig: config,
        history: history,
        remoteSet: remoteSet,
        ruleSet: ruleSet,
        gameContext: gameContext
    })
}
