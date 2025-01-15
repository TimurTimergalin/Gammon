import {Route, Routes} from "react-router";
import {AdapterOutlet} from "./components/ui/adapt/Adapter.tsx";
import {SideBarPageOutlet} from "./components/ui/windows/base/SideBarPage.tsx";
import {PlayMenuWindow} from "./components/ui/windows/play_menu/PlayMenuWindow.tsx";
import {AuthPageOutlet} from "./components/ui/windows/base/AuthPage.tsx";
import {LoginForm} from "./components/ui/windows/auth/LoginForm.tsx";
import {LocalGameWindow} from "./components/ui/windows/game/LocalGameWindow.tsx";
import {backgammonRuleSet} from "./game/game_rule/backgammon/RuleSet.ts";
import {RemoteGameWindow} from "./components/ui/windows/game/RemoteGameWindow.tsx";
import {backgammonRemoteSetV1} from "./game/game_rule/backgammon/remote_v1/RemoteSet.ts";

export default function App() {
    return (
        <Routes>
            <Route element={<AdapterOutlet/>}>
                <Route element={<SideBarPageOutlet/>}>
                    <Route path={"/play"} element={<PlayMenuWindow/>}/>
                    <Route index element={<PlayMenuWindow/>}/>
                    <Route path={"/local-play/backgammon"} element={
                        <LocalGameWindow ruleset={backgammonRuleSet}/>
                    }/>
                    <Route path={"/play/backgammon/:roomId"} element={
                        <RemoteGameWindow ruleSet={backgammonRuleSet} remoteSet={backgammonRemoteSetV1}/>
                    }/>
                    <Route element={<AuthPageOutlet/>}>
                        <Route path={"/sign-in"} element={<LoginForm />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}


