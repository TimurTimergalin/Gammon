import {GameState} from "../../game_state/GameState.ts";
import {Color} from "../../color.ts";
import {PositionState} from "../../game_state/piece_placement.ts";
import {DummyController} from "../DummyController.ts";

const filledStack = (color: Color) => new PositionState(Array.from(Array(15).keys()).map(() => ({color: color})))

const dummyPlacement = new Map([
    [24, filledStack(Color.WHITE)],
    [29, filledStack(Color.BLACK)]
])

export const syncDummyGameControllerFactory = (gameState: GameState) => new DummyController(dummyPlacement, gameState)

export async function dummyGameControllerFactory(gameState: GameState) {
    return syncDummyGameControllerFactory(gameState)
}