import {Route, Routes} from "react-router";
import {AdapterOutlet} from "./components/ui/adapt/Adapter.tsx";
import {SideBarPageOutlet} from "./components/ui/windows/base/SideBarPage.tsx";
import {PlayMenuWindow} from "./components/ui/windows/play_menu/PlayMenuWindow.tsx";
import {GameWindow} from "./components/ui/windows/game/GameWindow.tsx";

export default function App() {
    return (
        <Routes>
            <Route element={<AdapterOutlet/>}>
                <Route element={<SideBarPageOutlet/>}>
                    <Route path={"/play"} element={<PlayMenuWindow/>}/>
                    <Route index element={<PlayMenuWindow/>}/>
                    <Route path={"/local-play"} element={<GameWindow/>}/>
                </Route>
            </Route>
        </Routes>
    )
}


