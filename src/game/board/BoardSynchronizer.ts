import {IndexMapper} from "../game_rule/IndexMapper";
import {PropMapper} from "../game_rule/PropMapper";
import {Board} from "./Board";
import {PositionState} from "./physical/types";
import {PhysicalBoard} from "./physical/PhysicalBoard";
import {Color} from "../../common/color";
import {Move} from "./move";
import {logger} from "../../logging/main";
import {logicalToPhysical, physicalToLogical} from "../game_rule/functions";

const console = logger("game/game_controller/rules")


export class BoardSynchronizer<Index, Prop> {
    get ruleBoard(): Board<Index, Prop> {
        return this._ruleBoard;
    }

    private readonly physicalBoard: PhysicalBoard
    private readonly _ruleBoard: Board<Index, Prop>
    private indexMapper: IndexMapper<Index>
    private readonly propMapper: PropMapper<Prop>

    constructor(
        physicalBoard: PhysicalBoard,
        ruleBoard: Board<Index, Prop>,
        indexMapper: IndexMapper<Index>,
        propMapper: PropMapper<Prop>
    ) {
        this.physicalBoard = physicalBoard
        this._ruleBoard = ruleBoard;
        this.indexMapper = indexMapper;
        this.propMapper = propMapper

        this.physicalBoard.update(logicalToPhysical(ruleBoard, indexMapper, propMapper))
    }

    updatePhysical(board: Iterable<[number, PositionState]>) {
        this.physicalBoard.update(board)
        this._ruleBoard.update(physicalToLogical(board, this.indexMapper, this.propMapper))
    }

    updateLogical(board: Iterable<[Index, Prop]>) {
        this._ruleBoard.update(board)
        this.physicalBoard.update(logicalToPhysical(board, this.indexMapper, this.propMapper))
    }

    putPhysical = (pi: number, color: Color) => {
        this.physicalBoard.put(pi, color)
        const li = this.indexMapper.physicalToLogical(pi)
        this._ruleBoard.put(li, color)
    };

    putLogical = (li: Index, color: Color) => {
        this._ruleBoard.put(li, color)
        const pi = this.indexMapper.logicalToPhysical(li)
        this.physicalBoard.put(pi, color)
    };

    removePhysical = (pi: number): Color => {
        const pr = this.physicalBoard.remove(pi)
        const li = this.indexMapper.physicalToLogical(pi)
        const lr = this._ruleBoard.remove(li)
        console.assert(pr === lr)
        return pr
    };

    removeLogical = (li: Index): Color => {
        const lr = this._ruleBoard.remove(li)
        const pi = this.indexMapper.logicalToPhysical(li)
        const pr = this.physicalBoard.remove(pi)
        console.assert(pr === lr)
        return pr
    };

    movePhysical = (fromP: number, toP: number) => {
        this.physicalBoard.move(fromP, toP)
        const fromL = this.indexMapper.physicalToLogical(fromP)
        const toL = this.indexMapper.physicalToLogical(toP)
        this._ruleBoard.move(fromL, toL)
    };

    moveLogical = (fromL: Index, toL: Index) => {
        this._ruleBoard.move(fromL, toL)
        const fromP = this.indexMapper.logicalToPhysical(fromL)
        const toP = this.indexMapper.logicalToPhysical(toL)
        this.physicalBoard.move(fromP, toP)
    };

    performMovePhysical = (moveP: Move<number>) => {
        this.movePhysical(moveP.from, moveP.to)
    };

    performMoveLogical = (moveL: Move<Index>) => {
        this.moveLogical(moveL.from, moveL.to)
    };

    physicalBoardProxy = (): Board<number, PositionState> => {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outer = this

        return {
            get(i: number): PositionState {
                return outer.physicalBoard.get(i)
            },
            put(i: number, color: Color) {
                return outer.putPhysical(i, color)
            },
            remove(i: number): Color {
                return outer.removePhysical(i)
            },
            move(from: number, to: number) {
                return outer.movePhysical(from, to)
            },
            [Symbol.iterator]() {
                return outer.physicalBoard[Symbol.iterator]()
            },
            update(src: Iterable<[number, PositionState]>) {
                outer.updatePhysical(src)
            }
        }
    }

    logicalBoardProxy = (): Board<Index, Prop> => {
        // eslint-disable-next-line @typescript-eslint/no-this-alias
        const outer = this

        return {
            get(i: Index): Prop {
                return outer._ruleBoard.get(i)
            },
            put(i: Index, color: Color) {
                return outer.putLogical(i, color)
            },
            remove(i: Index): Color {
                return outer.removeLogical(i)
            },
            move(from: Index, to: Index) {
                return outer.moveLogical(from, to)
            },
            [Symbol.iterator]() {
                return outer._ruleBoard[Symbol.iterator]()
            },
            update(src: Iterable<[Index, Prop]>) {
                outer.updateLogical(src)
            }
        }
    }

    swapBoard() {
        this.indexMapper = this.indexMapper.flipped()
        this.updateLogical(this._ruleBoard)
    }
}
