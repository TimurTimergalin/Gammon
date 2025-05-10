import styled from "styled-components";
import GameView from "../game/GameView";
import {NormalTimer} from "../game/timer/Timer";
import {GameContextHolder} from "../game/GameContextHolder";
import {NormalHistoryTab} from "../game/control_panel/history_panel/HistoryTab";
import {HistoryEntry} from "../game/control_panel/history_panel/HistoryEntry";
import {ReactNode, useEffect, useRef, useState} from "react";
import {useGameContext} from "../../game/GameContext";
import {backgammonRuleSet} from "../../game/game_rule/backgammon/RuleSet";
import {nardeRuleSet} from "../../game/game_rule/narde/RuleSet";
import {backgammonRemoteSetV1} from "../../game/game_rule/backgammon/remote_v1/RemoteSet";
import {nardeRemoteSetV1} from "../../game/game_rule/narde/remote_v1/RemoteSet";
import {mapHistory} from "../../game/game_controller/remote/factory";
import {GameHistoryEntry} from "../../game/game_history_state/GameHistoryState";
import {Color, oppositeColor} from "../../common/color";
import {BoardSynchronizer} from "../../game/board/BoardSynchronizer";
import {mergeMoves} from "../../game/board/move";
import {makeDice} from "../../game/dice_state/DiceStatus";
import {AnimateEllipsis} from "../play_menu/control_panel/RemoteGameTab";
import {mapRemoteColor} from "../../game/game_rule/common_remote/common";


const PlainOption = ({onChoose, text, className}: { onChoose: () => void, text: string, className?: string }) => {
    return (
        <div onClick={onChoose} className={className}>{text}</div>
    )
}

const Option = styled(PlainOption)<{ chosen: boolean }>`
    color: black;
    background-color: ${({chosen}) => chosen ? "white" : "#bbb"};
`


const PlainGameChoice = ({className, onChange, boundary}: {
    className?: string,
    onChange: (i: number) => void,
    boundary: number
}) => {
    const [chosen, setChosen] = useState(0)

    const reduce = () => {
        onChange(chosen - 1)
        setChosen(chosen - 1)
    }

    const increase = () => {
        onChange(chosen + 1)
        setChosen(chosen + 1)
    }

    return (
        <div className={className}>
            <button onClick={reduce} type={"button"} disabled={chosen === 0}>{"<"}</button>
            <span>Игра {chosen + 1}</span>
            <button onClick={increase} type={"button"} disabled={chosen >= boundary - 1}>{">"}</button>
        </div>
    )
}

const GameChoice = styled(PlainGameChoice)`
    display: flex;
    color: black;

    > * {
        flex: 1;
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
    const entries = useRef<GameHistoryEntry[]>([])
    const firstToMove = useRef<Color>(Color.WHITE)

    const HistoryEntryC = (props: Omit<Argument<typeof HoverHistoryEntry>, "onChange" | "getChosen">) =>
        <HoverHistoryEntry onChange={setChosenMove} getChosen={() => chosenMove} {...props}/>

    useEffect(() => {
        const type = remoteHistory[0].type
        const ruleSet = type === "SHORT_BACKGAMMON" ? backgammonRuleSet : nardeRuleSet

        const remoteMoveMapper = type === "SHORT_BACKGAMMON" ? backgammonRemoteSetV1.remoteMoveMapper : nardeRemoteSetV1.remoteMoveMapper
        const [entries_, firstToMove_] = mapHistory(ruleSet.historyEncoder, remoteMoveMapper, remoteHistory[chosenGame])
        entries.current = entries_
        firstToMove.current = firstToMove_
        doubleCubeState.positionMapper = ruleSet.doubleCubePositionMapperFactory(Color.WHITE)
    }, [chosenGame, doubleCubeState, remoteHistory]);

    useEffect(() => {
        const type = remoteHistory[0].type
        const historyEncoder = type === "SHORT_BACKGAMMON" ? backgammonRuleSet.historyEncoder : nardeRuleSet.historyEncoder
        const remoteMoveMapper = type === "SHORT_BACKGAMMON" ? backgammonRemoteSetV1.remoteMoveMapper : nardeRemoteSetV1.remoteMoveMapper
        const [entries, firstToMove] = mapHistory(historyEncoder, remoteMoveMapper, remoteHistory[chosenGame])
        gameHistoryState.clear()
        gameHistoryState.currentGame = {firstToMove: firstToMove}
        entries.forEach(e => gameHistoryState.add(e))

        console.log("Remote history")
    }, [chosenGame, gameHistoryState, remoteHistory])

    useEffect(() => {
        const type = remoteHistory[0].type
        const ruleSet = type === "SHORT_BACKGAMMON" ? backgammonRuleSet : nardeRuleSet
        const remoteSet = type === "SHORT_BACKGAMMON" ? backgammonRemoteSetV1 : nardeRemoteSetV1
        const initialPosition = ruleSet.initPlacement

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
    }, [boardState, chosenGame, chosenMove, diceState, doubleCubeState, remoteHistory])

    const lastMove = remoteHistory[chosenGame].items.length - 2
    console.log(lastMove)

    return (
        <div className={className}>
            <GameChoice boundary={remoteHistory.length} onChange={(i) => {
                setChosenGame(i)
                setChosenMove(-1)
            }}/>
            <div>
                {
                    analysis === undefined ? <AnimateEllipsis>Загружаем анализ</AnimateEllipsis> :
                        analysis === null ? <p>Не удалось загрузить анализ</p> : <p>Здесь будут сообщения</p>
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
                        analysis === null ? <p>Не удалось загрузить анализ</p> : <p>Здесь будут цифры</p>
                }
            </div>
        </div>
    )
}

const AnalysisPanel = styled(PlainAnalysisPanel)`
    & {
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: stretch;

        > :nth-child(1) {
            height: 40px;
        }

        > :nth-child(2) {
            height: 130px;
            background-color: #666;
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
            background-color: #666;
        }

    }
