import {ControlButtonsState} from "./ControlButtonsState.ts";
import {HoverTracker} from "./HoverTracker.ts";
import {createContext, MutableRefObject, RefObject, useContext} from "react";
import {forceType} from "../common/typing.ts";
import {PlayersInfo} from "./player_info/PlayersInfo.ts";
import {DragState} from "./drag_state/DragState.ts";
import {DiceState} from "./dice_state/DiceState.ts";
import {PhysicalBoard} from "./board/physical/PhysicalBoard.ts";
import {LegalMovesTracker} from "./LegalMovesTracker.ts";
import {GameController} from "./game_controller/GameController.ts";
import {LabelState} from "./LabelState.ts";

type Setter<T> = {
    set(_: T): void
}

export class GameContext {
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
                    labelMapperHolder
                }: {
                    controlButtonsState: RefObject<ControlButtonsState>,
                    hoverTracker: RefObject<HoverTracker>,
                    gameController: MutableRefObject<GameController>,
                    playersInfo: RefObject<PlayersInfo>,
                    dragState: RefObject<DragState>,
                    diceState: RefObject<DiceState>,
                    boardState: RefObject<PhysicalBoard>,
                    legalMovesTracker: RefObject<LegalMovesTracker>,
                    labelMapperHolder: RefObject<LabelState>
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

        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outer = this
        this._gameControllerSetter = {set: (gc) => outer._gameController.current = gc}
    }
}

const Context = createContext<GameContext | null>(null)
export const GameContextProvider = Context.Provider

export function useGameContext<T extends keyof GameContext>(member: T): GameContext[T] {
    const res = useContext(Context)!
    return new Proxy(res, {
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
}

export function useFullGameContext(): GameContext {
    return useContext(Context)!
}
