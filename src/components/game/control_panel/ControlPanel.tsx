import styled from "styled-components";
import {NormalScoreTab, RowScoreTab} from "./ScoreTab";
import {NormalHistoryTab, RowHistoryTab} from "./history_panel/HistoryTab";
import {NormalButtonsTab, RowButtonsTab} from "./ButtonsTab";
import {observer} from "mobx-react-lite";
import {useGamePageLayout} from "../../new_adapt/GamePageLayoutProvider";

const PlainNormalControlPanel = ({className}: { className?: string }) => {
    return (
        <div className={className}>
            <NormalScoreTab />
            <NormalHistoryTab />
            <NormalButtonsTab />
        </div>
    )
}

export const NormalControlPanel = styled(PlainNormalControlPanel)`
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
        height: 38px;
    }
`

const PlainRowControlPanel = ({className}: { className?: string }) => {
    return (
        <div className={className}>
            <RowScoreTab />
            <RowHistoryTab />
            <RowButtonsTab />
        </div>
    )
}

const RowControlPanel = styled(PlainRowControlPanel)`
    & {
        border-radius: 5px;
        background-color: white;
        flex: 1;
        text-align: center;
        color: black;
        display: flex;
        flex-direction: row;
        height: 55.2px;
        
    }
    
    & > :nth-child(1) {
        width: 100px;
        height: 100%;
    }
    
    & > :nth-child(2) {
        height: 100%;
        flex: 1;
        //overflow-x: auto;
        //scrollbar-width: none;
    }
    
    & > :nth-child(3) {
        height: 100%;
        width: 100px;
    }
`

export const ControlPanel = observer(function ControlPanel(){
    const mode = useGamePageLayout().layout[1]
    switch (mode) {
        case "Normal":
            return <NormalControlPanel />
        case "Down":
            return <RowControlPanel />
    }
})