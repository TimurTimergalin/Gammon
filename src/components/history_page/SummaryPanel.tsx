import {AnimateEllipsis} from "../play_menu/control_panel/RemoteGameTab";
import {mapRemoteColor} from "../../game/game_rule/common_remote/common";
import styled from "styled-components";
import {ReactNode} from "react";
import {Color, oppositeColor} from "../../common/color";

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
            }}/>
        )
    }


    return (
        <div className={className}>
            {content}
        </div>
    )
}
export const SummaryPanel = styled(PlainSummaryPanel)`
    background-color: white;
`