import styled from "styled-components";
import {GameHistoryEntry} from "../../game/game_history_state/GameHistoryState";
import {HistoryEntry} from "../game/control_panel/history_panel/HistoryEntry";
import {CSSProperties, ReactNode, useEffect, useRef, useState} from "react";
import {useGameContext} from "../../game/GameContext";
import {Color, oppositeColor} from "../../common/color";
import {backgammonRuleSet} from "../../game/game_rule/backgammon/RuleSet";
import {nardeRuleSet} from "../../game/game_rule/narde/RuleSet";
import {backgammonRemoteSetV1} from "../../game/game_rule/backgammon/remote_v1/RemoteSet";
import {nardeRemoteSetV1} from "../../game/game_rule/narde/remote_v1/RemoteSet";
import {mapHistory} from "../../game/game_controller/remote/factory";
import {BoardSynchronizer} from "../../game/board/BoardSynchronizer";
import {makeDice} from "../../game/dice_state/DiceStatus";
import {mergeMoves} from "../../game/board/move";
import {GameChoice} from "./GameChoice";
import {AnimateEllipsis} from "../play_menu/control_panel/RemoteGameTab";
import {NormalHistoryTab} from "../game/control_panel/history_panel/HistoryTab";

const Alert = ({src, message}: { src: string, message: string }) => (
    <>
        <div>
            <img src={src} title={message} alt={message}/>
        </div>
        <span>{message}</span>
    </>
)

type MoveAlert = "Best Move" | "Doubtful Move" | "Mistake" | "Blunder" | null
type RollAlert = "Very Lucky" | "Lucky" | "Unlucky" | "Very Unlucky" | null
type CubeAlert = "Missed Double" | "Wrong Double" | null

const PlainAlertsTab = ({className, moveAlert, rollAlert, cubeAlert}: {
    className?: string,
    moveAlert: MoveAlert,
    rollAlert: RollAlert,
    cubeAlert: CubeAlert
}) => {
    const noAlertStyle = {
        color: "#bebdc0",
        fontWeight: 400
    } satisfies CSSProperties

    const moveAlertC =
        moveAlert === "Best Move" ? <Alert src={"/best_move.svg"} message={"Лучший ход"}/> :
            moveAlert === "Doubtful Move" ? <Alert src={"/questionable_move.svg"} message={"Сомнительный ход"}/> :
                moveAlert === "Mistake" ? <Alert src={"/mistake.svg"} message={"Ошибка"}/> :
                    moveAlert === "Blunder" ? <Alert src={"/blunder.svg"} message={"Грубая ошибка"}/> :
                        <>
                            <div><img src={"/empty_alert.svg"} alt={""}/></div>
                            <div><span style={noAlertStyle}>Оценка хода</span></div>
                        </>

    const rollAlertC =
        rollAlert === "Very Lucky" ? <Alert src={"/best_luck.svg"} message={"Очень удачный бросок"}/> :
            rollAlert === "Lucky" ? <Alert src={"/good_luck.svg"} message={"Удачный бросок"}/> :
                rollAlert === "Unlucky" ? <Alert src={"/bad_luck.svg"} message={"Неудачный бросок"}/> :
                    rollAlert === "Very Unlucky" ?
                        <Alert src={"/horrible_luck.svg"} message={"Очень неудачный бросок"}/> :
                        <>
                            <div><img src={"/empty_alert.svg"} alt={""}/></div>
                            <div><span style={noAlertStyle}>Оценка броска</span></div>
                        </>

    const cubeAlertC =
        cubeAlert === "Wrong Double" ? <Alert src={"/wrong_cube.svg"} message={"Неправильный куб"}/> :
            cubeAlert === "Missed Double" ?
                <Alert src={"/wrong_cube.svg"} message={"Упущена возможность предложить куб"}/> :
                <>
                    <div><img src={"/empty_alert.svg"} alt={""}/></div>
                    <div><span style={noAlertStyle}>Оценка куба удвоения</span></div>
                </>


    return (
        <div className={className}>
            {moveAlertC}
            {rollAlertC}
            {cubeAlertC}
        </div>
    )
}

const AlertsTab = styled(PlainAlertsTab)`
    display: grid;
    grid-template-columns: 40px 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-row-gap: 10px;
    grid-column-gap: 10px;
    margin-left: 10px;
    margin-top: 5px;
    font-weight: 600;

    > * {
        display: flex;
        align-items: center;

        img {
            width: 100%;
        }
    }
`


