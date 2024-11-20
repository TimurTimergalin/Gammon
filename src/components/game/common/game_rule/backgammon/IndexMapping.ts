import {IndexMapping} from "../IndexMapping.ts";
import {BackgammonPositionIndex} from "./types.ts";
import {Color, oppositeColor} from "../../color.ts";

export class BackgammonIndexMapping implements IndexMapping<BackgammonPositionIndex> {
    private readonly color: Color

    constructor(color: Color) {
        this.color = color;
    }

    logicalToPhysicalWhite(logical: BackgammonPositionIndex): number {
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

    logicalToPhysicalBlack(logical: BackgammonPositionIndex): number {
        if (typeof logical === "number") {
            if (logical <= 12) {
                return logical - 1
            } else {
                return 36 - logical
            }
        }
        if (logical === "White Store") {
            return 27
        }
        if (logical === "Black Store") {
            return 24
        }
        if (logical === "White Bar") {
            return 25
        }
        // if (logical === "Black Bar")
        return 28
    }

    logicalToPhysical(logical: BackgammonPositionIndex): number {
        if (this.color === Color.WHITE) {
            return this.logicalToPhysicalWhite(logical)
        }
        return this.logicalToPhysicalBlack(logical)
    }

    physicalToLogicalWhite(physical: number): BackgammonPositionIndex {
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

    physicalToLogicalBlack(physical: number): BackgammonPositionIndex {
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

    physicalToLogical(physical: number): BackgammonPositionIndex {
        if (this.color === Color.WHITE) {
            return this.physicalToLogicalWhite(physical)
        }
        return this.physicalToLogicalBlack(physical)
    }

    flipped(): IndexMapping<BackgammonPositionIndex> {
        return new BackgammonIndexMapping(oppositeColor(this.color));
    }
}