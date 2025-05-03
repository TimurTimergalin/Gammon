import {UndoMovesButton} from "./UndoMovesButton";
import {FinishTurnButton} from "./FinishTurnButton";
import {RollDiceButton} from "./RollDiceButton";
import {ConcedeGameButton} from "./ConcedeGameButton";

export const ButtonPanel = () => {
    return (
        <>
            <ConcedeGameButton />
            <RollDiceButton />
            <UndoMovesButton/>
            <FinishTurnButton/>
        </>
    )
}