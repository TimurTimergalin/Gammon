import {GameController} from "./GameController.ts";
import {DiceState, GameState} from "../GameState.ts";
import {Color} from "../../color.ts";
import {LayerStatus} from "../../dice_layer/LayerStatus.ts";

export default class DebugGameController implements GameController {
    gameState: GameState

    constructor(gameState: GameState) {
        this.gameState = gameState;
    }

    getNewDice() {
        const dice1: DiceState = {
            value: 3,
            color: Color.WHITE,
            usageStatus: LayerStatus.NONE,
            unavailabilityStatus: LayerStatus.FULL
        }

        const dice2: DiceState = {
            value: 4,
            color: Color.BLACK,
            usageStatus: LayerStatus.HALF,
            unavailabilityStatus: LayerStatus.HALF
        }

        this.gameState.dice1 = dice1
        this.gameState.dice2 = dice2
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getLegalMoves(_point: number): number[] {
        return [...Array(30).keys()];
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isTouchable(_point: number): boolean {
        return true;
    }


}