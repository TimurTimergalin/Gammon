import styled from "styled-components";
import GameView from "../game/GameView";
import {GameContextHolder} from "../game/GameContextHolder";
import {FunctionComponent, useState} from "react";
import {Option} from "./GameChoice";
import {AnalysisPanel} from "./AnalysisPanel";
import {SummaryContent, SummaryPanel} from "./SummaryPanel";


const Hidden = <T extends FunctionComponent,>(comp: T) => styled(comp)<{hide: boolean}>`
    ${({hide}) => hide ? "display: none;" : ""}
`

const HiddenSummaryPanel = Hidden(SummaryPanel)
const HiddenAnalysisPanel = Hidden(AnalysisPanel)


const PlainSidePanel = ({className, remoteHistory, analysis}: {
    className?: string,
    remoteHistory: ReturnType<JSON["parse"]>,
    analysis: undefined | null | ReturnType<JSON["parse"]>
}) => {
    const [chosenTab, setChosenTab] = useState(0)

    return (
        <div className={className}>
            <div>
                <Option onChoose={() => setChosenTab(0)} text={"Отчет"} chosen={chosenTab === 0}/>
                <Option onChoose={() => setChosenTab(1)} text={"Анализ"} chosen={chosenTab === 1}/>
            </div>
            <HiddenSummaryPanel analysis={analysis} remoteHistory={remoteHistory} hide={chosenTab !== 0}/>
            <HiddenAnalysisPanel remoteHistory={remoteHistory} analysis={analysis} hide={chosenTab !== 1} />
        </div>
    )
}

const SidePanel = styled(PlainSidePanel)`
    & {
        display: flex;
        flex-direction: column;
        color: black;

        > :nth-child(1) {
            display: flex;
            height: 40px;
            align-items: stretch;

            > ${Option} {
                flex: 1;
            }
        }

        > :nth-child(n + 2) {
            flex: 1;
            min-height: 0;
            >${SummaryContent} {
                height: 100%;
            }
        }
    }
`

const PlainHistoryPage = ({className, remoteHistory, analysis}: {
    className?: string,
    remoteHistory: ReturnType<JSON["parse"]>,
    analysis: undefined | null | ReturnType<JSON["parse"]>
}) => {

    return (
        <div className={className}>
            <GameContextHolder>
                <div>
                    <div>
                        <div>
                            <GameView/>
                        </div>
                    </div>
                    <span/>
                    <SidePanel remoteHistory={remoteHistory} analysis={analysis}/>
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