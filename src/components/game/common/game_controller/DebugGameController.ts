import {GameController} from "./GameController.ts";
import {GameState} from "../game_state/GameState.ts";
import {Color} from "../color.ts";
import {LayerStatus} from "../../dice_layer/LayerStatus.ts";
import {DiceState} from "../game_state/DiceState.ts";

export default class DebugGameController implements GameController {
    gameState: GameState

    constructor(gameState: GameState) {
        this.gameState = gameState;
    }

    endTurn() {
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

    getLegalMoves(point: number): number[] {
        return [...Array(30).keys()].filter(x => x != point);
    }

    isTouchable(): boolean {
        return true;
    }

    movePiece(_from: number, to: number, color: Color): void {
        this.gameState.addPiece(to, {color: color})
    }

    init(): void {
    }
}