import {IndexMapper} from "../IndexMapper.ts";
import {Color, oppositeColor} from "../../color.ts";
import {BackgammonIndex} from "../../board/backgammon/types.ts";

export class BackgammonIndexMapper implements IndexMapper<BackgammonIndex> {
    private readonly color: Color

    constructor(color: Color) {
        this.color = color;
    }

     private logicalToPhysicalWhite(logical: BackgammonIndex): number {
        if (typeof logical === "number") {
            if (logical >= 13) {
                return logical - 13
            } else {
                return 24 - logical
            }
        }
        if (logical === "White Store") {
            return 29
        }
        if (logical === "Black Store") {
            return 26
        }
        if (logical === "White Bar") {
            return 28
        }
        // if (logical === "Black Bar")
        return 25
    }

    private logicalToPhysicalBlack(logical: BackgammonIndex): number {
        if (typeof logical === "number") {
            if (logical <= 12) {
                return logical - 1
            } else {
                return 36 - logical
            }
        }
        if (logical === "White Store") {
            return 24
        }
        if (logical === "Black Store") {
            return 27
        }
        if (logical === "White Bar") {
            return 25
        }
        // if (logical === "Black Bar")
        return 28
    }

    logicalToPhysical = (logical: BackgammonIndex): number => {
        if (this.color === Color.WHITE) {
            return this.logicalToPhysicalWhite(logical)
        }
        return this.logicalToPhysicalBlack(logical)
    };

    private physicalToLogicalWhite(physical: number): BackgammonIndex {
        if (physical < 12) {
            return physical + 13
        }
        if (physical < 24) {
            return 24 - physical
        }
        if (physical == 25) {
            return "Black Bar"
        }
        if (physical == 26) {
            return "Black Store"
        }
        if (physical == 28) {
            return "White Bar"
        }
        if (physical == 29) {
            return "White Store"
        }

        throw RangeError(`${physical} is not mapped to any logical position`)
    }

    private physicalToLogicalBlack(physical: number): BackgammonIndex {
        if (physical < 12) {
            return physical + 1
        }
        if (physical < 24) {
            return 36 - physical
        }
        if (physical === 24) {
            return "White Store"
        }
        if (physical === 25) {
            return "White Bar"
        }
        if (physical === 27) {
            return "Black Store"
        }
        if (physical === 28) {
            return "Black Bar"
        }
        throw RangeError(`${physical} is not mapped to any logical position`)
    }

    physicalToLogical = (physical: number): BackgammonIndex => {
        if (this.color === Color.WHITE) {
            return this.physicalToLogicalWhite(physical)
        }
        return this.physicalToLogicalBlack(physical)
    };

    flipped(): IndexMapper<BackgammonIndex> {
        return new BackgammonIndexMapper(oppositeColor(this.color));
    }
}