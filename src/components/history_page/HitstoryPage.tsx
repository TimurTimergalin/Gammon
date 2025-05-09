import styled from "styled-components";
import GameView from "../game/GameView";
import {NormalTimer} from "../game/timer/Timer";
import {GameContextHolder} from "../game/GameContextHolder";
import {NormalHistoryTab} from "../game/control_panel/history_panel/HistoryTab";
import {HistoryEntry} from "../game/control_panel/history_panel/HistoryEntry";
import {useEffect, useState} from "react";
import {useGameContext} from "../../game/GameContext";
import {backgammonRuleSet} from "../../game/game_rule/backgammon/RuleSet";
import {nardeRuleSet} from "../../game/game_rule/narde/RuleSet";
import {backgammonRemoteSetV1} from "../../game/game_rule/backgammon/remote_v1/RemoteSet";
import {nardeRemoteSetV1} from "../../game/game_rule/narde/remote_v1/RemoteSet";
import {mapHistory} from "../../game/game_controller/remote/factory";


const PlainOption = ({onChoose, text, className}: { onChoose: () => void, text: string, className?: string }) => {
    return (
        <div onClick={onChoose} className={className}>{text}</div>
    )
}

const Option = styled(PlainOption)<{ chosen: boolean }>`
    color: black;
    background-color: ${({chosen}) => chosen ? "white" : "#bbb"};
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

const GameChoice = styled(PlainGameChoice)`
    display: flex;
    color: black;

    > * {
        flex: 1;
    }
`


const PlainAnalysisPanel = ({className, remoteHistory}: {
    className?: string,
    remoteHistory: ReturnType<JSON["parse"]>
}) => {
    const [chosenGame, setChosenGame] = useState(0)
    const gameHistoryState = useGameContext("gameHistoryState")

    useEffect(() => {
        const type = remoteHistory[0].type
        const historyEncoder = type === "SHORT_BACKGAMMON" ? backgammonRuleSet.historyEncoder : nardeRuleSet.historyEncoder
        const remoteMoveMapper = type === "SHORT_BACKGAMMON" ? backgammonRemoteSetV1.remoteMoveMapper : nardeRemoteSetV1.remoteMoveMapper
        const [entries, firstToMove] = mapHistory(historyEncoder, remoteMoveMapper, remoteHistory[chosenGame])
        gameHistoryState.clear()
        gameHistoryState.currentGame = {firstToMove: firstToMove}
        entries.forEach(e => gameHistoryState.add(e))
        
        console.log("Remote history")
    }, [chosenGame, gameHistoryState, remoteHistory]);
    return (
        <div className={className}>
            <GameChoice boundary={remoteHistory.length} onChange={setChosenGame}/>
            <div>
            </div>
            <div>
                <NormalHistoryTab historyEntryComponent={HistoryEntry}/>
            </div>
            <div>
            </div>
        </div>
    )
}

const AnalysisPanel = styled(PlainAnalysisPanel)`
    & {
        background-color: white;
        display: flex;
        flex-direction: column;
        align-items: stretch;

        > :nth-child(1) {
            height: 40px;
        }

        > :nth-child(2) {
            height: 130px;
            background-color: #666;
        }

        > :nth-child(3) {
            flex: 1;
            overflow-y: auto;
            scrollbar-width: none;
            color: black;
        }

        > :nth-child(4) {
            height: 130px;
            background-color: #666;
        }

    }
`

const PlainSummaryPanel = ({className}: { className?: string }) => {

    return (
        <div className={className}>

        </div>
    )
}

const SummaryPanel = styled(PlainSummaryPanel)`
    background-color: white;
`

const PlainSidePanel = ({className, remoteHistory}: {
    className?: string,
    remoteHistory: ReturnType<JSON["parse"]>
}) => {
    const [chosenTab, setChosenTab] = useState(0)


    return (
        <div className={className}>
            <div>
                <Option onChoose={() => setChosenTab(0)} text={"Отчет"} chosen={chosenTab === 0}/>
                <Option onChoose={() => setChosenTab(1)} text={"Анализ"} chosen={chosenTab === 1}/>
            </div>
            {chosenTab === 0 && <SummaryPanel/>}
            {chosenTab === 1 && <AnalysisPanel remoteHistory={remoteHistory}/>}
        </div>
    )
}

const SidePanel = styled(PlainSidePanel)`
    & {
        display: flex;
        flex-direction: column;

        > :nth-child(1) {
            display: flex;
            height: 40px;
            align-items: stretch;

            > ${Option} {
                flex: 1;
            }
        }

        > :nth-child(2) {
            flex: 1;
        }
    }
`

const PlainHistoryPage = ({className, remoteHistory}: {
    className?: string,
    remoteHistory: ReturnType<JSON["parse"]>
}) => {

    return (
        <div className={className}>
            <GameContextHolder>
                <div>
                    <div>
                        <div>
                            <GameView/>
                        </div>
                        <div>
                            <NormalTimer index={0}/>
                            <NormalTimer index={1}/>
                        </div>
                    </div>
                    <span/>
                    <SidePanel remoteHistory={remoteHistory}/>
                </div>
            </GameContextHolder>

        </div>
    )
}

export const HistoryPage = styled(PlainHistoryPage)`
    & {
        flex: 1;
        align-self: stretch;
        display: flex;
        overflow-y: auto;

        > div {
            flex: 1;
            width: 100%;
            align-self: stretch;
            display: flex;
            justify-content: space-around;
            align-items: center;
            flex-wrap: wrap;

            > :nth-child(1) {
                display: flex;
                flex-direction: column;
                align-items: stretch;
                flex: 10;
                min-width: 350px;
                margin-left: 30px;

                > div:nth-child(1) {
                    flex: 1;
                }

                > div:nth-child(2) {
                    display: flex;
                    justify-content: space-evenly;
                }
            }

            > ${SidePanel} {
                width: 320px;
                height: 600px;
                margin-right: 30px;
                margin-top: 40px;
            }

            > span {
                flex: 1;
                min-width: 30px;
            }
        }
    }
`