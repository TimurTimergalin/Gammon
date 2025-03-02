import {
    allIndices,
    BackgammonCompoundMove, BackgammonIndex,
    BackgammonMove,
    BackgammonProp,
    getBar,
    getStore,
    getValue,
    isBar,
    isHome,
    isStore
} from "../../board/backgammon/types";
import {Color, oppositeColor} from "../../../common/color";
import {BackgammonBoard} from "../../board/backgammon/BackgammonBoard";
import {Rules} from "../Rules";
import {Move} from "../../board/move";
import {logger} from "../../../logging/main";

const console = logger("game/game_rule/backgammon")


export class BackgammonRules implements Rules<BackgammonIndex, BackgammonProp> {
    owns(board: BackgammonBoard, player: Color, position: BackgammonIndex) {
        const positionProps = board.get(position)
        return positionProps !== undefined && positionProps.color === player
    }

    private moveWithBlot(
        board: BackgammonBoard,
        from: BackgammonIndex,
        to: BackgammonIndex,
        player: Color
    ): boolean {
        const toPosition = board.get(to)
        const bar = getBar(oppositeColor(player))
        let res = false
        if (toPosition !== undefined && toPosition.color !== player) {
            console.assert(toPosition.quantity === 1)
            board.move(to, bar)
            res = true
        }
        board.move(from, to)
        return res
    }

