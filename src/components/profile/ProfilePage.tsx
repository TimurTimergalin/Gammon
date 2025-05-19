import {CSSProperties, ReactNode, useContext, useEffect, useState} from "react";
import styled from "styled-components";
import {AccentedButton} from "../AccentedButton";
import {observer} from "mobx-react-lite";
import {ProfileStatusContext} from "../../controller/profile/context";
import {useImgCache, useImgPlaceholder} from "../../controller/img_cache/context";
import {imageUri} from "../../requests/paths";
import {useAuthContext} from "../../controller/auth_status/context";
import {useNavigate} from "react-router";
import {addFriendById, canAddFriend, isFriend, removeFriend} from "../../requests/requests";
import {useFetch} from "../../common/hooks";

export function EloIcon({iconSrc, value, title}: { iconSrc: string, value: number, title?: string }) {
    const imgStyle = {
        width: 30,
        aspectRatio: 1,
        marginRight: 5
    } satisfies CSSProperties
    const spanStyle = {
        marginRight: 10,
        whiteSpace: "nowrap",
        display: "inline-flex",
        alignItems: "center"
    } satisfies CSSProperties
    return (
        <span style={spanStyle} title={title}>
            <img src={iconSrc} alt={"Иконка режима"} style={imgStyle}/> {value}
        </span>
    )
}

const ProfileBar = observer(function ProfileBar() {
    const layer1Style = {
        backgroundColor: "#444444",
        color: "white",
        paddingLeft: 15
    } satisfies CSSProperties

    const imgContainerStyle = {
        float: "left",
        width: 120,
        aspectRatio: 1,
        padding: 15
    } satisfies CSSProperties

    const nameStyle = {
        fontWeight: 600,
        fontSize: 25,
        marginTop: 13,
        marginBottom: 5
    } satisfies CSSProperties

    const regularTextStyle = {
        fontSize: 20,
        marginTop: 5
    } satisfies CSSProperties

    const buttonStyle = {
        ...regularTextStyle,
        borderRadius: 5,
        marginLeft: 5
    } satisfies CSSProperties

    const profileStatus = useContext(ProfileStatusContext)!
    const authStatus = useAuthContext()
    const placeholderData = useImgPlaceholder()
    const imageSrc = useImgCache(imageUri(profileStatus.id))
    const navigate = useNavigate()
    const [fetch] = useFetch()

    const [init, setInit] = useState(authStatus.id === profileStatus.id)
    const [friendStatus, setFriendStatus] = useState<"Self" | "Already sent" | "Remove" | "Add">("Self")

    const editProfileButton = authStatus.id !== profileStatus.id ? <></> :
        <AccentedButton type={"button"} style={buttonStyle}
                        onClick={() => navigate("/edit-profile")}>Редактировать</AccentedButton>

    const challengeButtonDisabled = profileStatus.invitePolicy === "FRIENDS_ONLY" && friendStatus !== "Remove"
    const challengeButton = authStatus.id === profileStatus.id ? <></> :
        <AccentedButton
            type={"button"}
            style={buttonStyle}
            disabled={challengeButtonDisabled}
            title={challengeButtonDisabled ? "Этот пользователь принимает вызовы только от друзей" : ""}
        >Вызвать на матч</AccentedButton>

    const friendButton = friendStatus === "Self" ?
        <></> :
        friendStatus === "Add" ?
            <AccentedButton
                type={"button"}
                style={buttonStyle}
                onClick={() => {
                    addFriendById(fetch, profileStatus.id).then()
                    setFriendStatus("Already sent")
                }}
            >Добавить в друзья</AccentedButton> :
        friendStatus === "Remove" ?
            <AccentedButton
                type={"button"}
                style={buttonStyle}
                onClick={() => {
                    removeFriend(fetch, profileStatus.id).then()
                    setFriendStatus("Add")
                }}
            >Удалить из друзей</AccentedButton> :
            <AccentedButton
                type={"button"}
                style={buttonStyle}
                disabled={true}
            >Запрос в друзья отправлен</AccentedButton>


    useEffect(() => {
        if (authStatus.id !== profileStatus.id && authStatus.id !== null) {
            Promise.all([
                isFriend(fetch, profileStatus.id).then(
                    resp => resp.json()
                ).then(
                    ({isFriends}) => isFriends
                ),
                canAddFriend(fetch, profileStatus.id).then(
                    resp => resp.json()
                ).then(
                    ({can}) => can
                )
            ]).then(
                ([isFriends, canAddFriend]) => {
                    if (isFriends) {
                        setFriendStatus("Remove")
                    } else if (!canAddFriend) {
                        setFriendStatus("Already sent")
                    } else {
                        setFriendStatus("Add")
                    }
                    setInit(true)
                }
            )
        }
    }, [authStatus.id, fetch, profileStatus.id]);

    return (
        <>{init &&
            <div style={layer1Style}>
                <div style={imgContainerStyle}>
                    <img
                        src={imageSrc}
                        alt={"Аватар"}
                        style={{height: "90%", backgroundColor: "#333", padding: "5%", aspectRatio: 1}}
                        onError={(e) => e.currentTarget.src = placeholderData}
                    />
                </div>
                <p style={nameStyle}>{profileStatus.username}</p>
                <p style={regularTextStyle}><span style={{marginRight: 10}}>{profileStatus.login}</span>
                    {editProfileButton}
                    {challengeButton}
                    {friendButton}
                </p>
                <p>
                    <EloIcon iconSrc={"/backgammon.svg"} value={profileStatus.rating?.backgammonDefault}
                             title={"ELO - Короткие нарды"}/>
                    <EloIcon iconSrc={"/backgammon_blitz.svg"} value={profileStatus.rating?.backgammonBlitz}
                             title={"ELO - Короткие нарды (блиц)"}/>
                    <EloIcon iconSrc={"/narde.svg"} value={profileStatus.rating?.nardeDefault}
                             title={"ELO - Длинные нарды"}/>
                    <EloIcon iconSrc={"/narde_blitz.svg"} value={profileStatus.rating?.nardeBlitz}
                             title={"ELO - Длинные нарды (блиц)"}/>
                </p>
            </div>
        }</>
    )
})

