import {ControlButtonsState} from "./control_buttons_state/ControlButtonsState";
import {HoverTracker} from "./hover_tracker/HoverTracker";
import {createContext, MutableRefObject, RefObject, useContext} from "react";
import {forceType} from "../common/typing";
import {PlayersInfo} from "./player_info/PlayersInfo";
import {DragState} from "./drag_state/DragState";
import {DiceState} from "./dice_state/DiceState";
import {PhysicalBoard} from "./board/physical/PhysicalBoard";
import {LegalMovesTracker} from "./legal_moves_tracker/LegalMovesTracker";
import {GameController} from "./game_controller/GameController";
import {LabelState} from "./label_state/LabelState";
import {EndWindowState} from "./end_window_state/EndWindowState";
import {BoardAnimationSwitch} from "./board_animation_switch/BoardAnimationSwitch";
import {ScoreState} from "./score_state/ScoreState";
import {useFactoryRef} from "../common/hooks";
import {DoubleCubeState} from "./double_cube_state/DoubleCubeState";
import {GameHistoryState} from "./game_history_state/GameHistoryState";

type Setter<T> = {
    set(_: T): void
}

export class GameContext {
    get gameHistoryState(): GameHistoryState {
        return this._gameHistoryState.current!;
    }

    get doubleCubeState(): DoubleCubeState {
        return this._doubleCubeState.current!;
    }

    get scoreState(): ScoreState {
        return this._scoreState.current!;
    }

    get boardAnimationSwitch(): BoardAnimationSwitch {
        return this._boardAnimationSwitch.current!;
    }

    get endWindowState(): EndWindowState {
        return this._endWindowState.current!;
    }

    get labelState(): LabelState {
        return this._labelState.current!;
    }

    get legalMovesTracker(): LegalMovesTracker {
        return this._legalMovesTracker.current!;
    }

    get boardState(): PhysicalBoard {
        return this._boardState.current!;
    }

    get diceState(): DiceState {
        return this._diceState.current!;
    }

    get dragState(): DragState {
        return this._dragState.current!;
    }

    get playersInfo(): PlayersInfo {
        return this._playersInfo.current!;
    }

    get gameController(): GameController {
        return this._gameController.current!;
    }

    get gameControllerSetter(): Setter<GameController> {
        return this._gameControllerSetter;
    }

    get hoverTracker(): HoverTracker {
        return this._hoverTracker.current!;
    }

    get controlButtonsState(): ControlButtonsState {
        return this._controlButtonsState.current!;
    }

    private _controlButtonsState: RefObject<ControlButtonsState>
    private _hoverTracker: RefObject<HoverTracker>
    private _labelState: RefObject<LabelState>
    private _playersInfo: RefObject<PlayersInfo>
    private _dragState: RefObject<DragState>
    private _diceState: RefObject<DiceState>
    private _boardState: RefObject<PhysicalBoard>
    private _legalMovesTracker: RefObject<LegalMovesTracker>
    private _endWindowState: RefObject<EndWindowState>
    private _boardAnimationSwitch: RefObject<BoardAnimationSwitch>
    private _scoreState: RefObject<ScoreState>
    private _doubleCubeState: RefObject<DoubleCubeState>
    private _gameHistoryState: RefObject<GameHistoryState>

    private _gameController: MutableRefObject<GameController>
    private readonly _gameControllerSetter: Setter<GameController>

    constructor({
                    controlButtonsState,
                    hoverTracker,
                    gameController,
                    playersInfo,
                    dragState,
                    diceState,
                    boardState,
                    legalMovesTracker,
                    labelMapperHolder,
                    endWindowState,
                    boardAnimationSwitch,
                    scoreState,
                    doubleCubeState,
                    gameHistoryState
                }: {
                    controlButtonsState: RefObject<ControlButtonsState>,
                    hoverTracker: RefObject<HoverTracker>,
                    gameController: MutableRefObject<GameController>,
                    playersInfo: RefObject<PlayersInfo>,
                    dragState: RefObject<DragState>,
                    diceState: RefObject<DiceState>,
                    boardState: RefObject<PhysicalBoard>,
                    legalMovesTracker: RefObject<LegalMovesTracker>,
                    labelMapperHolder: RefObject<LabelState>,
                    endWindowState: RefObject<EndWindowState>,
                    boardAnimationSwitch: RefObject<BoardAnimationSwitch>,
                    scoreState: RefObject<ScoreState>,
                    doubleCubeState: RefObject<DoubleCubeState>,
                    gameHistoryState: RefObject<GameHistoryState>
                }
    ) {
        this._controlButtonsState = controlButtonsState;
        this._hoverTracker = hoverTracker;
        this._gameController = gameController;
        this._labelState = labelMapperHolder
        this._playersInfo = playersInfo
        this._dragState = dragState
        this._diceState = diceState
        this._boardState = boardState
        this._legalMovesTracker = legalMovesTracker
        this._endWindowState = endWindowState
        this._boardAnimationSwitch = boardAnimationSwitch
        this._scoreState = scoreState
        this._doubleCubeState = doubleCubeState
        this._gameHistoryState = gameHistoryState

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outer = this
        this._gameControllerSetter = {set: (gc) => outer._gameController.current = gc}
    }
}

const Context = createContext<GameContext | null>(null)
export const GameContextProvider = Context.Provider

export function useGameContext<T extends keyof GameContext>(member: T): GameContext[T] {
    const res = useContext(Context)!
    console.assert(res !== undefined)
    const proxyRef = useFactoryRef(
        () => new Proxy(res, {
            get(target, prop) {
                if (prop in target[member]) {
                    forceType<keyof GameContext[T]>(prop)
                    return target[member]![prop];
                }
            },
            set(target, prop, value) {
                if (prop in target[member]) {
                    forceType<keyof GameContext[T]>(prop)
                    target[member]![prop] = value
                    return true
                }
                return false
            }
        }) as unknown as GameContext[T]
    )

    return proxyRef.current
}

export function useFullGameContext(): GameContext {
    return useContext(Context)!
}
