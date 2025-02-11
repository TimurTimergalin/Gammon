import styled, {css} from "styled-components";

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
    return (
        <button className={className} type={"button"}>
            <img src={"/swap_board.svg"} alt={"Повернуть доску"} title={"Перевернуть доску"} />
        </button>
    )
}

const SwapBoardButton = styled(PlainSwapBoardButton)`
    ${buttonStyle}
    & img {
        height: 88%;
        width: auto;
    }
`

const PlainSurrenderButton = ({className}: { className?: string }) => {
    return (
        <button className={className} type={"button"}>
            <img src={"/surrender.svg"} alt={"Сдаться"} title={"Сдаться"}/>
        </button>
    )
}

const SurrenderButton = styled(PlainSurrenderButton)`
    ${buttonStyle}
    & img {
        height: 77%;
        width: auto;
    }
`


const PlainButtonsTab = ({className}: { className?: string }) => (
    <div className={className}>
        <SwapBoardButton />
        <SurrenderButton />
    </div>
)

export const ButtonsTab = styled(PlainButtonsTab)`
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