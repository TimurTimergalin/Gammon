import {Color, colorFill, colorStroke, oppositeColor} from "../../../common/color";
import {borderWidth, diceCornerRadius, diceWidth, dotRadius} from "./dice_size_constants";
import {LayerStatus} from "./LayerStatus";
import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";
import {logger} from "../../../logging/main";

const console = logger("components/game/dice_layer")

function DiceBase({x, y, color}: {
    x: number,
    y: number,
    color: Color
}) {

    const cx = x + diceWidth / 2
    const cy = y + diceWidth / 2

    const right = x + diceWidth
    const bottom = y + diceWidth
    return (
        <>
            <rect
                x={x}
                y={y}
                width={diceWidth}
                height={diceWidth}
                rx={diceCornerRadius}
                fill={colorStroke(color)}
            />
            <circle
                cx={cx}
                cy={cy}
                r={diceWidth / 2 - borderWidth}
                fill={colorFill(color)}
            />
            <path
                d={`M ${cx} ${y + borderWidth} Q ${right} ${y} ${right - borderWidth} ${cy} z`}
                fill={colorFill(color)}
            />
            <path
                d={`M ${right - borderWidth} ${cy} Q ${right} ${bottom} ${cx} ${bottom - borderWidth} z`}
                fill={colorFill(color)}
            />
            <path
                d={`M ${cx} ${bottom - borderWidth} Q ${x} ${bottom} ${x + borderWidth} ${cy} z`}
                fill={colorFill(color)}
            />
            <path
                d={`M ${x + borderWidth} ${cy} Q ${x} ${y}  ${cx} ${y + borderWidth} z`}
                fill={colorFill(color)}
            />
        </>
    )
}

function DiceDot({cx, cy, diceColor}: {
    cx: number,
    cy: number,
    diceColor: Color
}) {
    return (
        <circle
            cx={cx}
            cy={cy}
            r={dotRadius}
            fill={colorFill(oppositeColor(diceColor))}
        />
    )
}

function DiceFace({x, y, color, value}: {
    x: number,
    y: number,
    color: Color,
    value: number
}) {
    const quarter = diceWidth / 4

    return (
        <>
            {value >= 3 && <DiceDot cx={x + quarter} cy={y + quarter} diceColor={color}/>}
            {value == 6 && <DiceDot cx={x + quarter} cy={y + 2 * quarter} diceColor={color}/>}
            {(value === 2 || value >= 4) && <DiceDot cx={x + quarter} cy={y + 3 * quarter} diceColor={color}/>}
            {value % 2 === 1 && <DiceDot cx={x + 2 * quarter} cy={y + 2 * quarter} diceColor={color}/>}
            {(value === 2 || value >= 4) && <DiceDot cx={x + 3 * quarter} cy={y + quarter} diceColor={color}/>}
            {value == 6 && <DiceDot cx={x + 3 * quarter} cy={y + 2 * quarter} diceColor={color}/>}
            {value >= 3 && <DiceDot cx={x + 3 * quarter} cy={y + 3 * quarter} diceColor={color}/>}
        </>
    )
}

function UsageCover({x, y, status}: {
    x: number,
    y: number,
    status: LayerStatus
}) {
    const fill = "#88888875"

    let res
    if (status === LayerStatus.NONE) {
        res = <></>
    } else if (status === LayerStatus.FULL) {
        res = <rect
            x={x}
            y={y}
            width={diceWidth}
            height={diceWidth}
            rx={diceCornerRadius}
            fill={fill}
        />
    } else {
        res = <path
            d={`M ${x + diceWidth / 2} ${y} 
            L ${x + diceCornerRadius} ${y} 
            A ${diceCornerRadius} ${diceCornerRadius} 0 0 0 ${x} ${y + diceCornerRadius} 
            L ${x} ${y + diceWidth - diceCornerRadius} 
            A ${diceCornerRadius} ${diceCornerRadius} 0 0 0 ${x + diceCornerRadius} ${y + diceWidth} 
            L ${x + diceWidth / 2} ${y + diceWidth}
            z`}
            fill={fill}
        />
    }

    return res
}

function UnavailabilityCover({x, y, status}: {
    x: number,
    y: number,
    status: LayerStatus
}) {
    const fill = "#f25b5b75"
    let res
    if (status === LayerStatus.NONE) {
        res = <></>
    } else if (status === LayerStatus.FULL) {
        res = <rect
            x={x}
            y={y}
            width={diceWidth}
            height={diceWidth}
            rx={diceCornerRadius}
            fill={fill}
        />
    } else {
        res = <path
            d={`M ${x + diceWidth / 2} ${y} 
            L ${x + diceWidth - diceCornerRadius} ${y} 
            A ${diceCornerRadius} ${diceCornerRadius} 0 0 1 ${x + diceWidth} ${y + diceCornerRadius} 
            L ${x + diceWidth} ${y + diceWidth - diceCornerRadius} 
            A ${diceCornerRadius} ${diceCornerRadius} 0 0 1 ${x + diceWidth - diceCornerRadius} ${y + diceWidth} 
            L ${x + diceWidth / 2} ${y + diceWidth}
            z`}
            fill={fill}
        />
    }

    return res
}

const SwapDiceClickable = observer(function SwapDiceClickable({x, y}: { x: number, y: number }) {
    const gameController = useGameContext("gameController")
    return (
        <rect
            x={x}
            y={y}
            width={diceWidth}
            height={diceWidth}
            rx={diceCornerRadius}
            fill={"#00000000"}
            onClick={() => {
                console.log("clicked")
                gameController.swapDice()
            }}
        />
    )
})

export function Dice({x, y, color, value, usageStatus, unavailabilityStatus, interactable = false}: {
    x: number,
    y: number,
    color: Color,
    value: number,
    usageStatus: LayerStatus,
    unavailabilityStatus: LayerStatus,
    interactable?: boolean
}) {
    return (
        <>
            <DiceBase x={x} y={y} color={color}/>
            <DiceFace x={x} y={y} color={color} value={value}/>
            <UsageCover x={x} y={y} status={usageStatus}/>
            <UnavailabilityCover x={x} y={y} status={unavailabilityStatus}/>
            {interactable && <SwapDiceClickable x={x} y={y}/>}
        </>
    )
}