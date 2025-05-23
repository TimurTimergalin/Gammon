import {ChallengeEventHandler} from "../components/invite_events/ChallengeEventHandler";
import {Outlet} from "react-router";

export default function ChallengeEvents() {
    return <ChallengeEventHandler><Outlet/></ChallengeEventHandler>
}