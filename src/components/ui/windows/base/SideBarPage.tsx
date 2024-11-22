import {ReactNode} from "react";
import {AdaptiveWindow} from "../../adapt/AdaptiveWindow.tsx";
import {SideBar} from "../../sidebar/SideBar.tsx";
import {Outlet} from "react-router";

const SideBarPage = ({children}: {
    children: ReactNode | ReactNode[]
}) => (
    <AdaptiveWindow>
        <SideBar/>
        {children}
    </AdaptiveWindow>
)

export const SideBarPageOutlet = () => (
    <SideBarPage>
        <Outlet/>
    </SideBarPage>
)
