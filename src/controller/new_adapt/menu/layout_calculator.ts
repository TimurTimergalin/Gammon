import {SideBarLayoutMode} from "../side_bar/layout_modes";

export function getMenuSideBarLayout(screenWidth: number): SideBarLayoutMode {
    if (screenWidth >= 1200) {
        return "Normal"
    }
    if (screenWidth >= 950) {
        return "Diminished"
    }
    return "Collapsed"
}
