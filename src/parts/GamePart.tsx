import {PlayerState} from "../game/player_info/PlayerState.ts";
import {useGameContext} from "../game/GameContext.ts";
import {ReactNode, useEffect} from "react";
import {PlayerIcon} from "../components/game/players/PlayerIcon.tsx";
import {ButtonPanel} from "../components/game/buttons/ButtonPanel.tsx";

export const GamePart = ({player1, player2, children, displayButtons = false}: {
    player1?: PlayerState,
    player2?: PlayerState,
    children: ReactNode,
    displayButtons?: boolean
}) => {
    const playersInfo = useGameContext("playersInfo")

    useEffect(() => {
        playersInfo.player1 = player1 || playersInfo.player1
        playersInfo.player2 = player2 || playersInfo.player2
    }, [player1, player2, playersInfo]);

    return (
        <>
            <div style={{display: "flex"}}>
                <PlayerIcon {...playersInfo.player2} />
            </div>
            {children}
            <div style={{display: "flex"}}>
                <PlayerIcon {...playersInfo.player1} />
                {displayButtons &&
                    <>
                        <div style={{flex: 1}}>
                        </div>
                        <ButtonPanel/>
                    </>
                }
            </div>
        </>
    )
}