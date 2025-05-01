import {TimeControl, TimeControlTable} from "../TimeControlTable";

export class NardeTimeControlTable implements TimeControlTable {
    getTimeControl(
        {pointsUntil, blitz}: { pointsUntil: number; blitz: boolean }
    ): TimeControl {
        // return {timeMs: 5 * 1000, incrementMs: 0}  // for debug
        if (!blitz) {
            return {timeMs: pointsUntil * 2 * 60 * 1000, incrementMs: 8 * 1000}
        }
        if (pointsUntil === 1) {
            return {timeMs: 30 * 1000, incrementMs: 8 * 1000}
        }

        return {timeMs: (pointsUntil - 1) / 2 * 60 * 1000, incrementMs: 8 * 1000}
    }
}