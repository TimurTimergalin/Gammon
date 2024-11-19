import {GameController} from "./GameController.ts";
import {Rules} from "../game_rule/Rules.ts";
import {IndexMapping} from "../game_rule/IndexMapping.ts";
import {PropMapping} from "../game_rule/PropMapping.ts";
import {GameState} from "../game_state/GameState.ts";
import {Color} from "../color.ts";
import {LayerStatus} from "../../dice_layer/LayerStatus.ts";
import {
    getSidePieceY,
    getStackDirection,
    getStackOriginX,
    getStackOriginY,
    getStackType,
    getTopDownPieceY
} from "../../dimensions/functions.ts";
import {TopDownStack} from "../../pieces_layer/stacks.tsx";
import {PiecePlacement, PieceState, PositionState} from "../game_state/piece_placement.ts";

export abstract class BaseGameController<PositionIndexType, PositionPropsType> implements GameController {
    abstract endTurn(): void

    abstract init(): void

    protected rules: Rules<PositionIndexType, PositionPropsType>
    protected indexMapping: IndexMapping<PositionIndexType>
    protected propMapping: PropMapping<PositionPropsType>
    protected gameState: GameState
    protected player: Color
    protected active = false

    protected legalMovesMap: Map<number, [[number, number][], number[]]> = new Map()

    protected constructor(
        rules: Rules<PositionIndexType, PositionPropsType>,
        indexMapping: IndexMapping<PositionIndexType>,
        propMapping: PropMapping<PositionPropsType>,
        gameState: GameState,
        player: Color
    ) {
        this.rules = rules
        this.indexMapping = indexMapping
        this.propMapping = propMapping
        this.gameState = gameState
        this.player = player
    }

    private fillLegalMovesMap(logical: [PositionIndexType, [PositionIndexType, PositionIndexType][], number[]][]): void {
        this.legalMovesMap = new Map()
        for (const [to, additionalMoves, diceUsed] of logical) {
            const physicalAdditionalMoves = additionalMoves.map(
                ([from_, to_]): [number, number] =>
                    [this.indexMapping.logicalToPhysical(from_), this.indexMapping.logicalToPhysical(to_)]
            )
            this.legalMovesMap.set(this.indexMapping.logicalToPhysical(to), [physicalAdditionalMoves, diceUsed])
        }
    }

    getLegalMoves(point: number): number[] {  // TODO: заменить на void и менять gameState
        console.assert(this.active)
        const logicalIndex = this.indexMapping.physicalToLogical(point)
        const logicalLegalMoves = this.rules.getLegalMoves(logicalIndex, this.player)
        this.fillLegalMovesMap(logicalLegalMoves)
        return Array.from(this.legalMovesMap.keys())
    }

    isTouchable(point: number): boolean {
        return this.active && this.rules.owns(this.player, this.indexMapping.physicalToLogical(point));
    }

    protected disableDice(availableDice: number[]) {
        console.assert(this.gameState.dice1 !== null)
        console.assert(this.gameState.dice2 !== null)
        const dice1 = this.gameState.dice1!
        const dice2 = this.gameState.dice2!

        this.gameState.apply(
            () => {
                if (dice1.value === dice2.value) {
                    const count = availableDice.length
                    dice1.unavailabilityStatus = count >= 2 ? LayerStatus.NONE : count === 1 ? LayerStatus.HALF : LayerStatus.FULL
                    dice2.unavailabilityStatus = count == 4 ? LayerStatus.NONE : count == 3 ? LayerStatus.HALF : LayerStatus.FULL
                } else {
                    dice1.unavailabilityStatus = availableDice.includes(dice1.value) ? LayerStatus.NONE : LayerStatus.FULL
                    dice2.unavailabilityStatus = availableDice.includes(dice2.value) ? LayerStatus.NONE : LayerStatus.FULL
                }
            }
        )
    }

