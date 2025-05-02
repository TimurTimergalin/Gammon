import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";
import styled from "styled-components";
import {Color, colorFill} from "../../../common/color";


const PlainScoreText = observer(function PlainScore({white, black, className}: {white: number, black: number, className?: string}){
    return (
        <div className={className}>
            <span>{white}</span>
            <span>:</span>
            <span>{black}</span>
        </div>
    )
})

export const ScoreText = styled(PlainScoreText)`
    & {
        display: flex;
        justify-content: center;
        font-size: 40px;
        font-weight: 700;
    }
    & > :nth-child(1) {
        color: ${colorFill(Color.WHITE)};
    }

    & > :nth-child(2) {
        color: ${colorFill(Color.BLACK)};
        margin-left: 0.2em;
        margin-right: 0.2em;
    }

    & > :nth-child(3) {
        color: ${colorFill(Color.BLACK)};
    }
`


const PlainScoreTab = observer(function PlainScoreTab({className}: { className?: string }) {
    const scoreState = useGameContext("scoreState")

    return (
        <div className={className}>
            <ScoreText white={scoreState.white} black={scoreState.black} />
        </div>
    )
})
export const NormalScoreTab = styled(PlainScoreTab)`
    & {
        border-radius: 20px 20px 0 0;
        background-color: #a8a8a8;
    }
`

export const RowScoreTab = styled(PlainScoreTab)`
    & {
        border-radius: 5px 0 0 5px;
        background-color: #a8a8a8;
    }
`