const PlainHoverHistoryEntry = ({className, entry, altBg, index, onChange}: {
    className?: string,
    entry: GameHistoryEntry,
    altBg: boolean,
    index: number,
    onChange: (i: number) => void
}) => {
    const additionalStyle = entry.type === "game_end" ? {
        gridColumn: "span 3"
    } : {gridColumn: "span 1"}

    return (
        <div className={className} style={additionalStyle} onClick={() => onChange(index)}>
            <HistoryEntry entry={entry} altBg={altBg}/>
        </div>
    )
}

type ProbabilityStatistics = {
    whiteWin: number,
    whiteGammon: number,
    whiteBackgammon: number,
    blackWin: number,
    blackGammon: number,
    blackBackgammon: number,
    expectedWin: number
}

function getProbabilityString(p: ProbabilityStatistics) {
    return `${p.whiteWin}/${p.whiteGammon}/${p.whiteBackgammon} - ${p.blackWin}/${p.blackGammon}/${p.blackBackgammon}`
}

type MoveStatistics = {
    pipCount?: [number, number],
    probabilities?: ProbabilityStatistics,
    moves?: ({
        move: string,
        probabilities: ProbabilityStatistics
    })[],
    cubeAnalysis?: {
        doubleTake: number,
        doublePass: number,
        noDouble?: number
    }
}

function parseProbabilityString(s: string, player: Color): Omit<ProbabilityStatistics, "expectedWin"> {
    const split = s.split(" ")
    return {
        whiteWin: player === Color.WHITE ? parseFloat(split[0]) : parseFloat(split[4]),
        whiteGammon: player === Color.WHITE ? parseFloat(split[1]) : parseFloat(split[5]),
        whiteBackgammon: player === Color.WHITE ? parseFloat(split[2]) : parseFloat(split[6]),
        blackWin: player === Color.WHITE ? parseFloat(split[4]) : parseFloat(split[0]),
        blackGammon: player === Color.WHITE ? parseFloat(split[5]) : parseFloat(split[1]),
        blackBackgammon: player === Color.WHITE ? parseFloat(split[6]) : parseFloat(split[2])
    }
}

function getMoveStatistics(move: ReturnType<JSON["parse"]>, player: Color): Omit<MoveStatistics, "pipCount"> {
    let movesPart: MoveStatistics["moves"]
    let performedMove: MoveStatistics["probabilities"] = undefined
    if (move.best_moves === undefined || move.best_moves.length === 0) {
        movesPart = undefined
    } else {
        movesPart = []
        for (const m of move.best_moves) {
            const [moveString, equity, probString] = m.split(";")
            const probs = {
                expectedWin: parseFloat(equity) * (player === Color.WHITE ? 1: -1),
                ...parseProbabilityString(probString, player)
            }
            movesPart.push({
                move: moveString,
                probabilities: probs
            })
            if (moveString.startsWith("*")) {
                performedMove = probs
            }
        }
    }

    let cubePart: MoveStatistics["cubeAnalysis"]
    if (move.cube === undefined || move.cube.length === 0) {
        cubePart = undefined
    } else {
        const partialCubePart: Partial<MoveStatistics["cubeAnalysis"]> = {}
        for (const s of move.cube) {
            const [key, value] = s.split(";")
            if (key.includes('No')) {
                partialCubePart.noDouble = parseFloat(value)
            } else if (key.includes('pass')) {
                partialCubePart.doublePass = parseFloat(value)
            } else {
                partialCubePart.doubleTake = parseFloat(value)
            }
        }
        cubePart = partialCubePart as MoveStatistics["cubeAnalysis"]
    }

    return {
        moves: movesPart,
        cubeAnalysis: cubePart,
        probabilities: performedMove
    }
}

function getPipCount(move: ReturnType<JSON["parse"]>): [number, number] {
    return [move.pip_counts.white, move.pip_counts.black]
}

