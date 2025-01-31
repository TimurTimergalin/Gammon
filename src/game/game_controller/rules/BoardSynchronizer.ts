import {IndexMapper} from "../../game_rule/IndexMapper";
import {PropMapper} from "../../game_rule/PropMapper";
import {Board} from "../../board/Board";
import {PiecePlacement, PositionState} from "../../board/physical/types";
import {PhysicalBoard} from "../../board/physical/PhysicalBoard";
import {Color} from "../../../common/color";
import {Move} from "../../board/move";
import {logger} from "../../../logging/main";

const console = logger("game/game_controller/rules")


export class BoardSynchronizer<Index, Prop> {
    get ruleBoard(): Board<Index, Prop> {
        return this._ruleBoard;
    }
    private readonly physicalBoard: PhysicalBoard
    private readonly _ruleBoard: Board<Index, Prop>
    private readonly indexMapper: IndexMapper<Index>
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

        this.physicalBoard.update(this.logicalToPhysical())
    }

    private logicalToPhysical() {
        const physical: PiecePlacement = new Map()
        for (const [ind, val] of this._ruleBoard) {
            const physicalInd = this.indexMapper.logicalToPhysical(ind)
            const physicalProp = new PositionState(
                this.propMapper.logicalToPhysical(val).map(color => ({color: color}))
            )
            physical.set(physicalInd, physicalProp)
        }
        return physical
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
}
