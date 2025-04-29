import {ReactNode, useState} from "react";
import {Tabs} from "./Tabs";
import styled from "styled-components";

const PlainControlPanel = ({options, children, className}: {
    options: string[],
    children: ReactNode | ReactNode[],
    className?: string
}) => {
    const tabs = Array.isArray(children) ? children : [children]
    const [tab, setTab] = useState(0)

    return (
        <div className={className}>
            <Tabs onChange={setTab} options={options}/>
            {tabs[tab]}
        </div>
    )
}

export const ControlPanel = styled(PlainControlPanel)`
    & {
        display: flex;
        flex-direction: column;
        flex: 1;
        border-radius: 20px;
        background-color: #fff;
        user-select: none;
        color: #000;
    }
    &>:nth-child(1) {
        width: 100%;
        height: 15%;
    }
    &>:nth-child(2){
        flex: 1;
        width: 100%;
    }
`