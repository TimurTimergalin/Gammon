import styled from "styled-components";
import {observer} from "mobx-react-lite";
import {FunctionComponent, ReactNode, useEffect, useRef} from "react";
import {useGameContext} from "../../../../game/GameContext";
import {Color} from "../../../../common/color";
import {altBackground} from "./common";
import {HistoryEntry} from "./HistoryEntry";
import {GameHistoryEntry} from "../../../../game/game_history_state/GameHistoryState";

const PlainLineNumberLabel = ({lineNumber, className}: { lineNumber: number, className?: string }) => {
    const text = (lineNumber < 10 ? " " : "") + lineNumber + "."
    return <span className={className}>{text}</span>
}

const LineNumberLabel = styled(PlainLineNumberLabel)<{ altBg: boolean }>`
    white-space: pre;
    background-color: ${altBackground};
    padding-right: 5px;
    display: flex;
    align-items: center;
`

const PlainSkip = ({className}: { className?: string }) => <span className={className}></span>

const Skip = styled(PlainSkip)<{ altBg: boolean }>`
    background-color: ${altBackground};
`

export type HistoryEntryType = FunctionComponent<{
    entry: GameHistoryEntry,
    className?: string,
    row?: boolean,
    inline?: boolean,
    index: number,
    altBg: boolean
}>


const PlainNormalHistoryTab = observer(function PlainHistoryTab({className, historyEntryComponent: HistoryEntryC = HistoryEntry}: { className?: string , historyEntryComponent?: HistoryEntryType}) {
    const renderedElements: ReactNode[] = []

    const tabRef = useRef<HTMLDivElement | null>(null)
    const gameHistoryState = useGameContext("gameHistoryState")

    let lineNumber = 1
    let altBg = true
    let onLeft = true
    let key = 0

    useEffect(() => {
        const tab = tabRef.current
        if (tab !== null) {
            tab.scrollTop = tab.scrollHeight
        }
    });

    if (gameHistoryState.currentGame === undefined) {
        return <div className={className}></div>
    }

    const game = gameHistoryState.currentGame!

    if (game.firstToMove === Color.BLACK && gameHistoryState.moves.length > 0 &&
        gameHistoryState.moves[0].type !== "game_end") {
        altBg = !altBg
        renderedElements.push(<LineNumberLabel lineNumber={lineNumber++} altBg={altBg} key={key++}/>)
        renderedElements.push(<Skip altBg={altBg} key={key++}/>)
        onLeft = false
    }

    for (const [i, entry] of gameHistoryState.moves.entries()) {
        if (entry.type === "game_end") {
            if (!onLeft) {
                renderedElements.push(<Skip altBg={altBg} key={key++}/>)
                altBg = !altBg
            }
            renderedElements.push(<HistoryEntryC entry={entry} altBg={altBg} key={key++} index={i}/>)
            onLeft = true
        } else {
            if (onLeft) {
                altBg = !altBg
                renderedElements.push(<LineNumberLabel altBg={altBg} lineNumber={lineNumber++} key={key++}/>)
            }
            renderedElements.push(<HistoryEntryC entry={entry} altBg={altBg} key={key++} index={i}/>)
            onLeft = !onLeft
        }
    }
    if (!onLeft && gameHistoryState.moves[gameHistoryState.moves.length - 1].type !== "game_end") {
        renderedElements.push(<Skip altBg={altBg} key={key++}/>)
    }

    return <div className={className} ref={tabRef}>{renderedElements}</div>
})

export const NormalHistoryTab = styled(PlainNormalHistoryTab)`
    background-color: #ddd;
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    grid-template-rows: repeat(500, min-content);
    overflow-y: auto;
    scrollbar-width: none;
`

const PlainRowHistoryTab = observer(function PlainRowHistoryTab({className}: { className?: string }) {
    const renderedElements: ReactNode[] = []

    const tabRef = useRef<HTMLDivElement | null>(null)
    const gameHistoryState = useGameContext("gameHistoryState")

    let lineNumber = 1
    let newLine = true
    let key = 0

    useEffect(() => {
        const tab = tabRef.current
        if (tab !== null) {
            tab.scrollLeft = tab.scrollWidth
        }
    });


    if (gameHistoryState.currentGame === undefined) {
        return <div className={className}></div>
    }

    const game = gameHistoryState.currentGame!

    if (game.firstToMove === Color.BLACK && gameHistoryState.moves.length > 0
        && gameHistoryState.moves[0].type !== "game_end") {
        renderedElements.push(<LineNumberLabel lineNumber={lineNumber++} altBg={false} key={key++}/>)
        renderedElements.push(<Skip altBg={false} key={key++}/>)
        newLine = false
    }

    for (const entry of gameHistoryState.moves) {
        if (entry.type === "game_end") {
            newLine = true
            renderedElements.push(<HistoryEntry entry={entry} altBg={false} row={true} key={key++} />)
        } else {
            if (newLine) {
                renderedElements.push(<LineNumberLabel altBg={false} lineNumber={lineNumber++} key={key++}/>)
            }
            renderedElements.push(<HistoryEntry entry={entry} altBg={!newLine} inline={true} key={key++} />)
            newLine = !newLine
        }
    }

    return <div className={className} ref={tabRef}>{renderedElements}</div>
})

export const RowHistoryTab = styled(PlainRowHistoryTab)`
    background-color: #ddd;
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;
`