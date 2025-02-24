import {GameController} from "../GameController";
import {Rules} from "../../game_rule/Rules";
import {Color} from "../../../common/color";
import {ControlButtonsState} from "../../control_buttons_state/ControlButtonsState";
import {CompoundMove, invertCompound, mergeMoves} from "../../board/move";
import {IndexMapper} from "../../game_rule/IndexMapper";
import {DiceState} from "../../dice_state/DiceState";
import {LegalMovesTracker} from "../../legal_moves_tracker/LegalMovesTracker";
import {LabelState} from "../../label_state/LabelState";
import {logger} from "../../../logging/main";
import {BoardSynchronizer} from "../../board/BoardSynchronizer";
import {BoardAnimationSwitch} from "../../board_animation_switch/BoardAnimationSwitch";

const console = logger("game/game_controller/rules")


export abstract class RulesGameController<Index, Prop> implements GameController {
    protected board: BoardSynchronizer<Index, Prop>
    protected controlButtonsState: ControlButtonsState
    protected _player!: Color
    protected active: boolean
    protected performedMoves: CompoundMove<Index>[] = []
    protected legalMovesTracker: LegalMovesTracker
    protected diceState: DiceState
    protected rules: Rules<Index, Prop>
    protected boardAnimationSwitch: BoardAnimationSwitch

    private legalMovesMap: Map<number, CompoundMove<Index>> = new Map()
    private indexMapper: IndexMapper<Index>
    private labelState: LabelState

    protected get player(): Color {
        return this._player
    }

    protected set player(color: Color) {
        this._player = color
        this.labelState.color = color
    }

    protected _swapBoard() {
        this.boardAnimationSwitch.withTurnedOff(
            () => {
                this.labelState.labelMapper = this.labelState.labelMapper?.flipped()
                this.indexMapper = this.indexMapper.flipped()
                this.board.swapBoard()
            }
        )
    }

    protected constructor(
        {
            board,
            controlButtonsState,
            active,
            rules,
            indexMapper,
            diceState,
            legalMovesTracker,
            labelState,
            boardAnimationSwitch
        }: {
            board: BoardSynchronizer<Index, Prop>,
            controlButtonsState: ControlButtonsState,
            active: boolean,
            rules: Rules<Index, Prop>,
            indexMapper: IndexMapper<Index>,
            diceState: DiceState,
            legalMovesTracker: LegalMovesTracker,
            labelState: LabelState,
            boardAnimationSwitch: BoardAnimationSwitch
        }
    ) {
        this.board = board;
        this.controlButtonsState = controlButtonsState;
        this.active = active;
        this.rules = rules;
        this.indexMapper = indexMapper;
        this.diceState = diceState;
        this.legalMovesTracker = legalMovesTracker
        this.labelState = labelState
        this.boardAnimationSwitch = boardAnimationSwitch
    }

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

    calculateLegalMoves(pi: number): number[] {
        console.assert(this.active)
        console.debug("Legal moves calculating from", pi)
        const li = this.indexMapper.physicalToLogical(pi)
        const legalMoves = this.rules.getLegalMoves(this.board.ruleBoard, li, this.player, this.diceState.toDiceArray())
        console.debug(legalMoves)

        const res = []
        this.legalMovesMap.clear()
        for (const move of legalMoves) {
            const toP = this.indexMapper.logicalToPhysical(move.primaryMove.to)
            res.push(toP)
            this.legalMovesMap.set(toP, move)
        }
        return res
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

    quickMove(from: number): void {
        console.assert(this.active)
        console.debug(this.legalMovesMap)
        const fromL = this.indexMapper.physicalToLogical(from)
        const diceArray = this.diceState.toDiceArray()
        for (const dice of diceArray) {
            const shifted = this.rules.movedBy(fromL, dice, this.player)
            const shiftedP = this.indexMapper.logicalToPhysical(shifted)
            if (this.legalMovesMap.has(shiftedP)) {
                const move = this.legalMovesMap.get(shiftedP)!
                console.assert(move.primaryMove.from === fromL)
                move.additionalMoves.forEach(this.board.performMoveLogical)
                move.dice.forEach(this.diceState.useDice)
                this.board.performMoveLogical(move.primaryMove)
                this.performedMoves.push(move)
                this.controlButtonsState.movesMade = true
                this.checkTurnComplete()
                return
            }
        }
    }

    putBack(to: number, color: Color): void {
        console.assert(this.active)
        this.board.putPhysical(to, color)
    }

    undoMoves(): void {
        console.assert(this.active)
        const invertedMoves = this.performedMoves.map(invertCompound).reverse()

        invertedMoves.forEach(m => m.dice.forEach(this.diceState.addDice))

        const primaryMoves = invertedMoves.map(m => m.primaryMove)
        const merged = mergeMoves(primaryMoves)
        merged.forEach(this.board.performMoveLogical)
        invertedMoves.forEach(m => m.additionalMoves.forEach(this.board.performMoveLogical))
        this.controlButtonsState.movesMade = false
        this.checkTurnComplete()
        this.performedMoves = []
    }

    swapDice = (): void => {
        if (!this.active) {
            return
        }
        this.diceState.swapDice()
    }

    abstract endTurn(): void;

    abstract swapBoard(): void;

    abstract rollDice(): void
}