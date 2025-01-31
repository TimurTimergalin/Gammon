import {Route, Routes} from "react-router";
import {AdapterOutlet} from "./components/adapt/Adapter";

import {backgammonRemoteSetV1} from "./game/game_rule/backgammon/remote_v1/RemoteSet";
import {SideBarPageOutlet} from "./windows/base/SideBarPage";
import {PlayMenuWindow} from "./windows/play_menu/PlayMenuWindow";
import {LocalGameWindow} from "./windows/game/LocalGameWindow";
import {backgammonRuleSet} from "./game/game_rule/backgammon/RuleSet";
import {RemoteGameWindow} from "./windows/game/RemoteGameWindow";
import {AuthPageOutlet} from "./windows/base/AuthPage";
import {SignInForm} from "./windows/auth/SignInForm";
import {SignUpForm} from "./windows/auth/SignUpForm";

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


