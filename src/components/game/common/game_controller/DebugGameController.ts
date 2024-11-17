import {GameController} from "./GameController.ts";
import {GameState} from "../game_state/GameState.ts";
import {Color} from "../../color.ts";
import {LayerStatus} from "../../dice_layer/LayerStatus.ts";
import {DiceState} from "../game_state/DiceState.ts";
import {
    getSidePieceY,
    getStackDirection,
    getStackOriginX,
    getStackOriginY,
    getStackType,
    getTopDownPieceY
} from "../../dimensions/functions.ts";
import {TopDownStack} from "../../pieces_layer/stacks.tsx";

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

    getLegalMoves(point: number): number[] {
        return [...Array(30).keys()].filter(x => x != point);
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isTouchable(_point: number): boolean {
        return true;
    }

    movePiece(to: number, color: Color): void {
        this.gameState.addPiece(to, {color: color})
    }

    movePieceFrom(to: number, from: number) {
        const fromProps = this.gameState.getPositionProps(from)
        const fromTotal = fromProps.quantity
        const fromX = getStackOriginX(from)
        let fromY: number
        if (getStackType(from) == TopDownStack) {
            fromY = getTopDownPieceY(getStackOriginY(from), getStackDirection(from), fromTotal - 1, fromTotal)
        } else {
            fromY = getSidePieceY(getStackOriginY(from), getStackDirection(from), fromTotal - 1)
        }
        const {color} = this.gameState.removePiece(from)
        this.gameState.addPiece(to, {color: color, from: {x: fromX, y: fromY}})
    }
}