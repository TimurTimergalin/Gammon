import {Route, Routes} from "react-router";
import {AdapterOutlet} from "./components/adapt/Adapter.tsx";

import {backgammonRemoteSetV1} from "./game/game_rule/backgammon/remote_v1/RemoteSet.ts";
import {SideBarPageOutlet} from "./windows/base/SideBarPage.tsx";
import {PlayMenuWindow} from "./windows/play_menu/PlayMenuWindow.tsx";
import {LocalGameWindow} from "./windows/game/LocalGameWindow.tsx";
import {backgammonRuleSet} from "./game/game_rule/backgammon/RuleSet.ts";
import {RemoteGameWindow} from "./windows/game/RemoteGameWindow.tsx";
import {AuthPageOutlet} from "./windows/base/AuthPage.tsx";
import {SignInForm} from "./windows/auth/SignInForm.tsx";
import {SignUpForm} from "./windows/auth/SignUpForm.tsx";

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
                    <Route path={"/play/:roomId"} element={
                        <RemoteGameWindow ruleSet={backgammonRuleSet} remoteSet={backgammonRemoteSetV1}/>
                    }/>
                    <Route element={<AuthPageOutlet/>}>
                        <Route path={"/sign-in"} element={<SignInForm />} />
                        <Route path={"/sign-up"} element={<SignUpForm />} />
                    </Route>
                </Route>
            </Route>
        </Routes>
    )
}