    private canMoveToStore(board: BackgammonBoard, player: Color): boolean {
        if (board.get(getBar(player)) !== undefined) {
            return false
        }

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

    private isHomeMaxPosition(board: BackgammonBoard, ind: BackgammonIndex, player: Color) {
        if (!isHome(ind, player)) {
            return false
        }
        const checkColor = (i: number) => {
            const pos = board.get(i)
            return pos !== undefined && pos.color === player
        }
        if (player === Color.WHITE) {
            for (let i = (ind as number) + 1; i <= 6; ++i) {
                if (checkColor(i)) {
                    return false
                }
            }
            return true
        }
        for (let i = 19; i < (ind as number); ++i) {
            if (checkColor(i)) {
                return false
            }
        }
        return true
    }

    private movable(
        board: BackgammonBoard,
        from: BackgammonIndex,
        to: BackgammonIndex,
        player: Color,
        dice: number[]
    ): boolean {
        const fromPosition = board.get(from)
        const playerBarPosition = board.get(getBar(player))
        const toPosition = board.get(to)

        if (fromPosition === undefined) {  // Нельзя передвинуть с пустой позиции
            return false
        }

        if (fromPosition.color !== player) {  // Нельзя передвигать вражеские фишки
            return false
        }

        console.assert(from !== getBar(oppositeColor(player)))

        if (isStore(from)) {  // Нельзя вытаскивать из стора
            return false
        }

        if (from !== getBar(player) && playerBarPosition !== undefined) {  // Если фишки есть на баре, двигать нужно их
            return false
        }
        if (toPosition !== undefined && toPosition.color !== player && toPosition.quantity > 1) {  // Нельзя ходить на поинт противника
            return false
        }
        if (isBar(to)) {  // Нельзя ходить на бар
            return false
        }
        if (to === getStore(oppositeColor(player))) {  // Нельзя ходить в чужой стор
            return false
        }

        if (isStore((to))) {
            if (!this.canMoveToStore(board, player)) {
                return false
            }
            if (this.isHomeMaxPosition(board, from, player)) { // Проверить можно ли выбросить фишку, используя кость с большим значением
                console.assert(typeof from === "number")
                const jumpFor = player === Color.WHITE ? from as number : 25 - (from as number)
                if (dice.filter(x => x >= jumpFor).length > 0) {
                    return true
                }
            }
        }

        if (player === Color.WHITE) {
            return dice.includes(getValue(from) - getValue(to))
        }
        return dice.includes(getValue(to) - getValue(from))
    }

    // Возвращает позиции, на которые может быть можно сходить из from
    private getPotentialDestinations(board: BackgammonBoard, from: BackgammonIndex, player: Color, dice: number[]): BackgammonIndex[] {
        if (isStore(from)) {
            return []
        }
        if (from === getBar(oppositeColor(player))) {
            return []
        }

        const fromValue = getValue(from)

        if (player === Color.WHITE) {
            const res: BackgammonIndex[] = dice.map(x => fromValue - x).filter(x => x >= 1 && x <= 24)
            if (dice.includes(fromValue) || this.isHomeMaxPosition(board, from, player)) {
                res.push("White Store")
            }
            return res
        }
        const res: BackgammonIndex[] = dice.map(x => fromValue + x).filter(x => x >= 1 && x <= 24)
        if (dice.includes(25 - fromValue) || this.isHomeMaxPosition(board, from, player)) {
            res.push("Black Store")
        }
        return res
    }

    private removeDice = (val: number, dice: number[]) => {
        const ind = dice.findIndex(x => x === val)
        console.assert(ind >= 0)
        dice.splice(ind, 1)
    }

    calculateDiceValues(board: BackgammonBoard, dice: [number, number], player: Color) {
        if (dice[0] == dice[1]) {
            dice.push(dice[0], dice[0])
        }

        const getMaxMoves = (_dice: number[]): number => {
            if (_dice.length === 0) {  // База рекурсии
                return 0
            }

            let max = 0
            for (const from of allIndices()) {  // Для каждой позиции-источника
                for (const candidate of this.getPotentialDestinations(board, from, player, _dice)) {  // для каждого кандидата цели
                    if (this.movable(board, from, candidate, player, _dice)) {  // если из источника в цель можно передвинуть
                        const toBar = this.moveWithBlot(board, from, candidate, player)  // переместить фишку (и возможно выбить блот)
                        let diceValue = Math.abs(getValue(from) - getValue(candidate))
                        if (!_dice.includes(diceValue)) {
                            diceValue = Math.max(..._dice)
                        }
                        this.removeDice(diceValue, _dice)  // удалить использованную для хода кость
                        const res = 1 + getMaxMoves(_dice)  // Рекурсивный вызов
                        // Откат всех изменений
                        _dice.push(diceValue)
                        board.move(candidate, from)
                        if (toBar) {
                            const bar = getBar(oppositeColor(player))
                            board.move(bar, candidate)
                        }
                        max = Math.max(max, res)  // Обновление максимума
                        if (max === _dice.length) {  // Оптимизация - если max максимально возможный, то дальше можно не искать
                            return max
                        }
                    }
                }
            }
            return max
        }

        const max = getMaxMoves(dice)
        dice.sort((a, b) => b - a)

        if (dice[0] !== dice[1] && max === 1) {
            for (const from of allIndices()) {
                for (const candidate of this.getPotentialDestinations(board, from, player, [dice[0]])) {
                    if (this.movable(board, from, candidate, player, [dice[0]])) {
                        return [dice[0]]
                    }
                }
            }
            return [dice[1]]
        }

        return Array.from(dice.slice(0, max))
    }

    getLegalMoves(board: BackgammonBoard, from: BackgammonIndex, player: Color, diceValues: number[]): BackgammonCompoundMove[] {
        const res: [BackgammonIndex, [BackgammonIndex, BackgammonIndex][], number[]][] = []

        const getLegalMovesRec = (from_: BackgammonIndex, additionalMoves: [BackgammonIndex, BackgammonIndex][], diceUsed: number[]) => {
            for (const candidate of this.getPotentialDestinations(board, from_, player, diceValues)) {
                if (this.movable(board, from_, candidate, player, diceValues)) {
                    const toBar = this.moveWithBlot(board, from_, candidate, player)
                    const bar = getBar(oppositeColor(player))
                    if (toBar) {
                        additionalMoves.push([candidate, bar])
                    }
                    let diceValue = Math.abs(getValue(from_) - getValue(candidate))
                    if (!diceValues.includes(diceValue)) {
                        diceValue = Math.max(...diceValues)
                    }
                    diceUsed.push(diceValue)
                    this.removeDice(diceValue, diceValues)
                    res.push([candidate, Array.from(additionalMoves), Array.from(diceUsed)])
                    getLegalMovesRec(candidate, additionalMoves, diceUsed)
                    diceValues.push(diceValue)
                    this.removeDice(diceValue, diceUsed)
                    board.move(candidate, from_)
                    if (toBar) {
                        board.move(bar, candidate)
                        additionalMoves.pop()
                    }
                }
            }
        }

        const filterRes = (): [BackgammonIndex, [BackgammonIndex, BackgammonIndex][], number[]][] => {
            const met: Map<BackgammonIndex, [[BackgammonIndex, BackgammonIndex][], number[]]> = new Map()
            const shouldAdd = new Set(res.map(x => x[0]))
            for (const [to, additionalMoves, diceUsed] of res) {
                if (!shouldAdd.has(to)) {
                    continue
                }
                additionalMoves.sort()
                if (!met.has(to)) {
                    met.set(to, [additionalMoves, diceUsed])

                    continue
                }
                const compareWith = met.get(to)![0]
                let additionalMovesAreEqual = compareWith.length === additionalMoves.length
                if (!additionalMovesAreEqual) {
                    shouldAdd.delete(to)
                    continue
                }

                for (const i of compareWith.keys()) {
                    if (compareWith[i][0] !== additionalMoves[i][0] || compareWith[i][1] !== additionalMoves[i][1]) {
                        additionalMovesAreEqual = false
                        break
                    }
                }
                if (!additionalMovesAreEqual) {
                    shouldAdd.delete(to)
                }
                if (diceUsed.length < met.get(to)![1].length) {
                    met.set(to, [additionalMoves, diceUsed])
                }
            }
            return Array.from(met.entries()).filter(e => shouldAdd.has(e[0])).map(e => [e[0], ...e[1]])
        }

        const toCompoundMove = (entry: [BackgammonIndex, [BackgammonIndex, BackgammonIndex][], number[]]): BackgammonCompoundMove => {
            const toMove = (entry1: [BackgammonIndex, BackgammonIndex]): BackgammonMove => ({
                from: entry1[0],
                to: entry1[1]
            })
            const additionalMoves = entry[1].map(toMove)
            return {
                primaryMove: {from: from, to: entry[0]},
                additionalMoves: additionalMoves,
                dice: entry[2]
            }
        }

        getLegalMovesRec(from, [], [])
        return filterRes().map(toCompoundMove)
    }

    movedBy(from: BackgammonIndex, by: number, player: Color): BackgammonIndex {
        console.assert(from !== "White Store")
        console.assert(from !== "Black Store")
        if (from === "White Bar") {
            console.assert(player === Color.WHITE)
            return 25 - by
        }

        if (from === "Black Bar") {
            console.assert(player === Color.BLACK)
            return by
        }
        console.assert(typeof from === "number")
        const dir = player === Color.WHITE ? -1 : 1
        const res = (from as number) + dir * by

        if (res >= 25) {
            console.assert(player === Color.BLACK)
            return "Black Store"
        }

        if (res <= 0) {
            console.assert(player === Color.WHITE)
            return "White Store"
        }

        return res
    }

    noMovesLeft(board: BackgammonBoard, player: Color): boolean {
        let prop
        if (player === Color.WHITE) {
            prop = board.get("White Store")
        } else {
            prop = board.get("Black Store")
        }

        return prop !== undefined && prop.quantity === 15
    }

    squashMoves(moves: Move<BackgammonIndex>[]): Move<BackgammonIndex>[][] {
        const barMoves: Map<BackgammonIndex, Move<BackgammonIndex>> = new Map()
        const res: Move<BackgammonIndex>[][] = []

        for (const move of moves) {
            if (isBar(move.to)) {
                console.assert(!barMoves.has(move.from))
                barMoves.set(move.from, move)
            } else {
                const toAdd = [move]
                if (barMoves.has(move.to)) {
                    toAdd.splice(0, 0, barMoves.get(move.to)!)
                    barMoves.delete(move.to)
                }
                res.push(toAdd)
            }
        }

        return res
    }

    calculatePoints(board: BackgammonBoard, winner: Color): number {
        console.assert(this.noMovesLeft(board, winner))

        const loser = oppositeColor(winner)
        const store = board.get(getStore(loser))
        if (store !== undefined) {
            console.assert(store.quantity > 0)
            return 1
        }

        const bar = board.get(getBar(loser))
        if (bar !== undefined) {
            console.assert(bar.quantity > 0)
            return 3  // Кокс
        }

        return 2 // Марс
    }

    canConcedePrematurely(board: BackgammonBoard, player: Color): boolean {
        return board.get(getStore(player)) !== undefined
    }
}