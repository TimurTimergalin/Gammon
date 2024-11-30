import {GameState} from "./game_state/GameState.ts";
import {HoverTracker} from "./HoverTracker.ts";
import {GameController} from "./game_controller/GameController.ts";
import {createContext, RefObject, useContext} from "react";
import {forceType} from "../../../typing.ts";

export class GameContext {
    get gameController(): GameController {
        return this._gameController.current!;
    }
    get hoverTracker(): HoverTracker {
        return this._hoverTracker.current!;
    }
    get gameState(): GameState {
        return this._gameState.current!;
    }
    private _gameState: RefObject<GameState>
    private _hoverTracker: RefObject<HoverTracker>
    private _gameController: RefObject<GameController>

    constructor(gameState: RefObject<GameState>, hoverTracker: RefObject<HoverTracker>, gameController: RefObject<GameController>) {
        this._gameState = gameState;
        this._hoverTracker = hoverTracker;
        this._gameController = gameController;
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
                return target[member][prop];
            }
        },
        set(target, prop, value) {
            if (prop in target[member]) {
                forceType<keyof GameContext[T]>(prop)
                target[member][prop] = value
                return true
            }
            return false
        }
    }) as unknown as GameContext[T]
}
