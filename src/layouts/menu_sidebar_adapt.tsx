import {MenuSideBarLayoutProvider} from "../components/new_adapt/MenuSideBarLayoutProvider";
import {Outlet} from "react-router";
import {NewSideBar} from "../components/sidebar/new/SideBar";
import {observer} from "mobx-react-lite";
import {useSideBarLayout} from "../components/new_adapt/SideBarContext";
import {CSSProperties} from "react";


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
            <NewSideBar />
            <Outlet />
        </div>
    )
})

export default function Adapter() {
    return <MenuSideBarLayoutProvider>
        <SideBarPage />
    </MenuSideBarLayoutProvider>
}