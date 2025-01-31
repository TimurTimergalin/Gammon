import {useFactoryRef} from "../../common/hooks";
import {ControlButtonsState} from "../../game/ControlButtonsState";
import {HoverTracker} from "../../game/HoverTracker";
import {ReactNode} from "react";
import {PlayersInfo} from "../../game/player_info/PlayersInfo";
import {DragState} from "../../game/drag_state/DragState";
import {DiceState} from "../../game/dice_state/DiceState";
import {PhysicalBoard} from "../../game/board/physical/PhysicalBoard";
import {LegalMovesTracker} from "../../game/LegalMovesTracker";
import {GameContext, GameContextProvider} from "../../game/GameContext";
import {DummyGameController} from "../../game/game_controller/DummyGameController";
import {LabelState} from "../../game/LabelState";

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
    const labelMapperHolder = useFactoryRef(() => new LabelState())

    const gameContext = useFactoryRef(() => new GameContext({
        controlButtonsState: controlButtonsState,
        hoverTracker: hoverTracker,
        boardState: boardState,
        diceState: diceState,
        dragState: dragState,
        gameController: gameControllerRef,
        legalMovesTracker: legalMovesTracker,
        playersInfo: playersInfo,
        labelMapperHolder: labelMapperHolder
    }))

    return (
        <GameContextProvider value={gameContext.current}>
            {children}
        </GameContextProvider>
    )
}