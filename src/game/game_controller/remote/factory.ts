import {backgammonHistory as getRemoteHistory, getBackgammonConfig} from "../../../requests/requests";
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
import {TimerManager} from "../TimerManager";
import {useRevalidator} from "react-router";


type RemoteGameType = "SHORT_BACKGAMMON" | "REGULAR_GAMMON"


async function getConfig(fetch: FetchType, roomId: number): Promise<[ReturnType<JSON['parse']>, RemoteGameType]> {
    const resp = await getBackgammonConfig(fetch, roomId)
    const config = await resp.json()
    return [config, config.gameData.type]
}

export function mapHistory<RemoteMove, Index>(
    historyEncoder: HistoryEncoder<Index>,
    remoteMoveMapper: RemoteMoveMapper<RemoteMove, Index>,
    remoteHistory: ReturnType<JSON["parse"]>
): [GameHistoryEntry[], Color] {
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

async function getHistory<RemoteMove, Index>(
    roomId: number,
    fetch: FetchType,
    historyEncoder: HistoryEncoder<Index>,
    remoteMoveMapper: RemoteMoveMapper<RemoteMove, Index>
): Promise<[GameHistoryEntry[], Color]> {
    const remoteHistory = await (await getRemoteHistory(fetch, roomId)).json()

    return mapHistory(historyEncoder, remoteMoveMapper, remoteHistory)
}

async function remoteGameInitInner<RemoteConfig, Index, Prop, RemoteMove>(
    {remoteSet, ruleSet, roomId, gameContext, fetch, remoteConfig, history, revalidator}: {
        remoteSet: RemoteSet<RemoteConfig, Index, Prop, RemoteMove>,
        ruleSet: RuleSet<Index, Prop>,
        roomId: number,
        gameContext: GameContext,
        fetch: FetchType,
        remoteConfig: RemoteConfig,
        history: [GameHistoryEntry[], Color],
        revalidator: ReturnType<typeof useRevalidator>
    }
) {
    const [historyEntries, firstToMove] = history

    const config = remoteSet.configParser.mapConfig(remoteConfig)
    console.log(config.userPlayer)

    gameContext.gameHistoryState.clear()
    gameContext.gameHistoryState.currentGame = {firstToMove: firstToMove}
    historyEntries.forEach(e => gameContext.gameHistoryState.add(e))

    const indexMapper = ruleSet.indexMapperFactory(config.userPlayer ?? Color.WHITE)

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

    const timeManager = new TimerManager({
        timerPairState: gameContext.timerPairState,
        timeMs: 0,
        incrementMs: config.time.increment
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
        historyEncoder: ruleSet.historyEncoder,
        dragState: gameContext.dragState,
        timeManager: timeManager,
        revalidator: revalidator
    })

    gameContext.labelState.labelMapper = ruleSet.labelMapperFactory(config.userPlayer ?? Color.WHITE)
    gameContext.gameControllerSetter.set(controller)
    gameContext.doubleCubeState.positionMapper = ruleSet.doubleCubePositionMapperFactory(config.userPlayer ?? Color.WHITE)
    gameContext.timerPairState.timer1.onEnd = () => controller.onTimeout()
    gameContext.timerPairState.timer2.onEnd = () => controller.onTimeout()
    gameContext.timerPairState.timer1.owner = config.userPlayer === null ? Color.BLACK : oppositeColor(config.userPlayer)
    gameContext.timerPairState.timer2.owner = config.userPlayer ?? Color.WHITE

    controller.init(config)

    connector.onMovesMade = controller.onMovesMade
    connector.onNewDice = controller.onNewDice
    connector.onEnd = controller.onEnd
    connector.onOfferDouble = controller.onOfferDouble
    connector.onAcceptDouble = controller.onAcceptDouble
    connector.onUpdateTime = controller.onUpdateTime

    connector.subscribe()

    return {
        cleanup: connector.unsubscribe,
        player1: config.userPlayer !== Color.BLACK ? config.players.white : config.players.black,
        player2: config.userPlayer !== Color.BLACK ? config.players.black : config.players.white,
        spectator: config.userPlayer === null
    }
}

export async function remoteGameInit({roomId, gameContext, fetch, revalidator}: {
    roomId: number,
    gameContext: GameContext,
    fetch: FetchType,
    revalidator: ReturnType<typeof useRevalidator>
}): Promise<{ cleanup: () => void, player1: PlayerState, player2: PlayerState, spectator: boolean }> {
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
        gameContext: gameContext,
        revalidator: revalidator
    })
}
