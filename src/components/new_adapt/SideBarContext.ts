import {createContext, useContext} from "react";
import {SideBarLayoutState} from "../../controller/new_adapt/side_bar/layout_state";

const SideBarLayoutContext = createContext<SideBarLayoutState | null>(null)

export const SideBarLayoutContextProvider = SideBarLayoutContext.Provider
export const useSideBarLayout = () => useContext(SideBarLayoutContext)!