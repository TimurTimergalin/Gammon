import styled, {css} from "styled-components";
import {useGameContext} from "../../../game/GameContext";

const buttonStyle = css`
    & {
        aspect-ratio: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: white;
        border: 0;
        outline: 0;
        padding: 0;
        border-radius: 1000px;
        margin-top: 4px;
        margin-bottom: 4px;
    }
    
    &:hover {
        background-color: #f2f2f2;
    }
    
    &:active {
        background-color: #eaeaea;
    }
`

const PlainSwapBoardButton = ({className}: { className?: string }) => {
    const gameController = useGameContext("gameController")
    const playerInfo = useGameContext("playersInfo")
    return (
        <button className={className} type={"button"} onClick={() => {
            gameController.swapBoard()
            playerInfo.swap()
        }}>
            <img src={"/swap_board.svg"} alt={"Повернуть доску"} title={"Перевернуть доску"} />
        </button>
    )
}

const SwapBoardButton = styled(PlainSwapBoardButton)`
    ${buttonStyle}
    & img {
        height: 40px;
        width: auto;
    }
`

const PlainSurrenderButton = ({className}: { className?: string }) => {
    const gameController = useGameContext("gameController")
    return (
        <button className={className} type={"button"} onClick={() => gameController.concedeMatch()}>
            <img src={"/surrender.svg"} alt={"Сдаться"} title={"Сдать матч (весь!)"}/>
        </button>
    )
}

const SurrenderButton = styled(PlainSurrenderButton)`
    ${buttonStyle}
    & img {
        height: 30px;
        width: auto;
    }
`


const PlainButtonsTab = ({className}: { className?: string }) => (
    <div className={className}>
        <SwapBoardButton />
        <SurrenderButton />
    </div>
)

export const NormalButtonsTab = styled(PlainButtonsTab)`
    & {
        background-color: white;
        border-radius: 0 0 20px 20px;
        display: flex;
        justify-content: space-evenly;
    }
    
    & > :nth-child(1) {
        margin-left: 10%;
    }

    & > :nth-last-child(1) {
        margin-right: 10%;
    }
`

export const RowButtonsTab = styled(PlainButtonsTab)`
    & {
        background-color: white;
        border-radius: 0 5px 5px 0;
        display: flex;
        justify-content: space-evenly;
    }
`