import {DoubleCubePositionMapper, Stand, Store} from "../DoubleCubePositionMapper";
import {Color, oppositeColor} from "../../../common/color";

export class BackgammonDoubleCubePositionMapper implements DoubleCubePositionMapper {
    private readonly player: Color

    constructor(player: Color) {
        this.player = player;
    }

    positionOwned(color: Color): Store {
        if (this.player === Color.WHITE) {
            return color === Color.WHITE ? "BottomLeft" : "TopLeft"
        }
        return color === Color.WHITE ? "TopRight" : "BottomRight"
    }

    positionFree(): Stand {
        return this.player === Color.WHITE ? "right" : "left"
    }

    rotationOwned(color: Color): number {
        return this.player === color ? 0 : 180
    }

    rotationFree(): number {
        return this.player === Color.WHITE ? 90 : -90
    }

    flipped(): DoubleCubePositionMapper {
        return new BackgammonDoubleCubePositionMapper(oppositeColor(this.player));
    }
}