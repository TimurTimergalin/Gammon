import {PlayerState} from "../../game/player_info/PlayerState";
import {useGameContext} from "../../game/GameContext";
import {ReactNode, useEffect} from "react";
import {PlayerIcon} from "../game/players/PlayerIcon";
import {ButtonPanel} from "../game/buttons/ButtonPanel";
import {observer} from "mobx-react-lite";
import {ImgCacheProvider} from "../game/img_cache/provider";

export const GamePart = observer(function GamePart({player1, player2, children, displayButtons = false}: {
    player1?: PlayerState,
    player2?: PlayerState,
    children: ReactNode,
    displayButtons?: boolean
}) {
    const playersInfo = useGameContext("playersInfo")

    useEffect(() => {
        playersInfo.player1 = player1 || playersInfo.player1
        playersInfo.player2 = player2 || playersInfo.player2
    }, [player1, player2, playersInfo]);

    return (
        <ImgCacheProvider>
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
        </ImgCacheProvider>
    )
})