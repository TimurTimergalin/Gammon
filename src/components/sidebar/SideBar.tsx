import {CSSProperties, useCallback, useState} from "react";
import {Logo} from "./Logo";
import {TextWithIcon} from "./TextWithIcon";
import {useScreenSpecs} from "../../controller/adapt/ScreenSpecs";
import {observer} from "mobx-react-lite";
import {Dice} from "../game/dice_layer/dice";
import {Color} from "../../common/color";
import {LayerStatus} from "../game/dice_layer/LayerStatus";
import {useAuthContext} from "../../controller/auth_status/context";

export const SideBar = observer(function SideBar() {
    const screenSpecs = useScreenSpecs();
    const layoutMode = screenSpecs.layoutMode
    const authStatus = useAuthContext()

    const [menuOpen, setMenuOpen] = useState(false)

    const collapsedStyle: CSSProperties = {
        position: "fixed",
        transition: "transform .1s ease-out",
        transform: menuOpen ? "translate(0)" : "translate(-100%)",
        left: 0,
        zIndex: 1
    }

    const expandedSideBarWidth = 200
    const shrankSideBarWidth = 60

    const barStyle: CSSProperties = {
        width: layoutMode === "Free" || layoutMode === "Collapsed" ? expandedSideBarWidth : shrankSideBarWidth,
        height: "100%",
        backgroundColor: "#252323",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        ...(layoutMode === "Collapsed" ? collapsedStyle : {}),
        // minWidth: "fit-content"
    }

    const screenStyle: CSSProperties = {
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "#66666666",
        display: menuOpen ? "block" : "none"
    }

    const iconWidth = 40 * screenSpecs.scaleFactor
    const iconMarginLeft = 30 * screenSpecs.scaleFactor

    const menuIconStyle: CSSProperties = {
        width: `${iconWidth}px`,
        alignSelf: "start",
        marginLeft: `${iconMarginLeft}px`,
        marginTop: "10px",
        marginBottom: "15px"
    }

    const toggleMenuCallback = useCallback(
        () => {
            setMenuOpen(!menuOpen)
        }, [menuOpen]
    )

    return (
        <>
            <div style={barStyle}>
                <Logo/>
                <TextWithIcon text={"Играть"} navigateTo={"/play"}>
                    <svg viewBox={"0 0 75 75"} height={"100%"}>
                        <Dice
                            x={0}
                            y={0}
                            color={Color.WHITE}
                            value={5}
                            usageStatus={LayerStatus.NONE}
                            unavailabilityStatus={LayerStatus.NONE}
                        />
                    </svg>
                </TextWithIcon>
                <TextWithIcon
                    navigateTo={authStatus.id === null ? "/sign-in" : "/profile"}
                    text={authStatus.id === null ? "Войти" : "Профиль"}>
                    <img src={"/profile_icon.svg"} alt={"Профиль"} style={{height: "100%"}}/>
                </TextWithIcon>
            </div>
            {layoutMode === "Collapsed" &&
                <>
                    <img src={"menu_icon.svg"} style={menuIconStyle} alt={"Menu"} onClick={toggleMenuCallback}/>
                    <div style={screenStyle} onClick={toggleMenuCallback}/>
                </>
            }
        </>
    )
})