import {UndoMovesButton} from "./UndoMovesButton.tsx";
import {FinishTurnButton} from "./FinishTurnButton.tsx";

export const ButtonPanel = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end"
        }}>
            <UndoMovesButton />
            <FinishTurnButton />
        </div>
    )
}