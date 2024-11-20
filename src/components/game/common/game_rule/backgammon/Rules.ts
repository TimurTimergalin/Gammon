import {
    allIndices,
    BackgammonPositionIndex,
    BackgammonPositionProp,
    getBar,
    getStore,
    getValue,
    isBar,
    isHome,
    isStore
} from "./types.ts";
import {Color, oppositeColor} from "../../color.ts";
import {Rules} from "../Rules.ts";

export class BackgammonRules implements Rules<BackgammonPositionIndex, BackgammonPositionProp>{
    private _placement: Map<BackgammonPositionIndex, BackgammonPositionProp> = new Map()
    private diceValues: number[] = []

    get placement(): Map<BackgammonPositionIndex, BackgammonPositionProp> {
        return new Map(this._placement);
    }

    set placement(placement: Map<BackgammonPositionIndex, BackgammonPositionProp>) {
        this._placement = placement
    }

    owns(player: Color, position: BackgammonPositionIndex): boolean {
        const positionProps = this._placement.get(position) || null
        return positionProps !== null && positionProps[0] === player
    }

    private hasEmptyStore(player: Color) {
        console.assert((this._placement.get(getBar(player)) || null) === null)

        for (let i = 1; i <= 24; ++i) {
            if (isHome(i, player)) {
                continue
            }
            const pos = this._placement.get(i) || null
            if (pos !== null && pos[0] === player) {
                return false
            }
        }
        return true
    }

    private isMaxHomePosition(ind: BackgammonPositionIndex, player: Color) {
        if (!isHome(ind, player)) {
            return false
        }

        const check = (i: number) => {
            const pos = this._placement.get(i) || null
            return pos !== null && pos[0] === player
        }
        if (player === Color.WHITE) {
            for (let i = (ind as number) + 1; i <= 6; ++i) {
                if (check(i)) {
                    return false
                }
            }
            return true
        }
        for (let i = 19; i < (ind as number); ++i) {
            if (check(i)) {
                return false
            }
        }
        return true
    }

