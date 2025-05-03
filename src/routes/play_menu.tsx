import {PlayMenuPage} from "../components/play_menu/PlayMenuPage";
import {PlayMenuLayoutProvider} from "../components/adapt/PlayMenuLayoutProvider";

export default function PlayMenu() {
    return (
        <PlayMenuLayoutProvider>
            <PlayMenuPage />
        </PlayMenuLayoutProvider>
    )
}