const PlainStatsTab = ({className, moveStats}: { className?: string, moveStats: MoveStatistics }) => {
    let bestMoves: ReactNode

    if (moveStats.moves === undefined) {
        bestMoves = <></>
    } else {
        const moves: ReactNode[] = []
        for (const [i, move] of moveStats.moves.entries()) {
            moves.push(<p key={i} style={{marginBottom: 3}}>{move.move}. Ожидаемый выигрыш: {move.probabilities.expectedWin}.
                Вероятности: {getProbabilityString(move.probabilities)}</p>)
        }
        bestMoves =
            <>
                <p>Сравнение с лучшими ходами:</p>
                <div>
                    {moves}
                </div>
            </>
    }

    let doubleStats: ReactNode
    if (moveStats.cubeAnalysis === undefined) {
        doubleStats = <></>
    } else {
        doubleStats =
            <>
                <p>Куб удвоения:</p>
                <p>Принять куб удвоения: {moveStats.cubeAnalysis.doubleTake}</p>
                <p>Отказаться от куба удвоения: {moveStats.cubeAnalysis.doublePass}</p>
                {moveStats.cubeAnalysis.noDouble !== undefined &&
                    <p>Без куба удвоения: {moveStats.cubeAnalysis.noDouble}</p>}
            </>
    }

    let probs: ReactNode
    if (moveStats.probabilities === undefined) {
        probs = <></>
    } else {
        probs =
            <>
                <p>Ожидаемый выигрыш: {moveStats.probabilities.expectedWin}</p>
                <p>Вероятности:</p>
                <div>
                    <p>Победы белых: {moveStats.probabilities.whiteWin}</p>
                    <p>Победы белых (марс): {moveStats.probabilities.whiteGammon}</p>
                    <p>Победы белых (кокс): {moveStats.probabilities.whiteBackgammon}</p>
                    <p>Победы черных: {moveStats.probabilities.blackWin}</p>
                    <p>Победы черных (марс): {moveStats.probabilities.blackGammon}</p>
                    <p>Победы черных (кокс): {moveStats.probabilities.blackBackgammon}</p>
                </div>
            </>
    }

    let pips: ReactNode
    if (moveStats.pipCount === undefined) {
        pips = <></>
    } else {
        pips =
            <>
                <p>Pip:</p>
                <div>
                    <p>Белые: {moveStats.pipCount[0]}</p>
                    <p>Черные: {moveStats.pipCount[1]}</p>
                </div>
            </>
    }


    return (
        <div className={className}>
            <section>
                {pips}
            </section>
            <section>
                {probs}
            </section>
            <section>
                {bestMoves}
            </section>
            <section>
                {doubleStats}
            </section>
        </div>
    )
}

const StatsTab = styled(PlainStatsTab)`
    margin-left: 5px;
    font-size: 12px;

    p {
        margin-top: 0;
        margin-bottom: 0;
    }

    div {
        margin-left: 5px;
    }

    section {
        margin-bottom: 5px;
    }
`


