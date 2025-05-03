import {observer} from "mobx-react-lite";
import {GameHistoryEntry} from "../../../../game/game_history_state/GameHistoryState";
import styled from "styled-components";
import {Color} from "../../../../common/color";
import {NormalScoreText} from "../ScoreTab";
import {altBackground} from "./common";
import {CSSProperties} from "react";

const PlainMoveEntry = (
    {dice, moves, className}:
        GameHistoryEntry &
        { type: "move" } &
        { className?: string }
) => {
    const moveDivs = moves.map((s, i) => <div key={i}>{s}</div>)
    return (
        <div className={className}>
            <div>{Math.max(...dice)}{Math.min(...dice)}:</div>
            <div>{moveDivs}</div>
        </div>
    )
}

const MoveEntry = styled(PlainMoveEntry)<{inline?: boolean}>`
    & {
        display: flex;
        padding-left: 1px;
        padding-right: 1px;
    }
    
    & > :nth-child(1) {
        margin-right: 3px;
    }

    & > :nth-child(2) {
        display: flex;
        flex-wrap: ${({inline}) => inline ? "nowrap" : "wrap"}; 
        > *{
            margin-right: ${({inline}) => inline ? 0 : 5}px;
        }
    }
`

const PlainOfferDoubleEntry = ({newValue, className}: GameHistoryEntry & { type: "offer_double" } & {
    className?: string
}) => {
    return <div className={className}>x{newValue}</div>
}

const OfferDoubleEntry = styled(PlainOfferDoubleEntry)`
    display: flex
`

const PlainAcceptDoubleEntry = ({className}: { className?: string }) => <div className={className}>Принят</div>
const AcceptDoubleEntry = styled(PlainAcceptDoubleEntry)`
    display: flex;
`

const PlainGameEndEntry = (
    {white, black, winner, reason, className}:
        GameHistoryEntry &
        { type: "game_end" } &
        { className?: string }
) => {
    return (
        <div className={className}>
            <div>Победитель: {winner === Color.WHITE ? "Белые" : "Черные"}</div>
            <NormalScoreText white={white} black={black}/>
            <div>{reason}</div>
        </div>
    )
}

const GameEndEntry = styled(PlainGameEndEntry)<{row?: boolean}>`
    & {
        display: flex;
        flex-direction: ${({row}) => row ? "row" : "column"};
        align-items: center;
        background-color: #a8a8a8;
        flex: 1
    }

    & > :nth-child(1) {
        color: white;
        margin-left: 1px;
    }

    & > :nth-child(3) {
        color: white;
        margin-right: 1px;
    }
`


const PlainHistoryEntry = observer(function PlainHistoryEntry({entry, className, row, inline}: {
    entry: GameHistoryEntry,
    className?: string,
    row?: boolean,
    inline?: boolean
}) {
    if (entry === undefined) {
        return <></>
    }

    const additionalStyle: CSSProperties = {
        paddingRight: entry.type === "game_end" ? 0 : 3,
        gridColumn: entry.type === "game_end" ? "span 3" : "span 1",
        display: "flex",
        alignItems: "center"
    }

    return (
        <div className={className} style={additionalStyle}>
            {
                entry.type === "move" ? <MoveEntry {...entry} inline={inline}/> :
                    entry.type === "offer_double" ? <OfferDoubleEntry {...entry}/> :
                        entry.type === "accept_double" ? <AcceptDoubleEntry/> :
                            <GameEndEntry {...entry} row={row} />
            }
        </div>
    )
})

export const HistoryEntry = styled(PlainHistoryEntry)<{ altBg: boolean }>`
    & {
        background-color: ${altBackground};
    }
`