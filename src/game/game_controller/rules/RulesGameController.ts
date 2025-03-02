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
import {CubeState, DoubleCubeState} from "../../double_cube_state/DoubleCubeState";

const console = logger("game/game_controller/rules")


export abstract class RulesGameController<Index, Prop> implements GameController {
    protected board: BoardSynchronizer<Index, Prop>
    protected controlButtonsState: ControlButtonsState
    protected _player!: Color
    protected active: boolean
    protected performedMoves: CompoundMove<Index>[] = []
    protected canOfferDouble: boolean = false
    protected previousDoubleState: { state: CubeState, value: number, canOffer: boolean } | undefined = undefined
    protected legalMovesTracker: LegalMovesTracker
    protected diceState: DiceState
    protected rules: Rules<Index, Prop>
    protected boardAnimationSwitch: BoardAnimationSwitch

    private legalMovesMap: Map<number, CompoundMove<Index>> = new Map()
    private indexMapper: IndexMapper<Index>
    private labelState: LabelState
    protected doubleCubeState: DoubleCubeState

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
                this.doubleCubeState.positionMapper = this.doubleCubeState.positionMapper?.flipped()
                this.indexMapper = this.indexMapper.flipped()
                this.board.swapBoard()
            }
        )
    }

    protected _offerDouble() {
        const newValue = this.doubleCubeState.convertedValue * 2

        if (this.player === Color.WHITE) {
            this.doubleCubeState.state = "offered_to_black"
        } else {
            this.doubleCubeState.state = "offered_to_white"
        }
        this.doubleCubeState.value = newValue
    }

    protected _acceptDouble() {
        this.doubleCubeState.state = this.player === Color.WHITE ? "belongs_to_white" : "belongs_to_black"
    }

    protected _canConcedeGame() {
        return (this.player === Color.WHITE && this.doubleCubeState.state === "offered_to_white") ||
            (this.player === Color.BLACK && this.doubleCubeState.state === "offered_to_black") ||
            (this.rules.canConcedePrematurely(this.board.ruleBoard, this.player) &&
                (
                    this.player === Color.WHITE && this.doubleCubeState.state === "belongs_to_white" ||
                    this.player === Color.BLACK && this.doubleCubeState.state === "belongs_to_black" ||
                    this.doubleCubeState.state === "unavailable"
                )
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
            boardAnimationSwitch,
            doubleCubeState
        }: {
            board: BoardSynchronizer<Index, Prop>,
            controlButtonsState: ControlButtonsState,
            active: boolean,
            rules: Rules<Index, Prop>,
            indexMapper: IndexMapper<Index>,
            diceState: DiceState,
            legalMovesTracker: LegalMovesTracker,
            labelState: LabelState,
            boardAnimationSwitch: BoardAnimationSwitch,
            doubleCubeState: DoubleCubeState
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
        this.doubleCubeState = doubleCubeState
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
        if (this.previousDoubleState !== undefined) {
            console.assert(this.performedMoves.length === 0)
            console.assert(this.doubleCubeState.value !== undefined)
            this.doubleCubeState.value = this.previousDoubleState.value
            this.doubleCubeState.state = this.previousDoubleState.state
            this.controlButtonsState.turnComplete = false
            this.controlButtonsState.movesMade = false
            this.controlButtonsState.canRollDice = true
            this.canOfferDouble = this.previousDoubleState.canOffer
            return
        }

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

    offerDouble(): void {
        console.assert(this.doubleCubeState !== undefined)
        this.previousDoubleState = {
            state: this.doubleCubeState.state,
            value: this.doubleCubeState.value!,
            canOffer: true
        }
        this._offerDouble()
        this.controlButtonsState.movesMade = true
        this.controlButtonsState.turnComplete = true
        this.controlButtonsState.canRollDice = false
        this.canOfferDouble = false
    }

    acceptDouble(): void {
        this.previousDoubleState = {
            state: this.doubleCubeState.state,
            value: this.doubleCubeState.value!,
            canOffer: false
        }
        this._acceptDouble()
        this.controlButtonsState.movesMade = true
        this.controlButtonsState.turnComplete = true
    }

    interactWithDouble(): void {
        if (this.canOfferDouble) {
            this.offerDouble()
        } else if (
            (this.player === Color.WHITE && this.doubleCubeState.state === "offered_to_white") ||
            (this.player === Color.BLACK && this.doubleCubeState.state === "offered_to_black")
        ) {
            this.acceptDouble()
            this.controlButtonsState.canConcedeGame = this._canConcedeGame()
        }
    }

    abstract endTurn(): void;

    abstract swapBoard(): void;

    abstract rollDice(): void

    abstract concedeMatch(): void;

    abstract concedeGame(): void;
}