`

const PlainSummaryTable = ({className, children}: { className?: string, children?: ReactNode | ReactNode[] }) => {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

const SummaryTable = styled(PlainSummaryTable)`
    display: grid;
    grid-template-columns: 100px 40px 100px;
    grid-row-gap: 5px;
    margin-bottom: 10px;

    > * {
        display: flex;
        justify-content: center;
        align-items: center;
        img {
            width: 100%;
        }
    }
`

type Overall = {
    bestMoves: [number, number],
    doubtfulMoves: [number, number],
    mistakes: [number, number],
    blunders: [number, number],
    veryLucky: [number, number],
    lucky: [number, number],
    unlucky: [number, number],
    veryUnlucky: [number, number],
    wrongCubeDecisions: [number, number],
}

const SummaryTableRow = ({values: [left, right], src, title}: {
    values: [number, number],
    src: string,
    title: string
}) => {
    return (
        <>
            <span>{left}</span>
            <div>
                <img src={src} title={title} alt={title}/>
            </div>
            <span>{right}</span>
        </>
    )
}

const PlainSummaryContent = ({className, overall}: { className?: string, overall: Overall }) => {
    return (
        <div className={className}>
            <p>Статистика по ходам</p>
            <SummaryTable>
                <SummaryTableRow values={overall.bestMoves} src={"/best_move.svg"} title={"Лучший ход"}/>
                <SummaryTableRow values={overall.doubtfulMoves} src={"/questionable_move.svg"}
                                 title={"Сомнительный ход"}/>
                <SummaryTableRow values={overall.mistakes} src={"/mistake.svg"} title={"Ошибка"}/>
                <SummaryTableRow values={overall.blunders} src={"/blunder.svg"} title={"Грубая ошибка"}/>
            </SummaryTable>
            <p>Статистика по броскам</p>
            <SummaryTable>
                <SummaryTableRow values={overall.veryLucky} src={"/best_luck.svg"} title={"Очень удачный бросок"}/>
                <SummaryTableRow values={overall.lucky} src={"/good_luck.svg"} title={"Удачный бросок"}/>
                <SummaryTableRow values={overall.unlucky} src={"/bad_luck.svg"} title={"Неудачный бросок"}/>
                <SummaryTableRow values={overall.veryUnlucky} src={"/horrible_luck.svg"}
                                 title={"Очень неудачный бросок"}/>
            </SummaryTable>
            <p>Статистика по кубам удвоения</p>
            <SummaryTable>
                <SummaryTableRow values={overall.wrongCubeDecisions} src={"/wrong_cube.svg"}
                                 title={"Неудачное решение"}/>
            </SummaryTable>
        </div>
    )
}

function calculateBestMoves(analysis: ReturnType<JSON["parse"]>, firstToMove: Color[]): [number, number] {
    const res = {
        [Color.WHITE]: 0,
        [Color.BLACK]: 0
    }
    for (const [i, game] of analysis.games.entries()) {
        let currentPlayer = firstToMove[i]
        for (const item of game.items) {
            if (item.best_moves !== undefined && item.best_moves.length > 0 && item.best_moves[0].startsWith("*")) {
                res[currentPlayer] += 1
            }
            currentPlayer = oppositeColor(currentPlayer)
        }
    }
    return [res[Color.WHITE], res[Color.BLACK]]
}

function calculateWrongCubeDecisions(analysis: ReturnType<JSON["parse"]>): [number, number] {
    const res = [0, 0]
    for (const i of [0, 1]) {
        for (const field of [
            "Wrong doubles above TG (EMG (MWC))",
            "Wrong doubles below DP (EMG (MWC))",
            "Wrong passes (EMG (MWC))",
            "Wrong takes (EMG (MWC))"
        ]) {
            res[i] += analysis.overall[field][i]
        }
    }

    return res as [number, number]
}

export const SummaryContent = styled(PlainSummaryContent)`
    & {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        align-items: center;
        min-height: 0;

        > p {
            margin-bottom: 20px;
            margin-top: 20px;
        }
    }
