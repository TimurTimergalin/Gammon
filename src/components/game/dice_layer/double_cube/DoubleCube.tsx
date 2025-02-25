import {SvgCenteredTransform} from "./SvgCenteredTransform";
import {diceWidth} from "../dice_size_constants";
import {DiceBase} from "../dice";
import {Color, colorFill} from "../../../../common/color";
import {useGameContext} from "../../../../game/GameContext";

export const DoubleCube = ({value, cx, cy, rotation}: { value: number, cx: number, cy: number, rotation: number }) => {
    const gameController = useGameContext("gameController")

    // noinspection JSSuspiciousNameCombination
    return (
        <SvgCenteredTransform
            rect={{x: 0, y: 0, width: diceWidth, height: diceWidth}}
            transformProps={{
                position: {
                    cx: cx,
                    cy: cy
                },
                scale: 1.2,
                rotation: rotation
            }}>
            <DiceBase x={0} y={0} color={Color.WHITE}/>
            <text textAnchor={"middle"}
                  x={diceWidth / 2}
                  y={diceWidth / 2}
                  fontSize={"40px"}
                  fill={colorFill(Color.BLACK)}
                  dominantBaseline={"central"}
                  fontWeight={"700"}
                  style={{userSelect: "none"}}
            >
                {value}
            </text>
            <rect x={0} y={0} width={diceWidth} height={diceWidth} onClick={() => gameController.interactWithDouble()} fill={"#00000000"}/>
        </SvgCenteredTransform>
    )
}