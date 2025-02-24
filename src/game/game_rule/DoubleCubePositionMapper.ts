import {Color} from "../../common/color";

export type Store = "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight"
export type Stand = "left" | "right"


export interface DoubleCubePositionMapper {
    positionOwned(color: Color): Store
    positionFree(): Stand
    rotationOwned(color: Color): number
    rotationFree(): number
    flipped(): DoubleCubePositionMapper
}