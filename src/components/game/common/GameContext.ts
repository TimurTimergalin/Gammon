import {GameState} from "./game_state/GameState.ts";
import {HoverTracker} from "./HoverTracker.ts";
import {GameController} from "./game_controller/GameController.ts";
import {createContext, useContext} from "react";

export class GameContext {
    gameState: GameState
    hoverTracker: HoverTracker
    gameController: GameController

    constructor(gameState: GameState, hoverTracker: HoverTracker, gameController: GameController) {
        this.gameState = gameState;
        this.hoverTracker = hoverTracker;
        this.gameController = gameController;
    }
}

const Context = createContext<GameContext | null>(null)
export const GameContextProvider = Context.Provider

export function useGameContext<T extends keyof GameContext>(member: T): GameContext[T] {
    return useContext(Context)![member]
}