`

const PlainSummaryPanel = ({className, analysis, remoteHistory}: {
    className?: string,
    analysis: undefined | null | ReturnType<JSON["parse"]>,
    remoteHistory: ReturnType<JSON["parse"]>
}) => {
    let content

    if (analysis === undefined) {
        content = <AnimateEllipsis>Загружаем анализ</AnimateEllipsis>
    } else if (analysis === null) {
        content = <p>Не удалось загрузить анализ</p>
    } else {
        // @ts-expect-error working with responses
        const bestMoves = calculateBestMoves(analysis, remoteHistory.map(o => o.firstToMove).map(mapRemoteColor))
        console.log(bestMoves)
        content = (
            <SummaryContent overall={{
                bestMoves: bestMoves,
                doubtfulMoves: analysis.overall["Moves marked doubtful"],
                mistakes: analysis.overall["Moves marked bad"],
                blunders: analysis.overall["Moves marked very bad"],
                veryLucky: analysis.overall["Rolls marked very lucky"],
                lucky: analysis.overall["Rolls marked lucky"],
                unlucky: analysis.overall["Rolls marked unlucky"],
                veryUnlucky: analysis.overall["Rolls marked very unlucky"],
                wrongCubeDecisions: calculateWrongCubeDecisions(analysis)
            }} />
        )
    }


    return (
        <div className={className}>
            {content}
        </div>
    )
}

const SummaryPanel = styled(PlainSummaryPanel)`
    background-color: white;
`

const PlainSidePanel = ({className, remoteHistory, analysis}: {
    className?: string,
    remoteHistory: ReturnType<JSON["parse"]>,
    analysis: undefined | null | ReturnType<JSON["parse"]>
}) => {
    const [chosenTab, setChosenTab] = useState(0)


    return (
        <div className={className}>
            <div>
                <Option onChoose={() => setChosenTab(0)} text={"Отчет"} chosen={chosenTab === 0}/>
                <Option onChoose={() => setChosenTab(1)} text={"Анализ"} chosen={chosenTab === 1}/>
            </div>
            {chosenTab === 0 && <SummaryPanel analysis={analysis} remoteHistory={remoteHistory}/>}
            {chosenTab === 1 && <AnalysisPanel remoteHistory={remoteHistory} analysis={analysis}/>}
        </div>
    )
}

const SidePanel = styled(PlainSidePanel)`
    & {
        display: flex;
        flex-direction: column;
        color: black;

        > :nth-child(1) {
            display: flex;
            height: 40px;
            align-items: stretch;

            > ${Option} {
                flex: 1;
            }
        }

        > :nth-child(2) {
            flex: 1;
            min-height: 0;
            >${SummaryContent} {
                height: 100%;
            }
        }
    }
`

const PlainHistoryPage = ({className, remoteHistory, analysis}: {
    className?: string,
    remoteHistory: ReturnType<JSON["parse"]>,
    analysis: undefined | null | ReturnType<JSON["parse"]>
}) => {

    return (
        <div className={className}>
            <GameContextHolder>
                <div>
                    <div>
                        <div>
                            <GameView/>
                        </div>
                        <div>
                            <NormalTimer index={0}/>
                            <NormalTimer index={1}/>
                        </div>
                    </div>
                    <span/>
                    <SidePanel remoteHistory={remoteHistory} analysis={analysis}/>
                </div>
            </GameContextHolder>

        </div>
    )
}

export const HistoryPage = styled(PlainHistoryPage)`
    & {
        flex: 1;
        align-self: stretch;
        display: flex;
        overflow-y: auto;

        > div {
            flex: 1;
            width: 100%;
            align-self: stretch;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-wrap: wrap;

            > :nth-child(1) {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                flex: 10;
                min-width: 350px;
                margin-left: 30px;

                > div:nth-child(1) {
                    flex: 1;
                }

                > div:nth-child(2) {
                    display: flex;
                    justify-content: space-evenly;
                }
            }

            > ${SidePanel} {
                width: 320px;
                height: 600px;
                margin-right: 30px;
                margin-top: 40px;
            }

            > span {
                flex: 1;
                min-width: 30px;
            }
        }
    }
`