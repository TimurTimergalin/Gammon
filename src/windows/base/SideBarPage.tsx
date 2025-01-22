import {ReactNode} from "react";

import {Outlet} from "react-router";
import {AdaptiveWindow} from "../../components/adapt/AdaptiveWindow.tsx";
import {SideBar} from "../../components/sidebar/SideBar.tsx";

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
