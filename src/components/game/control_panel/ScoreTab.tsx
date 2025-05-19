import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";
import styled, {css} from "styled-components";
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

const scoreTextStyle = css`
    & > :nth-child(1) {
        color: ${colorFill(Color.WHITE)};
        margin-left: 0.2em;
    }

    & > :nth-child(2) {
        color: ${colorFill(Color.BLACK)};
        margin-left: 0.2em;
        margin-right: 0.2em;
    }

    & > :nth-child(3) {
        color: ${colorFill(Color.BLACK)};
        margin-right: 0.2em;
    }
`

export const NormalScoreText = styled(PlainScoreText)`
    & {
        display: flex;
        justify-content: center;
        font-size: 40px;
        font-weight: 700;
    }
    ${scoreTextStyle}
`


const PlainScoreTab = observer(function PlainScoreTab({className}: { className?: string }) {
    const scoreState = useGameContext("scoreState")

    return (
        <div className={className}>
            <NormalScoreText white={scoreState.white} black={scoreState.black} />
        </div>
    )
})
export const NormalScoreTab = styled(PlainScoreTab)`
    & {
        border-radius: 20px 20px 0 0;
        background-color: #a8a8a8;
        border-bottom: 1px solid #2f2e2d;
    }
`

export const RowScoreTab = styled(PlainScoreTab)`
    & {
        border-radius: 5px 0 0 5px;
        background-color: #a8a8a8;
        border-right: 1px solid #2f2e2d;
    }
`

export const MicroScoreTab = styled(PlainScoreTab)`
    & {
        background-color: #a8a8a8;
        border-radius: 5px 5px 0 0;
    }
`