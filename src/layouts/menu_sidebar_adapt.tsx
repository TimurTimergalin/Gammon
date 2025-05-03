import {Outlet} from "react-router";
import {SideBar} from "../components/sidebar/SideBar";
import {observer} from "mobx-react-lite";
import {CSSProperties} from "react";
import {useSideBarLayout} from "../components/adapt/SideBarContext";
import {MenuSideBarLayoutProvider} from "../components/adapt/MenuSideBarLayoutProvider";


const SideBarPage = observer(function SideBarPage() {
    const layout = useSideBarLayout().mode

    const containerStyle: CSSProperties = {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: layout === "Collapsed" ? "column" : "row"
    }

    return (
        <div style={containerStyle}>
            <SideBar />
            <Outlet />
        </div>
    )
})

export default function Adapter() {
    return <MenuSideBarLayoutProvider>
        <SideBarPage />
    </MenuSideBarLayoutProvider>
}