    protected useDice(diceVal: number) {
        console.assert(this.gameState.dice1 !== null)
        console.assert(this.gameState.dice2 !== null)
        const dice1 = this.gameState.dice1!
        const dice2 = this.gameState.dice2!

        this.gameState.apply(
            () => {
                if (dice1.value === dice2.value) {
                    console.assert(dice1.value === diceVal)
                    const inc = (st: LayerStatus) => (st == LayerStatus.NONE ? LayerStatus.HALF : LayerStatus.FULL)
                    if (dice1.usageStatus === LayerStatus.FULL) {
                        console.assert(dice2.usageStatus !== LayerStatus.FULL)
                        dice2.usageStatus = inc(dice2.usageStatus)
                    } else {
                        dice1.usageStatus = inc(dice1.usageStatus)
                    }
                } else {
                    const targetDice = dice1.value === diceVal ? dice1 : dice2
                    console.assert(targetDice.value === diceVal)
                    console.assert(targetDice.usageStatus === LayerStatus.NONE)
                    targetDice.usageStatus = LayerStatus.FULL
                }
            }
        )

    }

    protected undoUseDice(diceVal: number) {
        console.assert(this.gameState.dice1 !== null)
        console.assert(this.gameState.dice2 !== null)
        const dice1 = this.gameState.dice1!
        const dice2 = this.gameState.dice2!
        if (dice1.value === dice2.value) {
            console.assert(dice1.value === diceVal)
            const dec = (st: LayerStatus) => (st == LayerStatus.FULL ? LayerStatus.HALF : LayerStatus.NONE)
            if (dice1.usageStatus === LayerStatus.FULL) {
                console.assert(dice2.usageStatus !== LayerStatus.NONE)
                dice2.usageStatus = dec(dice2.usageStatus)
            } else {
                dice1.usageStatus = dec(dice1.usageStatus)
            }
        } else {
            const targetDice = dice1.value === diceVal ? dice1 : dice2
            console.assert(targetDice.value === diceVal)
            console.assert(targetDice.usageStatus === LayerStatus.FULL)
            targetDice.usageStatus = LayerStatus.NONE
        }
    }

    protected movePieceFrom(to: number, from: number) {
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

    movePiece(from: number, to: number, color: Color): void {
        console.assert(this.active)
        const legalMoveSaved = this.legalMovesMap.get(to)
        console.assert(legalMoveSaved !== undefined)
        const [additionalMoves, diceUsed] = legalMoveSaved!
        for (const [from_, to_] of additionalMoves) {
            this.movePieceFrom(to_, from_)
        }
        this.gameState.addPiece(to, {color: color})
        for (const diceVal of diceUsed) {
            this.useDice(diceVal)
        }
        this.rules.performMove(
            this.indexMapping.physicalToLogical(from),
            this.indexMapping.physicalToLogical(to),
            additionalMoves.map(
                ([from_, to_]): [PositionIndexType, PositionIndexType] =>
                    [this.indexMapping.physicalToLogical(from_), this.indexMapping.physicalToLogical(to_)]
            ),
            diceUsed
        )
    }

    protected generateDice(): [number, number] {
        const genNum = () => Math.ceil(Math.random() * 6 + 1e-9)
        return [genNum(), genNum()]
    }

    protected setDice(diceValues: [number, number], colors: [Color, Color]) {
        this.gameState.dice1 = {
            value: diceValues[0],
            color: colors[0],
            usageStatus: LayerStatus.NONE,
            unavailabilityStatus: LayerStatus.NONE
        }
        this.gameState.dice2 = {
            value: diceValues[1],
            color: colors[1],
            usageStatus: LayerStatus.NONE,
            unavailabilityStatus: LayerStatus.NONE
        }

        const availableDice = this.rules.calculateDiceValues(diceValues, this.player)
        this.disableDice(availableDice)
    }

    protected setPlacement(placement: Map<PositionIndexType, PositionPropsType>) {
        this.rules.placement = placement
        const colorArrayToPieceState = (color: Color): PieceState => ({color: color})
        const res: PiecePlacement = new Map()
        for (const [key, value] of placement.entries()) {
            res.set(
                this.indexMapping.logicalToPhysical(key),
                new PositionState(this.propMapping.logicalToPhysical(value).map(colorArrayToPieceState))
            )
        }
        this.gameState.setPiecePlacement(res)
    }
}