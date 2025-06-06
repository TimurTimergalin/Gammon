import {useFactoryRef} from "../../common/hooks";
import {ControlButtonsState} from "../../game/control_buttons_state/ControlButtonsState";
import {HoverTracker} from "../../game/hover_tracker/HoverTracker";
import {ReactNode} from "react";
import {PlayersInfo} from "../../game/player_info/PlayersInfo";
import {DragState} from "../../game/drag_state/DragState";
import {DiceState} from "../../game/dice_state/DiceState";
import {PhysicalBoard} from "../../game/board/physical/PhysicalBoard";
import {LegalMovesTracker} from "../../game/legal_moves_tracker/LegalMovesTracker";
import {GameContext, GameContextProvider} from "../../game/GameContext";
import {DummyGameController} from "../../game/game_controller/DummyGameController";
import {LabelState} from "../../game/label_state/LabelState";
import {EndWindowState} from "../../game/end_window_state/EndWindowState";
import {BoardAnimationSwitch} from "../../game/board_animation_switch/BoardAnimationSwitch";
import {ScoreState} from "../../game/score_state/ScoreState";
import {DoubleCubeState} from "../../game/double_cube_state/DoubleCubeState";
import {GameHistoryState} from "../../game/game_history_state/GameHistoryState";
import {TimerPairState} from "../../game/timer_state/TimerPairState";

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
    const endWindowState = useFactoryRef(() => new EndWindowState())
    const boardAnimationSwitch = useFactoryRef(() => new BoardAnimationSwitch(true))
    const scoreState = useFactoryRef(() => new ScoreState({white: 0, black: 0, total: 0}))
    const doubleCubeState = useFactoryRef(() => new DoubleCubeState({}))
    const gameHistoryState = useFactoryRef(() => new GameHistoryState())
    const timerPairState = useFactoryRef(() => new TimerPairState())

    const gameContext = useFactoryRef(() => new GameContext({
        controlButtonsState: controlButtonsState,
        hoverTracker: hoverTracker,
        boardState: boardState,
        diceState: diceState,
        dragState: dragState,
        gameController: gameControllerRef,
        legalMovesTracker: legalMovesTracker,
        playersInfo: playersInfo,
        labelMapperHolder: labelMapperHolder,
        endWindowState: endWindowState,
        boardAnimationSwitch: boardAnimationSwitch,
        scoreState: scoreState,
        doubleCubeState: doubleCubeState,
        gameHistoryState: gameHistoryState,
        timerPairState: timerPairState
    }))

    return (
        <GameContextProvider value={gameContext.current}>
            {children}
        </GameContextProvider>
    )
}