import styled from "styled-components";
import {useState} from "react";
import {createSearchParams, useNavigate} from "react-router";
import {AccentedButton} from "../../AccentedButton";
import {firstEntryMargin, playButtonStyle, tabEntryStyle} from "./style";
import {SwitchSelect} from "./SwitchSelect";

const PlainLocalGameTab = ({className}: { className?: string }) => {
    const [gameMode, setGameMode] = useState(0)
    const [pointsUntil, setPointUntil] = useState(0)
    const [blitz, setBlitz] = useState(0)
    const navigate = useNavigate()

    const gameModes = ["Короткие нарды", "Длинные нарды"]
    const pointsOptions = ["1", "3", "5", "7"]
    const blitzOptions = ["Обычные", "Блиц"]
    const routes = new Map(
        [
            [0, "/local-play/backgammon"],
            [1, "/local-play/narde"]
        ]
    )

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
                    const path = routes.get(gameMode)
                    const points =
                        pointsUntil === 0 ? "1" :
                            pointsUntil === 1 ? "3" :
                                pointsUntil === 2 ? "5" : "7"

                    const isBlitz = blitz + ""

                    navigate({
                        pathname: path,
                        search: createSearchParams({
                            pointsUntil: points,
                            blitz: isBlitz
                        }).toString()
                    })
                }
            }>Играть</AccentedButton>
        </div>
    )
}

export const LocalGameTab = styled(PlainLocalGameTab)`
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
