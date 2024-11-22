import {Adapter} from "./components/ui/adapt/Adapter.tsx";
import {PlayMenuWindow} from "./components/ui/windows/play_menu/PlayMenuWindow.tsx";

export default function App() {
    return (
        <Adapter>
            <PlayMenuWindow />
        </Adapter>
    )
}