const HoverHistoryEntry = styled(PlainHoverHistoryEntry)<{ index: number, getChosen: () => number }>`
    &:hover > * {
        background-color: #eeeeee;
    }

    & > * {
        ${({index, getChosen}) => getChosen() === index ? "background-color: #eeeeee;" : ""};
        height: 100%;
    }
`
type Argument<F> = F extends (p: infer A) => unknown ? A : never
const PlainAnalysisPanel = ({className, remoteHistory, analysis}: {
    className?: string,
    remoteHistory: ReturnType<JSON["parse"]>,
    analysis: undefined | null | ReturnType<JSON["parse"]>
}) => {
    const [chosenGame, setChosenGame] = useState(0)
    const [chosenMove, setChosenMove] = useState<number>(-1)
    const gameHistoryState = useGameContext("gameHistoryState")
    const boardState = useGameContext("boardState")
    const doubleCubeState = useGameContext("doubleCubeState")
    const diceState = useGameContext("diceState")
    const labelState = useGameContext("labelState")
    const entries = useRef<GameHistoryEntry[]>([])
    const firstToMove = useRef<Color>(Color.WHITE)

    const [moveAlert, setMoveAlert] = useState<MoveAlert>(null)
    const [rollAlert, setRollAlert] = useState<RollAlert>(null)
    const [cubeAlert, setCubeAlert] = useState<CubeAlert>(null)
    const [player, setPlayer] = useState(Color.WHITE)

    const HistoryEntryC = (props: Omit<Argument<typeof HoverHistoryEntry>, "onChange" | "getChosen">) => {
        if (props.entry.type === "game_end") {
            return <HistoryEntry {...props} />
        }
        return <HoverHistoryEntry onChange={setChosenMove} getChosen={() => chosenMove} {...props}/>
    }


    useEffect(() => {
        const type = remoteHistory[0].type
        const ruleSet = type === "SHORT_BACKGAMMON" ? backgammonRuleSet : nardeRuleSet

        const remoteMoveMapper = type === "SHORT_BACKGAMMON" ? backgammonRemoteSetV1.remoteMoveMapper : nardeRemoteSetV1.remoteMoveMapper
        const [entries_, firstToMove_] = mapHistory(ruleSet.historyEncoder, remoteMoveMapper, remoteHistory[chosenGame])
        entries.current = entries_
        firstToMove.current = firstToMove_
        doubleCubeState.positionMapper = ruleSet.doubleCubePositionMapperFactory(Color.WHITE)
        labelState.labelMapper = ruleSet.labelMapperFactory(Color.WHITE)
    }, [chosenGame, doubleCubeState, labelState, remoteHistory]);

    useEffect(() => {
        const type = remoteHistory[0].type
        const historyEncoder = type === "SHORT_BACKGAMMON" ? backgammonRuleSet.historyEncoder : nardeRuleSet.historyEncoder
        const remoteMoveMapper = type === "SHORT_BACKGAMMON" ? backgammonRemoteSetV1.remoteMoveMapper : nardeRemoteSetV1.remoteMoveMapper
        const [entries, firstToMove] = mapHistory(historyEncoder, remoteMoveMapper, remoteHistory[chosenGame])
        gameHistoryState.clear()
        gameHistoryState.currentGame = {firstToMove: firstToMove}
        entries.forEach(e => gameHistoryState.add(e))

    }, [chosenGame, gameHistoryState, remoteHistory])

    useEffect(() => {
        const type = remoteHistory[0].type
        const ruleSet = type === "SHORT_BACKGAMMON" ? backgammonRuleSet : nardeRuleSet
        const remoteSet = type === "SHORT_BACKGAMMON" ? backgammonRemoteSetV1 : nardeRemoteSetV1
        const initialPosition = ruleSet.initPlacement
        setCubeAlert(null)
        setMoveAlert(null)
        setRollAlert(null)

        let cubeAvailable
        if (remoteHistory[chosenGame].thresholdPoints === 1) {
            cubeAvailable = false
        } else if (chosenGame === 0) {
            cubeAvailable = true
        } else {
            const lastGame = remoteHistory[chosenGame - 1]
            const lastGameItems = lastGame.items
            const lastGameEnd = lastGameItems[lastGameItems.length - 1]
            cubeAvailable = !((lastGameEnd.white === lastGame.thresholdPoints - 1 && lastGameEnd.winner === "WHITE") ||
                (lastGameEnd.black === lastGame.thresholdPoints - 1 && lastGameEnd.winner === "BLACK"));
        }
        doubleCubeState.state = cubeAvailable ? "free" : "unavailable"
        doubleCubeState.value = cubeAvailable ? 64 : undefined

        const boardSynchronizer = new BoardSynchronizer(boardState, initialPosition(), ruleSet.indexMapperFactory(Color.WHITE), ruleSet.propMapper)
        let currentPlayer = firstToMove.current
        for (const [i, entry] of entries.current.entries()) {
            if (i > chosenMove) {
                break
            }
            if (i === chosenMove) {
                if (entries.current[chosenMove].type === "move") {
                    diceState.dice1 = makeDice(entries.current[chosenMove].dice[0], currentPlayer)
                    diceState.dice2 = makeDice(entries.current[chosenMove].dice[1], currentPlayer)
                } else {
                    diceState.dice1 = null
                    diceState.dice2 = null
                }
                setPlayer(currentPlayer)
                labelState.color = currentPlayer

                const alerts = analysis.games[chosenGame].items[chosenMove].alerts
                if (alerts !== undefined) {
                    for (const alert of alerts) {
                        if (alert.startsWith("doubtful move")) {
                            setMoveAlert("Doubtful Move")
                        } else if (alert.startsWith("bad move")) {
                            setMoveAlert("Mistake")
                        } else if (alert.startsWith("very bad move")) {
                            setMoveAlert("Blunder")
                        } else if (alert.startsWith("very lucky")) {
                            setRollAlert("Very Lucky")
                        } else if (alert.startsWith("lucky")) {
                            setRollAlert("Lucky")
                        } else if (alert.startsWith("unlucky")) {
                            setRollAlert("Unlucky")
                        } else if (alert.startsWith("very unlucky")) {
                            setRollAlert("Very Unlucky")
                        } else if (alert.startsWith("missed")) {
                            setCubeAlert("Missed Double")
                        } else if (alert.startsWith("wrong")) {
                            setCubeAlert("Wrong Double")
                        }
                    }
                }
                const moves = analysis.games[chosenGame].items[chosenMove].best_moves
                if (moves !== undefined && moves.length > 0 && moves[0].startsWith("*")) {
                    setMoveAlert("Best Move")
                }
            }
            if (entry.type === "move") {
                // @ts-expect-error working with responses
                const moves = remoteHistory[chosenGame].items[i].moves.map((m) => remoteSet.remoteMoveMapper.fromRemote(m))
                const mergedMoves = mergeMoves(moves)
                for (const move of mergedMoves) {
                    // @ts-expect-error working with responses
                    boardSynchronizer.performMoveLogical(move)
                }
                if (i !== chosenMove) {
                    boardState.eraseFrom()
                }
            } else if (entry.type === "offer_double") {
                doubleCubeState.value = entry.newValue
                if (currentPlayer === Color.WHITE) {
                    doubleCubeState.state = "offered_to_black"
                } else {
                    doubleCubeState.state = "offered_to_white"
                }
            } else if (entry.type === "accept_double") {
                if (currentPlayer === Color.WHITE) {
                    doubleCubeState.state = "belongs_to_white"
                } else {
                    doubleCubeState.state = "belongs_to_black"
                }
            }
            currentPlayer = oppositeColor(currentPlayer)

        }
        if (chosenMove === -1) {
            diceState.dice1 = null
            diceState.dice2 = null
            labelState.color = undefined
        }
    }, [analysis, boardState, chosenGame, chosenMove, diceState, doubleCubeState, labelState, remoteHistory])

    const lastMove = remoteHistory[chosenGame].items.length - 2

    const analysisItem = analysis?.games?.[chosenGame]?.items?.[chosenMove]
    const nextAnalysisItem = analysis?.games?.[chosenGame]?.items?.[chosenMove + 1]


    return (
        <div className={className}>
            <GameChoice boundary={remoteHistory.length} onChange={(i) => {
                setChosenGame(i)
                setChosenMove(-1)
            }}/>
            <div>
                {
                    analysis === undefined ? <AnimateEllipsis>Загружаем анализ</AnimateEllipsis> :
                        analysis === null ? <p>Не удалось загрузить анализ</p> :
                            <AlertsTab rollAlert={rollAlert} cubeAlert={cubeAlert} moveAlert={moveAlert}/>
                }
            </div>
            <div>
                <NormalHistoryTab historyEntryComponent={HistoryEntryC}/>
            </div>
            <div>
                <button type={"button"} onClick={() => setChosenMove(-1)} disabled={chosenMove === -1}>{"<<"}</button>
                <button type={"button"} onClick={() => setChosenMove(chosenMove - 1)}
                        disabled={chosenMove === -1}>{"<"}</button>
                <button type={"button"} onClick={() => setChosenMove(chosenMove + 1)}
                        disabled={chosenMove === lastMove}>{">"}</button>
                <button type={"button"} onClick={() => setChosenMove(lastMove)}
                        disabled={chosenMove === lastMove}>{">>"}</button>
            </div>
            <div>
                {
                    analysis === undefined ? <AnimateEllipsis>Загружаем анализ</AnimateEllipsis> :
                        analysis === null ? <p>Не удалось загрузить анализ</p> :
                            analysisItem !== undefined ? <StatsTab moveStats={{
                                    ...getMoveStatistics(analysis.games[chosenGame].items[chosenMove], player),
                                    pipCount: nextAnalysisItem === undefined ? undefined : getPipCount(nextAnalysisItem)
                                }}/> : <></>
                }
            </div>
        </div>
    )
}
export const AnalysisPanel = styled(PlainAnalysisPanel)`
    & {
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: stretch;

        > :nth-child(1) {
            height: 40px;
        }

        > :nth-child(2) {
            height: 150px;
            background-color: white;
        }

        > :nth-child(3) {
            flex: 1;
            overflow-y: auto;
            scrollbar-width: none;
            color: black;
            min-height: 0;
        }

        > :nth-child(4) {
            display: flex;

            > * {
                flex: 1;
            }
        }

        > :nth-child(5) {
            height: 130px;
            background-color: white;
            overflow-y: auto;
        }

    }
`