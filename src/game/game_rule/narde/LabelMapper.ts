import {LabelMapper, Labels} from "../LabelMapper";
import {Color, oppositeColor} from "../../../common/color";


export class NardeLabelMapper implements LabelMapper {
    private readonly player: Color

    constructor(player: Color) {
        this.player = player;
    }

    mapWhite(pi: number): Labels {
        if (pi <= 11) {
            return {
                white: pi + 1,
                black: pi + 1
            }
        }

        return {
            white: 36 - pi,
            black: 36 - pi
        }
    }

    mapBlack(pi: number): Labels {
        if (pi <= 11) {
            return {
                white: 13 + pi,
                black: 13 + pi
            }
        }
        return {
            white: 24 - pi,
            black: 24 - pi
        }
    }

    map(pi: number): Labels {
        console.assert(pi >= 0)
        console.assert(pi < 24)
        if (this.player === Color.WHITE) {
            return this.mapWhite(pi)
        }
        return this.mapBlack(pi)
    }

    flipped(): LabelMapper {
        return new NardeLabelMapper(oppositeColor(this.player));
    }
}