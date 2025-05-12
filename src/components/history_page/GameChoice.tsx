import styled from "styled-components";
import {useState} from "react";

const PlainOption = ({onChoose, text, className}: { onChoose: () => void, text: string, className?: string }) => {
    return (
        <div onClick={onChoose} className={className}>{text}</div>
    )
}
export const Option = styled(PlainOption)<{ chosen: boolean }>`
    color: black;
    background-color: ${({chosen}) => chosen ? "white" : "#bbb"};
    display: flex;
    justify-content: center;
    align-items: center;
`
const PlainGameChoice = ({className, onChange, boundary}: {
    className?: string,
    onChange: (i: number) => void,
    boundary: number
}) => {
    const [chosen, setChosen] = useState(0)

    const reduce = () => {
        onChange(chosen - 1)
        setChosen(chosen - 1)
    }

    const increase = () => {
        onChange(chosen + 1)
        setChosen(chosen + 1)
    }

    return (
        <div className={className}>
            <button onClick={reduce} type={"button"} disabled={chosen === 0}>{"<"}</button>
            <span>Игра {chosen + 1}</span>
            <button onClick={increase} type={"button"} disabled={chosen >= boundary - 1}>{">"}</button>
        </div>
    )
}
export const GameChoice = styled(PlainGameChoice)`
    display: flex;
    color: black;
    background-color: #ddd;

    > * {
        flex: 1;
        border-radius: 0;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
    button {
        border: 0;
        background-color: #eee;
        font-size: 20px;
        &:hover {
            background-color: #ccc;
        }
    }
`