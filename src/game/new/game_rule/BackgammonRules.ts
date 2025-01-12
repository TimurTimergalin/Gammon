import {BackgammonCompoundMove, BackgammonMove, BackgammonPlacement} from "./types.ts";
import {Color, oppositeColor} from "../../color.ts";
import {
    allIndices,
    BackgammonPositionIndex,
    getBar,
    getStore,
    getValue,
    isBar,
    isHome,
    isStore
} from "../../game_rule/backgammon/types.ts";

export class BackgammonRules {
    owns(board: BackgammonPlacement, player: Color, position: BackgammonPositionIndex) {
        const positionProps = board.get(position)
        return positionProps !== undefined && positionProps.color === player
    }

    move(board: BackgammonPlacement, from: BackgammonPositionIndex, to: BackgammonPositionIndex) {
        let fromPosition = board.get(from)
        console.assert(fromPosition !== undefined)
        fromPosition = fromPosition!

        let toPosition = board.get(to)
        console.assert(toPosition === undefined || toPosition.color === fromPosition.color)
        if (toPosition === undefined) {
            toPosition = {color: fromPosition.color, quantity: 1}
        } else {
            toPosition.quantity++
        }
        fromPosition.quantity--
        if (fromPosition.quantity === 0) {
            fromPosition = undefined
        }
        board.set(from, fromPosition)
        board.set(to, toPosition)
    }

    private moveWithBlot(
        board: BackgammonPlacement,
        from: BackgammonPositionIndex,
        to: BackgammonPositionIndex,
        player: Color
    ): boolean {
        const toPosition = board.get(to)
        const bar = getBar(oppositeColor(player))
        let res = false
        if (toPosition !== undefined && toPosition.color !== player) {
            console.assert(toPosition.quantity === 1)
            this.move(board, to, bar)
            res = true
        }
        this.move(board, from, to)
        return res
    }

    private canMoveToStore(board: BackgammonPlacement, player: Color): boolean {
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

    private isHomeMaxPosition(board: BackgammonPlacement, ind: BackgammonPositionIndex, player: Color) {
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
        board: BackgammonPlacement,
        from: BackgammonPositionIndex,
        to: BackgammonPositionIndex,
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
    private getPotentialDestinations(board: BackgammonPlacement,from: BackgammonPositionIndex, player: Color, dice: number[]): BackgammonPositionIndex[] {
        if (isStore(from)) {
            return []
        }
        if (from === getBar(oppositeColor(player))) {
            return []
        }

        const fromValue = getValue(from)

        if (player === Color.WHITE) {
            const res: BackgammonPositionIndex[] = dice.map(x => fromValue - x).filter(x => x >= 1 && x <= 24)
            if (dice.includes(fromValue) || this.isHomeMaxPosition(board, from, player)) {
                res.push("White Store")
            }
            return res
        }
        const res: BackgammonPositionIndex[] = dice.map(x => fromValue + x).filter(x => x >= 1 && x <= 24)
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

    calculateDiceValues(board: BackgammonPlacement, dice: [number, number], player: Color) {
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
                        this.move(board, candidate, from)
                        if (toBar) {
                            const bar = getBar(oppositeColor(player))
                            this.move(board, bar, candidate)
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

    getLegalMoves(board: BackgammonPlacement, from: BackgammonPositionIndex, player: Color, diceValues: number[]): BackgammonCompoundMove[] {
        const res: [BackgammonPositionIndex, [BackgammonPositionIndex, BackgammonPositionIndex][], number[]][] = []

        const getLegalMovesRec = (from_: BackgammonPositionIndex, additionalMoves: [BackgammonPositionIndex, BackgammonPositionIndex][], diceUsed: number[]) => {
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
                    this.move(board, candidate, from_)
                    if (toBar) {
                        this.move(board, bar, candidate)
                        additionalMoves.pop()
                    }
                }
            }
        }

        const filterRes = (): [BackgammonPositionIndex, [BackgammonPositionIndex, BackgammonPositionIndex][], number[]][] => {
            const met: Map<BackgammonPositionIndex, [[BackgammonPositionIndex, BackgammonPositionIndex][], number[]]> = new Map()
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

        const toCompoundMove = (entry: [BackgammonPositionIndex, [BackgammonPositionIndex, BackgammonPositionIndex][], number[]]): BackgammonCompoundMove => {
            const toMove = (entry1: [BackgammonPositionIndex, BackgammonPositionIndex]): BackgammonMove => ({from: entry1[0], to: entry1[1]})
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

    mergeMoves(moves: BackgammonMove[]): BackgammonMove[] {
        const res: Map<BackgammonPositionIndex, BackgammonMove> = new Map()

        for (const move of moves) {
            if (res.has(move.from)) {
                const oldMove = res.get(move.from)!
                const newMove: BackgammonMove = {from: oldMove.from, to: move.to}
                res.set(move.to, newMove)
            } else {
                res.set(move.to, move)
            }
        }

        return Array.from(res.values())
    }
}