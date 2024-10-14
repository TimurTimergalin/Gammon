import {GameController} from "./GameController.ts";
import {DiceState, GameState} from "../common/GameState.ts";
import {Color, oppositeColor} from "../color.ts";
import {LayerStatus} from "../dice_layer/LayerStatus.ts";

export default class ClientGameController implements GameController {  // For dev purposes only
    gameState: GameState
    color: Color

    constructor(gameState: GameState, color: Color) {
        this.gameState = gameState
        this.color = color
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

    isTouchable(point: number): boolean {
        const pointProp = this.gameState.piecePlacement.get(point)
        return pointProp !== undefined && pointProp.color === this.color
    }

    getLegalMoves(point: number): number[] {
        return [...Array(30).keys()]
            .filter(
                (i) => {
                    if (i === point) {
                        return false
                    }
                    const pointProp = this.gameState.piecePlacement.get(i)
                    return pointProp === undefined || pointProp.color !== oppositeColor(this.color)
                }
            )
    }
}