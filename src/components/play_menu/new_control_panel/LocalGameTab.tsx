import styled from "styled-components";
import {useRef} from "react";
import {createSearchParams, useNavigate} from "react-router";
import {AccentedButton} from "../../AccentedButton";
import {firstEntryMargin, playButtonStyle, tabEntryStyle} from "./style";
import {SwitchSelect} from "./SwitchSelect";

const PlainLocalGameTab = ({className}: { className?: string }) => {
    const gameMode = useRef(0)
    const pointsUntil = useRef(0)
    const navigate = useNavigate()

    const gameModes = ["Короткие нарды"]
    const pointsOptions = ["1", "3", "5", "7"]

    return (
        <div className={className}>
            <SwitchSelect options={gameModes} callback={(i) => gameMode.current = i}/>
            <SwitchSelect options={pointsOptions} callback={(i) => pointsUntil.current = i}/>
            <AccentedButton onClick={
                () => {
                    const path = "/local-play/backgammon" // Должен зависеть от gameMode
                    const points =
                        pointsUntil.current === 0 ? "1" :
                            pointsUntil.current === 1 ? "3" :
                                pointsUntil.current === 2 ? "5" : "7"

                    navigate({
                        pathname: path,
                        search: createSearchParams({
                            pointsUntil: points
                        }).toString()
                    })
                }
            }>Играть</AccentedButton>
        </div>
    )
}

export const LocalGameTab = styled(PlainLocalGameTab)`
    &{
        display: flex;
        flex-direction: column;
    }
    
    &>:nth-child(-n + 2) {
        ${tabEntryStyle}
    }
    
    &>:nth-child(1) {
        ${firstEntryMargin}
    }
    
    &>:nth-child(3) {
        ${playButtonStyle}
    }
`
