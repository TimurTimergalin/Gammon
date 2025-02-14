import {GameController} from "./GameController";
import {logger} from "../../logging/main";

const console = logger("game/game_controller/dummy")

export class DummyGameController implements GameController {
    calculateLegalMoves(): never {
        console.error("Called", "calculateLegalMoves", "on dummy")
        return undefined as never
    }

    clearLegalMoves(): never {
        console.error("Called", "clearLegalMoves", "on dummy")

        return undefined as never
    }

    endTurn(): never {
        console.error("Called", "endTurn", "on dummy")
        return undefined as never
    }

    isLegal(): never {
        console.error("Called", "isLegal", "on dummy")
        return undefined as never
    }

    isTouchable(): boolean {
        return false;
    }

    put(): never {
        console.error("Called", "put", "on dummy")
        return undefined as never
    }

    quickMove(): never {
        console.error("Called", "quickMove", "on dummy")
        return undefined as never
    }

    putBack(): never {
        console.error("Called", "putBack", "on dummy")
        return undefined as never
    }

    remove(): never {
        console.error("Called", "remove", "on dummy")
        return undefined as never
    }

    undoMoves(): never {
        console.error("Called", "undoMoves", "on dummy")
        return undefined as never
    }

    swapDice(): void {
    }

    swapBoard(): never {
        console.error("Called", "swapBoard", "on dummy")
        return undefined as never
    }

    rollDice(): never {
        console.error("Called", "rollDice", "on dummy")
        return undefined as never
    }
}