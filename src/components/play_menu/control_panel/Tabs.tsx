import styled from "styled-components";
import {useEffect, useState} from "react";


const PlainOptionTab = ({children, callback, className}: {
    children: string,
    callback: () => void,
    className?: string
}) => {
    return <div className={className} onClick={callback}>{children}</div>
}

const OptionTab = styled(PlainOptionTab)<{ left: boolean, right: boolean, chosen: boolean }>`
    & {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        border-top-left-radius: ${({left}) => left ? 20 : 0}px;
        border-top-right-radius: ${({right}) => right ? 20 : 0}px;
        font-size: 0.9em;
        background-color: ${({chosen}) => chosen ? "#fff" : "#bbb"};
    }

    &:hover {
        background-color: ${({chosen}) => chosen ? "#fff" : "#ddd"};
    }
`

const tabCallback = (i: number, callback: (i: number) => void) => () => callback(i)

const PlainTabs = ({options, className, onChange}: { options: string[], className?: string, onChange: (choice: number) => void }) => {
    useEffect(() => {
        console.assert(options.length !== 0)
    }, [options.length]);

    const [chosen, setChosen] = useState(0)

    let i = 0

    const tabs = []
    for (const option of options) {
        tabs.push(
            <OptionTab
                left={i == 0}
                callback={chosen === i ? () => {} : tabCallback(i, (i) => {setChosen(i); onChange(i)})
            }
                right={i == options.length - 1}
                chosen={chosen === i}
                key={option}
            >
                {option}
            </OptionTab>
        )
        ++i
    }

    return <div className={className}>{tabs}</div>
}

export const Tabs = styled(PlainTabs)`
    display: flex;
`


