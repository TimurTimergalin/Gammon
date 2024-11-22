import {GameController} from "./GameController.ts";
import {PiecePlacement} from "../game_state/piece_placement.ts";
import {GameState} from "../game_state/GameState.ts";

export class DummyController implements GameController {
    private readonly placement: PiecePlacement
    private gameState: GameState

    constructor(placement: PiecePlacement, gameState: GameState) {
        this.placement = placement;
        this.gameState = gameState;
    }

    init() {
        this.gameState.piecePlacement = this.placement
    }

    isTouchable(): boolean {
        return false;
    }

    undoMoves(): never {
        throw Error("undoMoves of dummy controller should never be called")
    }

    endTurn(): never {
        throw Error("endTurn of dummy controller should never be called")
    }

    getLegalMoves(): never {
        throw Error("getLegalMoves of dummy controller should never be called")
    }

    movePiece(): never {
        throw Error("movePiece of dummy controller should never be called")
    }
}