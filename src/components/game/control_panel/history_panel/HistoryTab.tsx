import styled from "styled-components";
import {observer} from "mobx-react-lite";
import {ReactNode, useEffect, useRef, useState} from "react";
import {useGameContext} from "../../../../game/GameContext";
import {Color} from "../../../../common/color";
import {HistoryEntry} from "./HistoryEntry";
import {altBackground} from "./common";

const PlainLineNumberLabel = ({lineNumber, className}: { lineNumber: number, className?: string }) => {
    const text = (lineNumber < 10 ? " " : "") + lineNumber
    return <span className={className}>{text}</span>
}

const LineNumberLabel = styled(PlainLineNumberLabel)<{ altBg: boolean }>` 
    white-space: pre;
    background-color: ${altBackground};
    padding-right: 5px;
`

const PlainSkip = ({className}: {className?: string}) => <span className={className}></span>

const Skip = styled(PlainSkip)<{ altBg: boolean }>`
    background-color: ${altBackground};
`

const PlainHistoryTab = observer(function PlainHistoryTab({className}: { className?: string }) {
    const needNewGame = useRef(true)
    const lineNumber = useRef(1)
    const processedEntryCount = useRef(0)
    const needNewLine = useRef(true)
    const useAltBackground = useRef(false)
    const renderedElements = useRef<ReactNode[]>([])
    const nextKey = useRef(0)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setCounter] = useState(0)
    const counterRef = useRef(0)

    const gameHistoryState = useGameContext("gameHistoryState")
    const tabRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        for (
            let i = processedEntryCount.current;
            processedEntryCount.current < gameHistoryState.moves.length;
            ++processedEntryCount.current
        ) {
            const entry = gameHistoryState.moves[i]
            let needSkipBefore = false
            if (needNewGame.current) {
                lineNumber.current = 1
                needNewLine.current = true
                useAltBackground.current = false
                const game = gameHistoryState.games[entry.game]
                needSkipBefore = game.firstToMove === Color.BLACK
                needNewGame.current = false
            }
            if (entry.type === "game_end") {
                renderedElements.current.push(<HistoryEntry entryIndex={i} altBg={useAltBackground.current}
                                                            key={nextKey.current++}/>)
                needNewGame.current = true
                setCounter(++counterRef.current)
                continue
            }
            if (needNewLine.current) {
                renderedElements.current.push(<LineNumberLabel lineNumber={lineNumber.current++}
                                                               altBg={useAltBackground.current}
                                                               key={nextKey.current++}/>)
            } else {
                renderedElements.current.pop()
                --nextKey.current
            }
            if (needSkipBefore) {
                renderedElements.current.push(<Skip altBg={useAltBackground.current} key={nextKey.current++}/>)
            }
            renderedElements.current.push(<HistoryEntry entryIndex={i} altBg={useAltBackground.current}
                                                        key={nextKey.current++}/>)
            if (!needSkipBefore && needNewLine.current) {
                renderedElements.current.push(<Skip altBg={useAltBackground.current} key={nextKey.current++}/>)
            }
            needNewLine.current = !needNewLine.current || needSkipBefore
            if (needNewLine.current) {
                useAltBackground.current = !useAltBackground.current
            }
        }
        setCounter(++counterRef.current)
        tabRef.current!.scrollTop = tabRef.current!.scrollHeight

    }, [gameHistoryState.moves, gameHistoryState.moves.length, gameHistoryState.games, gameHistoryState]);

    return <div className={className} ref={tabRef}>{renderedElements.current}</div>
})

export const HistoryTab = styled(PlainHistoryTab)`
    background-color: #ddd;
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    grid-template-rows: repeat(100000, min-content);
    overflow-y: auto;
    scrollbar-width: none;
`