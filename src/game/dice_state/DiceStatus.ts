import {Color} from "../../common/color";
import {LayerStatus} from "../../components/game/dice_layer/LayerStatus";

export interface DiceStatus {
    value: number,
    color: Color,
    usageStatus: LayerStatus,
    unavailabilityStatus: LayerStatus
}

export function makeDice(value: number, color: Color): DiceStatus {
    return {
        value: value,
        color: color,
        usageStatus: LayerStatus.NONE,
        unavailabilityStatus: LayerStatus.NONE
    }
}