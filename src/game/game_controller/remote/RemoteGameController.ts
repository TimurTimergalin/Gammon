import {RulesGameController} from "../rules/RulesGameController.ts";
import {BoardSynchronizer} from "../rules/BoardSynchronizer.ts";
import {ControlButtonsState} from "../../ControlButtonsState.ts";
import {IndexMapper} from "../../game_rule/IndexMapper.ts";
import {DiceState} from "../../dice_state/DiceState.ts";
import {LegalMovesTracker} from "../../LegalMovesTracker.ts";
import {Rules} from "../../game_rule/Rules.ts";
import {RemoteConnector} from "./RemoteConnector.ts";
import {Color, oppositeColor} from "../../color.ts";
import {mergeMoves, Move} from "../../board/move.ts";
import {LayerStatus} from "../../../components/game/dice_layer/LayerStatus.ts";

export class RemoteGameController<Index, Prop> extends RulesGameController<Index, Prop> {
    private connector: RemoteConnector<Index>
    private readonly userPlayer: Color

    constructor({connector, userPlayer, ...base}: {
        board: BoardSynchronizer<Index, Prop>,
        controlButtonsState: ControlButtonsState,
        active: boolean,
        rules: Rules<Index, Prop>,
        indexMapper: IndexMapper<Index>,
        diceState: DiceState,
        legalMovesTracker: LegalMovesTracker,
        connector: RemoteConnector<Index>,
        userPlayer: Color
    }) {
        super(base);
        this.connector = connector
        this.userPlayer = userPlayer
    }

    private splitMove(move: Move<Index>, diceUsed: number[], player: Color): Move<Index>[] {
        const res = []

        let from = move.from
        for (const dice of diceUsed) {
            const to = this.rules.movedBy(from, dice, player)
            res.push({
                from: from,
                to: to
            })
            from = to
        }
        console.assert(from === move.to)
        return res
    }

    endTurn = (): void => {
        console.assert(this.player === this.userPlayer)
        console.assert(this.active)
        const splitMoves = this.performedMoves
            .flatMap(m => this.splitMove(m.primaryMove, m.dice, this.player))
        this.connector.makeMove(splitMoves)
        this.controlButtonsState.turnComplete = false
        this.controlButtonsState.movesMade = false
        this.performedMoves = []
        this.active = false
        this.player = oppositeColor(this.player)
    };

    onMovesMade = (moves: Move<Index>[]) => {
        const merged = mergeMoves(moves)
        merged.forEach(this.board.performMoveLogical)
    };

    onNewDice = (dice: [number, number], player: Color) => {
        this.diceState.dice1 = {
            value: dice[0],
            color: player,
            unavailabilityStatus: LayerStatus.NONE,
            usageStatus: LayerStatus.NONE
        }

        this.diceState.dice2 = {
            value: dice[1],
            color: player,
            unavailabilityStatus: LayerStatus.NONE,
            usageStatus: LayerStatus.NONE
        }

        if (player === this.userPlayer) {
            this.active = true
        }

        this.calculateDice()
    };

    onEnd = (winner: Color) => {
        console.log("The game has ended with the winner: " + winner)
    };
}