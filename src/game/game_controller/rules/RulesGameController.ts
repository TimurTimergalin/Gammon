import {GameController} from "../GameController.ts";
import {BoardSynchronizer} from "./BoardSynchronizer.ts";
import {Rules} from "../../game_rule/Rules.ts";
import {Color} from "../../color.ts";
import {ControlButtonsState} from "../../ControlButtonsState.ts";
import {CompoundMove, invertCompound, mergeMoves} from "../../board/move.ts";
import {IndexMapper} from "../../game_rule/IndexMapper.ts";
import {DiceState} from "../../dice_state/DiceState.ts";
import {LegalMovesTracker} from "../../LegalMovesTracker.ts";

export abstract class RulesGameController<Index, Prop> implements GameController {
    protected board: BoardSynchronizer<Index, Prop>
    protected controlButtonsState: ControlButtonsState
    protected player!: Color
    protected active: boolean
    protected performedMoves: CompoundMove<Index>[] = []
    protected legalMovesTracker: LegalMovesTracker
    protected diceState: DiceState
    protected rules: Rules<Index, Prop>

    private legalMovesMap: Map<number, CompoundMove<Index>> = new Map()
    private indexMapper: IndexMapper<Index>

    protected constructor(
        {board, controlButtonsState, active, rules, indexMapper, diceState, legalMovesTracker}: {
            board: BoardSynchronizer<Index, Prop>,
            controlButtonsState: ControlButtonsState,
            active: boolean,
            rules: Rules<Index, Prop>,
            indexMapper: IndexMapper<Index>,
            diceState: DiceState,
            legalMovesTracker: LegalMovesTracker
        }
    ) {
        this.board = board;
        this.controlButtonsState = controlButtonsState;
        this.active = active;
        this.rules = rules;
        this.indexMapper = indexMapper;
        this.diceState = diceState;
        this.legalMovesTracker = legalMovesTracker
    }

    abstract endTurn(): void;

    protected checkTurnComplete() {
        const diceArray = this.diceState.toDiceArray()
        this.controlButtonsState.turnComplete = diceArray.length === 0 || this.rules.noMovesLeft(this.board.ruleBoard, this.player)
    }

    calculateDice(): void {
        console.assert(this.diceState.dice1 !== null)
        console.assert(this.diceState.dice2 !== null)

        const dice = this.rules.calculateDiceValues(
            this.board.ruleBoard,
            [
                this.diceState.dice1!.value,
                this.diceState.dice2!.value
            ],
            this.player
        )

        this.diceState.disableDice(dice)
        if (this.active) {
            this.checkTurnComplete()
        }
    }

    calculateLegalMoves(pi: number): void {
        console.assert(this.active)
        const li = this.indexMapper.physicalToLogical(pi)
        const legalMoves = this.rules.getLegalMoves(this.board.ruleBoard, li, this.player, this.diceState.toDiceArray())

        for (const move of legalMoves) {
            const fromP = this.indexMapper.logicalToPhysical(move.primaryMove.to)
            this.legalMovesTracker.add(fromP)
            this.legalMovesMap.set(fromP, move)
        }
    }

    clearLegalMoves(): void {
        this.legalMovesTracker.clear()
        this.legalMovesMap.clear()
    }

    isTouchable(pi: number): boolean {
        if (!this.active) {
            return false
        }
        const li = this.indexMapper.physicalToLogical(pi)
        return this.rules.owns(this.board.ruleBoard, this.player, li)
    }

    isLegal(point: number): boolean {
        console.assert(this.active)
        return this.legalMovesTracker.has(point)
    }

    remove(from: number): void {
        console.assert(this.active)
        this.board.removePhysical(from)
    }

    put(to: number, color: Color): void {
        console.assert(this.active)
        console.assert(this.legalMovesTracker.has(to))
        const move = this.legalMovesMap.get(to)!
        move.additionalMoves.forEach(this.board.performMoveLogical)
        move.dice.forEach(this.diceState.useDice)
        this.board.putPhysical(to, color)
        this.performedMoves.push(move)
        this.controlButtonsState.movesMade = true
        this.checkTurnComplete()
    }

    putBack(to: number, color: Color): void {
        console.assert(this.active)
        this.board.putPhysical(to, color)
    }

    undoMoves(): void {
        console.assert(this.active)
        const invertedMoves = this.performedMoves.map(invertCompound).reverse()

        invertedMoves.forEach(m => m.dice.forEach(this.diceState.addDice))
        invertedMoves.forEach(m => m.additionalMoves.forEach(this.board.performMoveLogical))

        const primaryMoves = invertedMoves.map(m => m.primaryMove)
        const merged = mergeMoves(primaryMoves)
        merged.forEach(this.board.performMoveLogical)
        this.controlButtonsState.movesMade = false
        this.checkTurnComplete()
        this.performedMoves = []
    }
}