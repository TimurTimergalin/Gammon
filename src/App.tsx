import SideBar from "./components/ui/sidebar/SideBar";
import GameView from "./components/game/GameView";

export default function App() {
    return (
            <div style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                height: "100%",
                backgroundColor: "#33130d"
            }}>
                <SideBar />
                <div style={{
                    width: "60%",
                    margin: "auto"
                }}>
                    <GameView />
                </div>
            </div>
    );
}