    // Может ли игрок player передвинуть фишку с from на to
    private movable(from: BackgammonPositionIndex, to: BackgammonPositionIndex, player: Color, dice: number[]) {
        const fromPosition = this._placement.get(from) || null
        const playerBarPosition = this._placement.get(getBar(player)) || null
        const toPosition = this._placement.get(to) || null
        if (fromPosition === null) {  // Нельзя передвинуть с пустой позиции
            return false
        }
        if (fromPosition[0] !== player) {  // Нельзя передвигать вражеские фишки
            return false
        }
        console.assert(from !== getBar(oppositeColor(player)))

        if (isStore(from)) {  // Нельзя вытаскивать из стора
            return false
        }
        if (from !== getBar(player) && playerBarPosition !== null) {  // Если фишки есть на баре, двигать нужно их
            return false
        }
        if (toPosition !== null && toPosition[0] !== player && toPosition[1] > 1) {  // Нельзя ходить на поинт противника
            return false
        }
        if (isBar(to)) {  // Нельзя ходить на бар
            return false
        }
        if (to === getStore(oppositeColor(player))) {  // Нельзя ходить в чужой стор
            return false
        }

        if (isStore(to)) {
            if (!this.hasEmptyStore(player)) { // Нельзя ходить в стор, если не все фишки в доме
                return false
            }
            if (this.isMaxHomePosition(from, player)) {  // Проверить можно ли выбросить фишку, используя кость с большим значением
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

    // Передвигает фишку с from на to без проверок
    private move(from: BackgammonPositionIndex, to: BackgammonPositionIndex) {
        let fromPosition = this._placement.get(from) || null
        console.assert(fromPosition !== null)
        fromPosition = fromPosition as [Color, number]
        let toPosition = this._placement.get(to) || null
        console.assert(toPosition === null || toPosition[0] === fromPosition[0])
        if (toPosition === null) {
            toPosition = [fromPosition[0], 1]
        } else {
            toPosition[1]++
        }
        fromPosition[1]--
        if (fromPosition[1] === 0) {
            fromPosition = null
        }
        this._placement.set(from, fromPosition)
        this._placement.set(to, toPosition)
    }

    // Как move, только выбивает блот
    private moveWithBlot(from: BackgammonPositionIndex, to: BackgammonPositionIndex, player: Color) {
        const toPosition = this._placement.get(to) || null
        const bar = getBar(oppositeColor(player))
        let res = false
        if (toPosition !== null && toPosition[0] !== player) {
            console.assert(toPosition[1] === 1)
            this.move(to, bar)
            res = true
        }
        this.move(from, to)
        return res
    }

    // Возвращает позиции, на которые может быть можно сходить из from
    private getPotentialDestinations(from: BackgammonPositionIndex, player: Color, dice: number[]): BackgammonPositionIndex[] {
        if (isStore(from)) {
            return []
        }
        if (from === getBar(oppositeColor(player))) {
            return []
        }

        const fromValue = getValue(from)

        if (player === Color.WHITE) {
            const res: BackgammonPositionIndex[] = dice.map(x => fromValue - x).filter(x => x >= 1 && x <= 24)
            if (dice.includes(fromValue) || this.isMaxHomePosition(from, player)) {
                res.push("White Store")
            }
            return res
        }
        const res: BackgammonPositionIndex[] = dice.map(x => fromValue + x).filter(x => x >= 1 && x <= 24)
        if (dice.includes(25 - fromValue) || this.isMaxHomePosition(from, player)) {
            res.push("Black Store")
        }
        return res
    }

    // Удаляет кость с определенным значением из массива
    private removeDice = (val: number, dice: number[]) => {
        const ind = dice.findIndex(x => x === val)
        console.assert(ind >= 0)
        dice.splice(ind, 1)
    }

    // На основе выпавших костей определяет, на какие значения можно сходить
    calculateDiceValues(dice: [number, number], player: Color) {
        if (dice[0] == dice[1]) {
            dice.push(dice[0], dice[0])
        }

        // Рекурсивно вычисляет максимальную длину хода
        const getMaxMoves = (_dice: number[]): number => {
            if (_dice.length === 0) {  // База рекурсии
                return 0
            }

            let max = 0
            for (const from of allIndices()) {  // Для каждой позиции-источника
                for (const candidate of this.getPotentialDestinations(from, player, _dice)) {  // для каждого кандидата цели
                    if (this.movable(from, candidate, player, _dice)) {  // если из источника в цель можно передвинуть
                        const toBar = this.moveWithBlot(from, candidate, player)  // переместить фишку (и возможно выбить блот)
                        let diceValue = Math.abs(getValue(from) - getValue(candidate))
                        if (!_dice.includes(diceValue)) {
                            diceValue = Math.max(..._dice)
                        }
                        this.removeDice(diceValue, _dice)  // удалить использованную для хода кость
                        const res = 1 + getMaxMoves(_dice)  // Рекурсивный вызов
                        // Откат всех изменений
                        _dice.push(diceValue)
                        this.move(candidate, from)
                        if (toBar) {
                            const bar = getBar(oppositeColor(player))
                            this.move(bar, candidate)
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
                for (const candidate of this.getPotentialDestinations(from, player, [dice[0]])) {
                    if (this.movable(from, candidate, player, [dice[0]])) {
                        this.diceValues = [dice[0]]
                        return [dice[0]]
                    }
                }
            }
            this.diceValues = [dice[1]]
            return [dice[1]]
        }

        this.diceValues = Array.from(dice.slice(0, max))
        return Array.from(this.diceValues)  // Чтобы нельзя было поменять извне
    }

    getLegalMoves(from: BackgammonPositionIndex, player: Color) {
        const res: [BackgammonPositionIndex, [BackgammonPositionIndex, BackgammonPositionIndex][], number[]][] = []

        const getLegalMovesRec = (from_: BackgammonPositionIndex, additionalMoves: [BackgammonPositionIndex, BackgammonPositionIndex][], diceUsed: number[]) => {
            for (const candidate of this.getPotentialDestinations(from_, player, this.diceValues)) {
                if (this.movable(from_, candidate, player, this.diceValues)) {
                    const toBar = this.moveWithBlot(from_, candidate, player)
                    const bar = getBar(oppositeColor(player))
                    if (toBar) {
                        additionalMoves.push([candidate, bar])
                    }
                    let diceValue = Math.abs(getValue(from_) - getValue(candidate))
                    if (!this.diceValues.includes(diceValue)) {
                            diceValue = Math.max(...this.diceValues)
                        }
                    diceUsed.push(diceValue)
                    this.removeDice(diceValue, this.diceValues)
                    res.push([candidate, Array.from(additionalMoves), Array.from(diceUsed)])
                    getLegalMovesRec(candidate, additionalMoves, diceUsed)
                    this.diceValues.push(diceValue)
                    this.removeDice(diceValue, diceUsed)
                    this.move(candidate, from_)
                    if (toBar) {
                        this.move(bar, candidate)
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

        getLegalMovesRec(from, [], [])
        return filterRes()
    }

    performMove(from: BackgammonPositionIndex, to: BackgammonPositionIndex, additionalMoves: [BackgammonPositionIndex, BackgammonPositionIndex][], diceUsed: number[]) {
        for (const [from_, to_] of additionalMoves) {
            this.move(from_, to_)
        }
        this.move(from, to)
        for (const dice of diceUsed) {
            this.removeDice(dice, this.diceValues)
        }
    }

    undoMove(from: BackgammonPositionIndex, to: BackgammonPositionIndex, additionalMoves: [BackgammonPositionIndex, BackgammonPositionIndex][], diceUsed: number[]) {
        this.diceValues.push(...diceUsed)
        this.move(to, from)
        for (const[from_, to_] of additionalMoves.reverse()) {
            this.move(to_, from_)
        }
    }

    isTurnComplete(): boolean {
        return this.diceValues.length === 0;
    }
}


