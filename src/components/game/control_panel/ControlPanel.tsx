import styled from "styled-components";
import {ScoreTab} from "./ScoreTab";
import {HistoryTab} from "./HistoryTab";
import {ButtonsTab} from "./ButtonsTab";

const PlainControlPanel = ({className}: { className?: string }) => {
    return (
        <div className={className}>
            <ScoreTab />
            <HistoryTab />
            <ButtonsTab />
        </div>
    )
}

export const ControlPanel = styled(PlainControlPanel)`
    & {
        border-radius: 20px;
        background-color: white;
        flex: 1;
        text-align: center;
        color: black;
        display: flex;
        flex-direction: column;
    }
    
    & > :nth-child(1) {
        width: 100%;
        height: 50px;
    }
    
    & > :nth-child(2) {
        width: 100%;
        flex: 1;
    }
    
    & > :nth-child(3) {
        width: 100%;
        height: 30px;
    }
`