import {GameWindow} from "./components/ui/windows/game/GameWindow.tsx";
import {Adapter} from "./components/ui/adapt/Adapter.tsx";

export default function App() {
    return (
        <Adapter>
            <GameWindow />
        </Adapter>
    )
}


