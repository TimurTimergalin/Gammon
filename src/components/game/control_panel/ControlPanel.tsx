import {observer} from "mobx-react-lite";
import {useGameContext} from "../../../game/GameContext";

export const ControlPanel = observer(function ControlPanel() {
    const scoreState = useGameContext("scoreState")

    return (
        <div style={{
            backgroundColor: "white", flex: 1, textAlign: "center", color: "black"
        }}>
            {scoreState.white} : {scoreState.black}
        </div>
    )
})