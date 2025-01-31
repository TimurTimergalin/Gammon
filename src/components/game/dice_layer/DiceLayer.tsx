import {observer} from "mobx-react-lite";
import {boardHeight, boardWidth} from "../dimensions/board_size_constants";
import {diceWidth, gapBetweenDice} from "./dice_size_constants";
import {Dice} from "./dice";
import {useGameContext} from "../../../game/GameContext";

const DiceLayer = observer(function DiceLayer() {
        const {dice1, dice2} = useGameContext("diceState")

        const diceY = boardHeight / 2 - diceWidth / 2
        const dice1X = boardWidth / 4 - gapBetweenDice / 2 - diceWidth
        const dice2X = boardWidth / 4 + gapBetweenDice / 2

        return (
            <>
                {dice1 !== null && <Dice
                    x={dice1X}
                    y={diceY}
                    color={dice1.color}
                    value={dice1.value}
                    usageStatus={dice1.usageStatus}
                    unavailabilityStatus={dice1.unavailabilityStatus}
                    interactable={true}
                />}
                {dice2 != null && <Dice
                    x={dice2X}
                    y={diceY}
                    color={dice2.color}
                    value={dice2.value}
                    usageStatus={dice2.usageStatus}
                    unavailabilityStatus={dice2.unavailabilityStatus}
                    interactable={true}
                />}
            </>
        )
    }
)

export default DiceLayer