type MatchEntryProp = {
    gameModeIcon: string,
    whiteName: string,
    whiteElo: number,
    userWon: boolean,
    blackElo: number,
    blackName: string
}

function PlainMatchEntry({
                             className,
                             gameModeIcon,
                             whiteName,
                             whiteElo,
                             blackName,
                             blackElo,
                             userWon
                         }: MatchEntryProp & {
    className?: string
}) {
    const imgContainerStyle = {
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        aspectRatio: 1,
        marginRight: 10
    } satisfies CSSProperties

    const imgStyle = {
        height: "80%",
        aspectRatio: "1"
    } satisfies CSSProperties

    const flexContainerStyle = {
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        flex: 1
    } satisfies CSSProperties

    const status = userWon ? "Победа" : "Поражение"

    const statusStyle = {
        color: userWon ? "green" : "red",
        position: "absolute",
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center"
    } satisfies CSSProperties

    return (
        <div className={className}>
            <span style={imgContainerStyle}>
                <img style={imgStyle} src={gameModeIcon} alt={"Иконка режима"}/>
            </span>
            <span style={{position: "relative", marginRight: 10}}>
                <span style={{visibility: "hidden"}}>Поражение</span>
                <span style={statusStyle}>{status}</span>
            </span>
            <div style={flexContainerStyle}>
                <span style={{flex: 1, textAlign: "left", whiteSpace: "nowrap"}}>{whiteName} ({whiteElo})</span>
                <span style={{flex: 1, textAlign: "center", fontSize: 15, whiteSpace: "nowrap"}}>VS</span>
                <span style={{flex: 1, textAlign: "right", whiteSpace: "nowrap"}}>{blackName} ({blackElo})</span>
            </div>
        </div>
    )
}

const MatchEntry = styled(PlainMatchEntry)`
    & {
        background-color: #444444;
        border-radius: 5px;
        color: white;
        font-size: 12px;
        display: flex;
        align-items: center;
    }

    &:hover {
        background-color: #555555;
    }

    &:active {
        background-color: #666666;
    }
`

function PlainMatchList({children, className}: { children?: ReactNode | ReactNode[], className?: string }) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

const MatchList = styled(PlainMatchList)`
    & {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding-left: 15px;
        padding-right: 15px;
        overflow-y: auto;

        > * {
            height: 50px;
            padding: 5px 20px;
            margin-bottom: 10px;
            width: 90%;
            max-width: 500px;
        }
    }
`

function PlainProfilePage({className}: { className?: string }) {
    return (
        <div className={className}>
            <ProfileBar/>
            <MatchList>
                <MatchEntry userWon={true} gameModeIcon={"/backgammon.svg"} blackElo={1000} whiteName={"u1"}
                            blackName={"u2"} whiteElo={1000}/>
                <MatchEntry userWon={false} gameModeIcon={"/backgammon_blitz.svg"} blackElo={1000} whiteName={"u1"}
                            blackName={"u2"} whiteElo={1000}/>
                <MatchEntry userWon={true} gameModeIcon={"/narde.svg"} blackElo={1000} whiteName={"u1"} blackName={"u2"}
                            whiteElo={1000}/>
            </MatchList>
        </div>
    )
}

export const ProfilePage = styled(PlainProfilePage)`
    & {
        display: flex;
        flex: 1;
        min-height: 0;
        align-self: stretch;
        flex-direction: column;
        align-items: stretch;


        > :nth-child(1) {
            min-height: 160px;
            height: fit-content;
            margin-bottom: 15px;
        }

        > :nth-child(2) {
            flex: 1;
        }
    }
`