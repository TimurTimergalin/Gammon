import {IndexMapper} from "../IndexMapper";
import {NardeIndex} from "../../board/narde/types";
import {Color, oppositeColor} from "../../../common/color";

export class NardeIndexMapper implements IndexMapper<NardeIndex> {
    private readonly color: Color

    constructor(color: Color) {
        this.color = color;
    }

    private logicalToPhysicalWhite(logical:NardeIndex): number {
        if (typeof logical === "number") {
            if (logical <= 12) {
                return logical - 1
            }
            return 36 - logical
        }
        if (logical === "White Store") {
            return 24
        }
        return 29
    }

    private logicalToPhysicalBlack(logical:NardeIndex): number {
        if (typeof logical === "number") {
            if (logical <= 12) {
                return 24 - logical
            }
            return logical - 13
        }
        if (logical === "White Store") {
            return 29
        }
        return 24
    }

    logicalToPhysical = (logical: NardeIndex): number => {
        if (this.color === Color.WHITE) {
            return this.logicalToPhysicalWhite(logical)
        }
        return this.logicalToPhysicalBlack(logical)
    };

    private physicalToLogicalWhite(physical:number): NardeIndex {
        if (physical < 12) {
            return physical + 1
        }
        if (physical < 24) {
            return 36 - physical
        }
        if (physical === 24) {
            return "White Store"
        }
        if (physical === 29) {
            return "Black Store"
        }

        throw RangeError(`${physical} is not mapped to any logical position`)
    }

    private physicalToLogicalBlack(physical:number): NardeIndex {
        if (physical < 12) {
            return physical + 13
        }
        if (physical < 24) {
            return 24 - physical
        }
        if (physical === 24) {
            return "Black Store"
        }
        if (physical === 29) {
            return "White Store"
        }

        throw RangeError(`${physical} is not mapped to any logical position`)
    }

    physicalToLogical = (physical: number): NardeIndex => {
        if (this.color === Color.WHITE) {
            return this.physicalToLogicalWhite(physical)
        }
        return this.physicalToLogicalBlack(physical)
    }

    flipped(): IndexMapper<NardeIndex> {
        return new NardeIndexMapper(oppositeColor(this.color));
    }
}