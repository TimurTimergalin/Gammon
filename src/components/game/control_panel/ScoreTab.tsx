import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";
import styled from "styled-components";
import {Color, colorFill} from "../../../common/color";

const PlainScoreTab = observer(function PlainScoreTab({className}: { className?: string }) {
    const scoreState = useGameContext("scoreState")

    return (
        <div className={className}>
            <span>{scoreState.white}</span>
            <span>:</span>
            <span>{scoreState.black}</span>
        </div>
    )
})
export const ScoreTab = styled(PlainScoreTab)`
    & {
        display: flex;
        border-radius: 20px 20px 0 0;
        background-color: #a8a8a8;
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