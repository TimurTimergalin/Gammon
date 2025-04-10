import {DoubleCubePositionMapper, Stand, Store} from "../DoubleCubePositionMapper";
import {Color, oppositeColor} from "../../../common/color";

export class NardeDoubleCubePositionMapper implements DoubleCubePositionMapper {
    private readonly player: Color

    constructor(player: Color) {
        this.player = player;
    }

    positionOwned(color: Color): Store {
        if (this.player === Color.WHITE) {
            return color === Color.WHITE ? "TopLeft" : "BottomRight"
        }
        return color === Color.WHITE ? "BottomRight" : "TopLeft"
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
        return new NardeDoubleCubePositionMapper(oppositeColor(this.player))
    }
}