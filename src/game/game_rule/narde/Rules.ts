import {Rules} from "../Rules";
import {
    allIndices,
    getStore,
    getValue,
    indicesOf,
    isHead,
    isHome,
    isStore,
    NardeIndex,
    NardeProp
} from "../../board/narde/types";
import {Board} from "../../board/Board";
import {Color, oppositeColor} from "../../../common/color";
import {forceType} from "../../../common/typing";
import {CompoundMove, Move} from "../../board/move";
import {NardeBoard} from "../../board/narde/NardeBoard";


export class NardeRules implements Rules<NardeIndex, NardeProp> {
    owns(board: Board<NardeIndex, NardeProp>, player: Color, position: NardeIndex): boolean {
        const positionProp = board.get(position)
        return positionProp !== undefined && positionProp.color === player
    }

    movedBy(from: NardeIndex, by: number, player: Color): NardeIndex {
        console.assert(!isStore(from))
        forceType<number>(from)
        const res = from - by
        if (player == Color.WHITE) {
            if (res <= 0) {
                return "White Store"
            }
            return res
        }
        if (from <= 12 && res <= 0) {
            return 24 + res
        }
        if (from > 12 && res < 13) {
            return "Black Store"
        }
        return res
    }

    noMovesLeft(board: Board<NardeIndex, NardeProp>, player: Color): boolean {
        let prop
        if (player === Color.WHITE) {
            prop = board.get("White Store")
        } else {
            prop = board.get("Black Store")
        }

        return prop !== undefined && prop.quantity === 15
    }

    squashMoves(moves: Move<NardeIndex>[]): Move<NardeIndex>[][] {
        return moves.map(x => [x])
    }

    calculatePoints(board: Board<NardeIndex, NardeProp>, winner: Color): number {
        console.assert(this.noMovesLeft(board, winner))

        const loser = oppositeColor(winner)
        const store = board.get(getStore(loser))
        if (store !== undefined) {
            console.assert(store.quantity > 0)
            return 1
        }
        return 2
    }

    canConcedePrematurely(board: Board<NardeIndex, NardeProp>, player: Color): boolean {
        return board.get(getStore(player)) !== undefined
    }

    private canMoveToStore(board: NardeBoard, player: Color): boolean {
        for (let i = 1; i <= 24; ++i) {
            if (isHome(i, player)) {
                continue
            }
            const pos = board.get(i)
            if (pos !== undefined && pos.color === player) {
                return false
            }
        }
        return true
    }

    private isHomeMaxPosition(board: NardeBoard, ind: NardeIndex, player: Color) {
        if (!isHome(ind, player)) {
            return false
        }

        const boundary = player === Color.WHITE ? 6 : 18
        for (let i = (ind as number) + 1; i <= boundary; ++i) {
            if (this.owns(board, player, i)) {
                return false
            }
        }
        return true
    }

    private isIllegalBlock(board: NardeBoard, blockingPlayer: Color): boolean {
        const blockedPlayer = oppositeColor(blockingPlayer)
        let blockSequence = 0
        for (const ind of indicesOf(blockedPlayer).reverse()) {
            if (this.owns(board, blockedPlayer, ind)) {
                return false
            }

            if (this.owns(board, blockingPlayer, ind)) {
                ++blockSequence
                if (blockSequence == 6) {
                    return true
                }
            } else {
                blockSequence = 0
            }
        }
        console.assert(false)
        return false
    }

    private movable(
        board: NardeBoard,
        from: NardeIndex,
        to: NardeIndex,
        player: Color,
        dice: number[],
        headAllowed: boolean
    ): boolean {
        if (!this.owns(board, player, from)) {
            return false
        }
        if (isStore(from)) {
            return false
        }

        forceType<number>(from)

        if (this.owns(board, oppositeColor(player), to)) {
            return false
        }

        if (isHead(from, player) && !headAllowed) {
            return false
        }

        if (!dice.map(x => this.movedBy(from, x, player)).includes(to)) {
            return false
        }

        if (!isStore(to)) {
            board.move(from, to)
            const res = !this.isIllegalBlock(board, player)
            board.move(to, from)
            return res
        }

        if (!this.canMoveToStore(board, player)) {
            return false
        }

        if (this.isHomeMaxPosition(board, from, player)) {
            return true
        }

        return dice.map(x => from - x).includes(player === Color.WHITE ? 0 : 12)
    }

    private removeDice = (val: number, dice: number[]) => {
        const ind = dice.findIndex(x => x === val)
        console.assert(ind >= 0)
        dice.splice(ind, 1)
    }

private diceToUse(from: NardeIndex, to: NardeIndex, dice: number[], player: Color): number {
        const res = getValue(from, player) - getValue(to, player)
        if (!dice.includes(res)) {
            return Math.max(...dice)
        }
        return res
    }

