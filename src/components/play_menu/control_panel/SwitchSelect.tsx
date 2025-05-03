import {useState} from "react";
import styled from "styled-components";

const PlainChoice = ({value, className, callback}: {
    value: string,
    className?: string,
    callback: () => void
}) => {
    return (
        <div className={className} onClick={callback}>{value}</div>
    )
}
const Choice = styled(PlainChoice)<{ left: boolean, right: boolean, chosen: boolean }>`
    & {
        display: flex;
        justify-content: center;
        align-items: center;
        text-align: center;
        border-top-left-radius: ${({left}) => left ? 5 : 0}px;
        border-bottom-left-radius: ${({left}) => left ? 5 : 0}px;
        border-top-right-radius: ${({right}) => right ? 5 : 0}px;
        border-bottom-right-radius: ${({right}) => right ? 5 : 0}px;
        background-color: ${({chosen}) => chosen ? "#ff7f2a" : "#bbb"};
        color: ${({chosen}) => chosen ? "white" : "black"};
        border-left: ${({left}) => left ? 0 : 1}px solid;
        border-color: #555;
    }

    &:hover {
        background-color: ${({chosen}) => chosen ? "#ff7f2a" : "#ddd"};
    }
`
const choiceCallback = (i: number, callback: (i: number) => void) => () => callback(i)
const PlainSwitchSelect = ({options, callback, className}: {
    options: string[],
    callback: (v: number) => void,
    className?: string
}) => {
    const [chosen, setChosen] = useState(0)

    let i = 0

    const choices = []
    for (const option of options) {
        choices.push(
            <Choice
                left={i == 0}
                callback={choiceCallback(i, (i) => {
                    callback(i);
                    setChosen(i)
                })}
                right={i == options.length - 1}
                value={option}
                chosen={chosen == i}
                key={option}
            />
        )
        ++i
    }

    return (
        <div className={className}>{choices}</div>
    )
}
export const SwitchSelect = styled(PlainSwitchSelect)`
    & {
        display: flex;
    }

    & * {
        flex: 1;
    }
`