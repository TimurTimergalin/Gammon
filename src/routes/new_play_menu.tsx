import {PlayMenuLayoutProvider} from "../components/new_adapt/PlayMenuLayoutProvider";
import {NewPlayMenuPage} from "../components/play_menu/new/NewPlayMenuPage";

export default function PlayMenu() {
    return (
        <PlayMenuLayoutProvider>
            <NewPlayMenuPage />
        </PlayMenuLayoutProvider>
    )
}