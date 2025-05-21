import {useContext, useEffect, useState} from "react";
import {SwitchSelect} from "../play_menu/control_panel/SwitchSelect";
import {AccentedButton} from "../AccentedButton";
import styled from "styled-components";
import {firstEntryMargin, playButtonStyle, tabEntryStyle} from "../play_menu/control_panel/style";
import {useFetch} from "../../common/hooks";
import {MessagesStateContext} from "../../controller/messages/context";
import {ChallengeCreatedMessage, ErrorMessage} from "./messages";
import {ControlPanelContext} from "../../controller/play_menu/ControlPanelContext";
import {cancelChallenge, sendChallenge} from "../../requests/requests";
import {ControlPanelState} from "../../controller/play_menu/ControlPanelState";
import {ControlPanel} from "../play_menu/control_panel/ControlPanel";

const PlainChallengeGameTab = ({className, userId}: { className?: string, userId: number }) => {
    const [gameMode, setGameMode] = useState(0)
    const [pointsUntil, setPointUntil] = useState(0)
    const [blitz, setBlitz] = useState(0)
    const messagesState = useContext(MessagesStateContext)
    const [fetch] = useFetch()

    const gameModes = ["Короткие нарды", "Длинные нарды"]
    const pointsOptions = ["1", "3", "5", "7"]
    const blitzOptions = ["Обычные", "Блиц"]

    const normalTimeControlFormatTable = new Map([
        [0, new Map([
            [0, "2|8"],
            [1, "6|8"],
            [2, "10|8"],
            [3, "14|8"]
        ])],
        [1, new Map([
            [0, "2|8"],
            [1, "6|8"],
            [2, "10|8"],
            [3, "14|8"]
        ])]
    ])

    const blitzTimeControlFormatTable = new Map([
        [0, new Map([
            [0, "30 сек.|8"],
            [1, "1|8"],
            [2, "2|8"],
            [3, "3|8"]
        ])],
        [1, new Map([
            [0, "30 сек.|8"],
            [1, "1|8"],
            [2, "2|8"],
            [3, "3|8"]
        ])]
    ])

    const timeControlFormatTable = new Map(
        [
            [0, normalTimeControlFormatTable],
            [1, blitzTimeControlFormatTable]
        ]
    )

    const timeControlFormat = "Контроль времени: " + timeControlFormatTable.get(blitz)!.get(gameMode)!.get(pointsUntil)

    return (
        <div className={className}>
            <SwitchSelect options={gameModes} callback={setGameMode}/>
            <SwitchSelect options={pointsOptions} callback={setPointUntil}/>
            <SwitchSelect options={blitzOptions} callback={setBlitz}/>
            <p style={{textAlign: "center"}}>{timeControlFormat}</p>
            <AccentedButton onClick={
                () => {
                    const game = gameMode === 0 ? "SHORT_BACKGAMMON" : "REGULAR_GAMMON"
                    const points =
                        pointsUntil === 0 ? 1 :
                            pointsUntil === 1 ? 3 :
                                pointsUntil === 2 ? 5 : 7

                    const isBlitz = blitz === 1

                    sendChallenge(fetch, userId, game, points, isBlitz).then(resp => {
                        if (resp.ok) {
                            messagesState.insert(<ChallengeCreatedMessage userId={userId}/>)
                        } else {
                            messagesState.insert(<ErrorMessage />)
                        }
                    })
                }
            }>Играть</AccentedButton>
        </div>
    )
}

const ChallengeGameTab = styled(PlainChallengeGameTab)`
    & {
        display: flex;
        flex-direction: column;
    }

    & > :nth-child(-n + 4) {
        ${tabEntryStyle}
    }

    & > :nth-child(1) {
        ${firstEntryMargin}
    }

    & > :nth-child(5) {
        ${playButtonStyle}
    }
`

const PlainChallengePage = ({className, userId}: {className?: string, userId: number}) => {
    const [controlPanelState] = useState(new ControlPanelState())

    useEffect(() => {
        return () => {
            cancelChallenge(fetch, userId).then()
        } 
    }, [userId]);
    
    return (
        <div className={className}>
            <ControlPanelContext.Provider value={controlPanelState}>
                <ControlPanel options={["Вызов"]}>
                    <ChallengeGameTab userId={userId} />
                </ControlPanel>
            </ControlPanelContext.Provider>
        </div>
    )
}

export const ChallengePage = styled(PlainChallengePage)`
    flex: 1;
    align-self: stretch;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow-y: auto;
    
    ${ControlPanel} {
        height: 340px;
        width: 60%;
        max-width: 350px;
    }
`
