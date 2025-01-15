import {useFactoryRef} from "../../hooks.ts";
import {ControlButtonsState} from "../../game/ControlButtonsState.ts";
import {HoverTracker} from "../../game/HoverTracker.ts";
import {ReactNode} from "react";
import {PlayersInfo} from "../../game/player_info/PlayersInfo.ts";
import {DragState} from "../../game/drag_state/DragState.ts";
import {DiceState} from "../../game/dice_state/DiceState.ts";
import {PhysicalBoard} from "../../game/board/physical/PhysicalBoard.ts";
import {LegalMovesTracker} from "../../game/LegalMovesTracker.ts";
import {GameContext, GameContextProvider} from "../../game/GameContext.ts";
import {DummyGameController} from "../../game/game_controller/DummyGameController.ts";

export const GameContextHolder = ({children}: { children: ReactNode | ReactNode[] }) => {
    const controlButtonsState = useFactoryRef(() => new ControlButtonsState())
    const hoverTracker = useFactoryRef(() => new HoverTracker())
    const gameControllerRef = useFactoryRef(() => new DummyGameController())
    const playersInfo = useFactoryRef(() => {
        const defaultPlayer1 = {
            username: "Игрок 1",
            iconSrc: "/user_icon_placeholder.svg"
        }

        const defaultPlayer2 = {
            username: "Игрок 2",
            iconSrc: "/user_icon_placeholder.svg"
        }
        return new PlayersInfo(defaultPlayer1, defaultPlayer2)
    })
    const dragState = useFactoryRef(() => new DragState())
    const diceState = useFactoryRef(() => new DiceState())
    const boardState = useFactoryRef(() => new PhysicalBoard())
    const legalMovesTracker = useFactoryRef(() => new LegalMovesTracker())

    const gameContext = useFactoryRef(() => new GameContext({
        controlButtonsState: controlButtonsState,
        hoverTracker: hoverTracker,
        boardState: boardState,
        diceState: diceState,
        dragState: dragState,
        gameController: gameControllerRef,
        legalMovesTracker: legalMovesTracker,
        playersInfo: playersInfo
    }))

    return (
        <GameContextProvider value={gameContext.current}>
            {children}
        </GameContextProvider>
    )
}