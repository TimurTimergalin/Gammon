import {LabelMapper, Labels} from "../LabelMapper";
import {Color, oppositeColor} from "../../../common/color";
import {logger} from "../../../logging/main";

const console = logger("game/game_rule/backgammon")


export class BackgammonLabelMapper implements LabelMapper{
    private readonly player: Color

    constructor(player: Color) {
        this.player = player;
    }

    mapWhite(pi: number): Labels {
        if (pi <= 11) {
            return {
                white: 13 + pi,
                black: 12 - pi
            }
        } else {
            return {
                white: 24 - pi,
                black: 1 + pi
            }
        }
    }

    mapBlack(pi: number): Labels {
        if (pi <= 11) {
            return {
                black: 24 - pi,
                white: 1 + pi
            }
        } else {
            return {
                black: pi - 11,
                white: 36 - pi
            }
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
        return new BackgammonLabelMapper(oppositeColor(this.player));
    }
}