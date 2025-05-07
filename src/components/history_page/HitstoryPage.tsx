import styled from "styled-components";
import GameView from "../game/GameView";
import {NormalTimer} from "../game/timer/Timer";
import {GameContextHolder} from "../game/GameContextHolder";

const PlainAnalysisPanel = ({className}: { className?: string }) => {
    return (
        <div className={className}>

        </div>
    )
}

const AnalysisPanel = styled(PlainAnalysisPanel)`

`

const PlainHistoryPage = ({className}: { className?: string }) => {

    return (
        <div className={className}>
            <div>
                <div>
                    <GameContextHolder>
                        <div>
                            <GameView/>
                        </div>
                        <div>
                            <NormalTimer index={0}/>
                            <NormalTimer index={1}/>
                        </div>
                    </GameContextHolder>
                </div>
                <span />
                <AnalysisPanel/>
            </div>
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
            > ${AnalysisPanel} {
                width: 320px;
                height: 600px;
                background-color: white;
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