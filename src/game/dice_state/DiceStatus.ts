import {Color} from "../../common/color";
import {LayerStatus} from "../../components/game/dice_layer/LayerStatus";

export interface DiceStatus {
    value: number,
    color: Color,
    usageStatus: LayerStatus,
    unavailabilityStatus: LayerStatus
}