import styled from "styled-components";
import {observer} from "mobx-react-lite";
import {ReactNode, useRef} from "react";
import {useGameContext} from "../../../../game/GameContext";
import {Color} from "../../../../common/color";
import {altBackground} from "./common";
import {HistoryEntry} from "./HistoryEntry";

const PlainLineNumberLabel = ({lineNumber, className}: { lineNumber: number, className?: string }) => {
    const text = (lineNumber < 10 ? " " : "") + lineNumber
    return <span className={className}>{text}</span>
}

const LineNumberLabel = styled(PlainLineNumberLabel)<{ altBg: boolean }>`
    white-space: pre;
    background-color: ${altBackground};
    padding-right: 5px;
`

const PlainSkip = ({className}: { className?: string }) => <span className={className}></span>

const Skip = styled(PlainSkip)<{ altBg: boolean }>`
    background-color: ${altBackground};
`

const PlainHistoryTab = observer(function PlainHistoryTab({className}: { className?: string }) {
    const renderedElements: ReactNode[] = []

    const tabRef = useRef<HTMLDivElement | null>(null)
    const gameHistoryState = useGameContext("gameHistoryState")

    let lineNumber = 1
    let altBg = true
    let onLeft = true
    let key = 0

    if (gameHistoryState.currentGame === undefined) {
        return <div className={className}></div>
    }

    const game = gameHistoryState.currentGame!

    if (game.firstToMove === Color.BLACK && gameHistoryState.moves.length > 0) {
        altBg = !altBg
        renderedElements.push(<LineNumberLabel lineNumber={lineNumber++} altBg={altBg} key={key++}/>)
        renderedElements.push(<Skip altBg={altBg} key={key++}/>)
        onLeft = false
    }

    for (const entry of gameHistoryState.moves) {
        if (entry.type === "game_end") {
            if (!onLeft) {
                renderedElements.push(<Skip altBg={altBg} key={key++}/>)
                altBg = !altBg
            }
            renderedElements.push(<HistoryEntry entry={entry} altBg={altBg} key={key++}/>)
            onLeft = true
        } else {
            if (onLeft) {
                altBg = !altBg
                renderedElements.push(<LineNumberLabel altBg={altBg} lineNumber={lineNumber++} key={key++}/>)
            }
            renderedElements.push(<HistoryEntry entry={entry} altBg={altBg} key={key++} />)
            onLeft = !onLeft
        }
    }
    if (!onLeft) {
        renderedElements.push(<Skip altBg={altBg} key={key++}/>)
    }

    if (tabRef.current !== null) {
        tabRef.current.scrollTop = tabRef.current.scrollHeight
    }

    return <div className={className} ref={tabRef}>{renderedElements}</div>
})

export const HistoryTab = styled(PlainHistoryTab)`
    background-color: #ddd;
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    grid-template-rows: repeat(100000, min-content);
    overflow-y: auto;
    scrollbar-width: none;
`