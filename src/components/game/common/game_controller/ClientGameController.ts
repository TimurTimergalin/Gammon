import {GameController} from "./GameController.ts";
import {GameState} from "../game_state/GameState.ts";
import {Color} from "../../color.ts";
import {LayerStatus} from "../../dice_layer/LayerStatus.ts";
import {DiceState} from "../game_state/DiceState.ts";

export default class ClientGameController implements GameController {  // For dev purposes only
    gameState: GameState
    color: Color

    constructor(gameState: GameState, color: Color) {
        this.gameState = gameState
        this.color = color
    }

    getNewDice() {
        const dice1: DiceState = {  // TODO: генерировать кости
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

    isTouchable(point: number): boolean {
        const pointProp = this.gameState.getPositionProps(point)
        return pointProp.pieces.length != 0
    }

    getLegalMoves(point: number): number[] {
        return [...Array(30).keys()]
            .filter(
                (i) => {
                    if (i === point) {
                        return false
                    }
                    const pointProp = this.gameState.getPositionProps(i)
                    if (pointProp.pieces.length === 0) {
                        return true
                    }
                    const last = pointProp.pieces[pointProp.pieces.length - 1]
                    return last.color === this.color
                }
            )
    }
}