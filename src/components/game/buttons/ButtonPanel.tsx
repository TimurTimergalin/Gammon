import {UndoMovesButton} from "./UndoMovesButton";
import {FinishTurnButton} from "./FinishTurnButton";
import {RollDiceButton} from "./RollDiceButton";

export const ButtonPanel = () => {
    return (
        <>
            <RollDiceButton />
            <UndoMovesButton/>
            <FinishTurnButton/>
        </>
    )
}