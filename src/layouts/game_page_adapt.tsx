import {Outlet} from "react-router";
import {GamePageLayoutProvider} from "../components/adapt/GamePageLayoutProvider";

const Adapter = () => (
    <GamePageLayoutProvider>
        <Outlet />
    </GamePageLayoutProvider>
)

export default Adapter