    private getPotentialDestinations(from: NardeIndex, player: Color, dice: number[]): NardeIndex[] {
        return Array.from(
            new Set(
                dice.map(x => this.movedBy(from, x, player))
            )
        )
    }

    private getHeadMoves(board: NardeBoard, dice: number[]) {
        const whiteHead = board.get(24)
        const whiteStart = whiteHead !== undefined && whiteHead.quantity === 15 && whiteHead.color === Color.WHITE
        const blackHead = board.get(12)
        const blackStart = blackHead !== undefined && blackHead.quantity === 15 && blackHead.color === Color.BLACK
        const isDoubled = dice.length >= 2 && dice[0] === dice[1]
        const isAllowedDouble = dice.length !== 0 && (dice[0] === 3 || dice[0] === 4 || dice[0] === 6)

        return whiteStart && blackStart && isDoubled && isAllowedDouble ? 2 : 1
    }

    calculateDiceValues(board: NardeBoard, dice: [number, number], player: Color): number[] {
        if (dice[0] == dice[1]) {
            dice.push(dice[0], dice[0])
        }

        const initHeadMoves = this.getHeadMoves(board, dice)

        const getMaxMoves = (_dice: number[], headMoves: number): number => {  // Почти идентичен ../backgammon/Rules.calculateDiceValues
            if (_dice.length === 0) {
                return 0
            }

            let max = 0
            for (const from of allIndices()) {
                for (const candidate of this.getPotentialDestinations(from, player, _dice)) {
                    if (this.movable(board, from, candidate, player, _dice, headMoves > 0)) {
                        board.move(from, candidate)
                        const diceUsed = this.diceToUse(from, candidate, _dice, player)
                        this.removeDice(diceUsed, _dice)
                        const res = 1 + getMaxMoves(_dice, isHead(from, player) ? headMoves - 1 : headMoves)
                        _dice.push(diceUsed)
                        board.move(candidate, from)
                        max = Math.max(max, res)
                        if (max === _dice.length) {
                            return max
                        }
                    }
                }
            }
            return max
        }

        const max = getMaxMoves(dice, initHeadMoves)
        dice.sort((a, b) => b - a)

        if (dice[0] !== dice[1] && max === 1) {
            for (const from of allIndices()) {
                for (const candidate of this.getPotentialDestinations(from, player, [dice[0]])) {
                    if (this.movable(board, from, candidate, player, [dice[0]], initHeadMoves > 0)) {
                        return [dice[0]]
                    }
                }
            }
            return [dice[1]]
        }

        return Array.from(dice.slice(0, max))
    }

    getLegalMoves(board: NardeBoard, from: NardeIndex, player: Color, diceValues: number[], performedMoves: CompoundMove<NardeIndex>[]): CompoundMove<NardeIndex>[] {
        const diceValuesCopy = [...diceValues]

        for (const {primaryMove, dice} of performedMoves.reverse()) {
            diceValuesCopy.push(...dice)
            board.move(primaryMove.to, primaryMove.from)
        }
        let initHeadMoves = this.getHeadMoves(board, diceValuesCopy)

        for (const {primaryMove} of performedMoves.reverse()) {
            board.move(primaryMove.from, primaryMove.to)
            if (isHead(primaryMove.from, player)) {
                --initHeadMoves
            }
        }

        type MoveWithDice = {to: NardeIndex, dice: number[]}
        const res: MoveWithDice[] = []

        const getLegalMovesRec = (from: NardeIndex, usedDice: number[], headMoves: number) => {
            for (const candidate of this.getPotentialDestinations(from, player, diceValues)) {
                if (this.movable(board, from, candidate, player, diceValues, headMoves > 0)) {
                    board.move(from, candidate)
                    const diceUsed = this.diceToUse(from, candidate, diceValues, player)
                    usedDice.push(diceUsed)
                    this.removeDice(diceUsed, diceValues)
                    res.push({to: candidate, dice: Array.from(usedDice)})
                    getLegalMovesRec(candidate, usedDice, isHead(from, player) ? headMoves - 1 : headMoves)
                    diceValues.push(diceUsed)
                    this.removeDice(diceUsed, usedDice)
                    board.move(candidate, from)
                }
            }
        }
        getLegalMovesRec(from, [], initHeadMoves)

        const chosenMoves: Map<NardeIndex, MoveWithDice> = new Map()

        for (const move of res) {
            const existing = chosenMoves.get(move.to)
            if (existing === undefined || existing.dice.length > move.dice.length) {
                chosenMoves.set(move.to, move)
            }
        }
        return Array.from(chosenMoves.values()).map(
            move => ({primaryMove: {from: from, to: move.to}, additionalMoves: [], dice: move.dice})
        )
    }


}