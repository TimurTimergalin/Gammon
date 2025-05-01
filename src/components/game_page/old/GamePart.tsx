import {PlayerState} from "../../../game/player_info/PlayerState";
import {useGameContext} from "../../../game/GameContext";
import {CSSProperties, ReactNode, useEffect} from "react";
import {PlayerIcon} from "../../game/players/PlayerIcon";
import {ButtonPanel} from "../../game/buttons/ButtonPanel";
import {observer} from "mobx-react-lite";
import {ImgCacheProvider} from "../../game/img_cache/provider";
import {Timer} from "../../game/timer/Timer";

export const GamePart = observer(function GamePart(
    {player1, player2, children, displayControls = false, displayTimer = false}: {
    player1?: PlayerState,
    player2?: PlayerState,
    children: ReactNode,
    displayControls?: boolean,
    displayTimer?: boolean
}) {
    const playersInfo = useGameContext("playersInfo")

    const timerContainerStyle: CSSProperties = {
        position: "absolute",
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        width: "fit-content"
    }

    useEffect(() => {
        playersInfo.player1 = player1 || playersInfo.player1
        playersInfo.player2 = player2 || playersInfo.player2
    }, [player1, player2, playersInfo]);

    return (
        <ImgCacheProvider>
            <div style={{display: "flex", marginBottom: 6, position: "relative"}}>
                <PlayerIcon {...playersInfo.player2} />
                {displayTimer &&
                    <div style={timerContainerStyle}>
                        <Timer index={0} />
                    </div>
                }
            </div>
            {children}
            <div style={{display: "flex", position: "relative"}}>
                <PlayerIcon {...playersInfo.player1} />
                {displayTimer &&
                    <div style={timerContainerStyle}>
                        <Timer index={1}/>
                    </div>
                }
                {displayControls &&
                    <>
                        <div style={{flex: 1}}>
                        </div>
                        <ButtonPanel/>
                    </>
                }
            </div>
        </ImgCacheProvider>
    )
})