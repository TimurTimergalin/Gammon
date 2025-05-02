import {GamePageLayoutProvider} from "../components/new_adapt/GamePageLayoutProvider";
import {Outlet} from "react-router";

const Adapter = () => (
    <GamePageLayoutProvider>
        <Outlet />
    </GamePageLayoutProvider>
)

export default Adapter