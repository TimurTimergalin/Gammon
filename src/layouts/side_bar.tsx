import {ReactNode} from "react";

import {Outlet} from "react-router";
import {AdaptiveWindow} from "../components/adapt/AdaptiveWindow";

import {SideBar} from "../components/sidebar/old/SideBar";

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

export default SideBarPageOutlet
