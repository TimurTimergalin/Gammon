import {observer} from "mobx-react-lite";
import {useAuthContext} from "../../controller/auth_status/context";
import {CSSProperties, useCallback, useState} from "react";
import {Logo} from "./Logo";
import {SideBarIcon} from "./SideBarIcon";
import {Dice} from "../game/dice_layer/dice";
import {Color} from "../../common/color";
import {LayerStatus} from "../game/dice_layer/LayerStatus";
import {useSideBarLayout} from "../adapt/SideBarContext";

const sideBarBgColor = "#252323"
const PlayIcon = () => (
    <SideBarIcon navigateTo={"/play"} text={"Играть"}>
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
    </SideBarIcon>
)

const ProfileIcon = ({signedIn}: { signedIn: boolean }) => (
    <SideBarIcon
        navigateTo={!signedIn ? "/sign-in" : "/profile"}
        text={!signedIn ? "Войти" : "Профиль"}>
        <img src={"/profile_icon.svg"} alt={"Профиль"} style={{height: "100%"}}/>
    </SideBarIcon>
)

const NormalSideBar = observer(function NormalSideBar() {
    const authStatus = useAuthContext()
    const width = 200

    const style: CSSProperties = {
        width: width,
        height: "100%",
        backgroundColor: sideBarBgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    }

    return (
        <div style={style}>
            <Logo iconSrc={"/expanded_icon.svg"}/>
            <PlayIcon/>
            <ProfileIcon signedIn={authStatus.id !== null}/>
        </div>
    )
})
const DiminishedSideBar = observer(function DiminishedSideBar() {
    const authStatus = useAuthContext()
    const width = 60

    const style: CSSProperties = {
        width: width,
        height: "100%",
        backgroundColor: sideBarBgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
    }

    return <div style={style}>
        <Logo iconSrc={"/collapsed_icon.svg"}/>
        <PlayIcon/>
        <ProfileIcon signedIn={authStatus.id !== null}/>
    </div>
})
const CollapsedSideBar = observer(function CollapsedSideBar() {
    const authStatus = useAuthContext()
    const width = 200
    const [menuOpen, setMenuOpen] = useState(false)


    const barStyle: CSSProperties = {
        width: width,
        height: "100%",
        backgroundColor: sideBarBgColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        position: "fixed",
        transition: "transform .1s ease-out",
        transform: menuOpen ? "translate(0)" : "translate(-100%)",
        left: 0,
        zIndex: 10
    }

    const screenStyle: CSSProperties = {
        position: "fixed",
        width: "100%",
        height: "100%",
        backgroundColor: "#66666666",
        display: menuOpen ? "block" : "none",
        zIndex: 5
    }

    const menuIconStyle: CSSProperties = {
        width: 40,
        alignSelf: "start",
        marginLeft: 10,
        paddingTop: 10,
        paddingBottom: 10
    }

    const toggleMenuCallback = useCallback(
        () => {
            setMenuOpen(!menuOpen)
        }, [menuOpen]
    )

    return (
        <>
            <div style={barStyle}>
                <Logo iconSrc={"/expanded_icon.svg"}/>
                <PlayIcon/>
                <ProfileIcon signedIn={authStatus.id !== null}/>
            </div>
            <img src={"/menu_icon.svg"} style={menuIconStyle} alt={"Menu"} onClick={toggleMenuCallback}/>
            <div style={screenStyle} onClick={toggleMenuCallback}/>
        </>
    )
})
export const SideBar = observer(function NewSideBar() {
    const {mode} = useSideBarLayout()

    switch (mode) {
        case "Normal":
            return <NormalSideBar/>
        case "Diminished":
            return <DiminishedSideBar/>
        case "Collapsed":
            return <CollapsedSideBar/>
    }
})
