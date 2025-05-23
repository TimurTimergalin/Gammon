import {CSSProperties, ReactNode, useContext, useEffect, useState} from "react";
import styled from "styled-components";
import {AccentedButton} from "../AccentedButton";
import {observer} from "mobx-react-lite";
import {ProfileStatusContext} from "../../controller/profile/context";
import {useImgCache, useImgPlaceholder} from "../../controller/img_cache/context";
import {imageUri} from "../../requests/paths";
import {useAuthContext} from "../../controller/auth_status/context";
import {useNavigate} from "react-router";
import {
    addFriendById,
    canAddFriend,
    getBackgammonConfig,
    getGamesList,
    isFriend,
    removeFriend
} from "../../requests/requests";
import {useFetch} from "../../common/hooks";
import {makeAutoObservable, runInAction} from "mobx";
import {ProfileStatus} from "../../controller/profile/ProfileStatus";
import {UsernameLink} from "../friends_page/FriendsPage";

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
    const [challengeStatus, setChallengeStatus] = useState<{ type: "challenge" } | {
        type: "spectate",
        gameId: number
    } | null>(null)

    const editProfileButton = authStatus.id !== profileStatus.id ? <></> :
        <AccentedButton type={"button"} style={buttonStyle}
                        onClick={() => navigate("/edit-profile")}>Редактировать</AccentedButton>

    useEffect(() => {
        if (authStatus.id !== profileStatus.id) {
            getGamesList(fetch, profileStatus.id, 0, 1)
                .then(resp => resp.json())
                .then(([game]) => {
                    console.log(game?.gameStatus)
                    if (game === undefined) {
                        setChallengeStatus({type: "challenge"})
                    } else if (game.gameStatus === "IN_PROCESS") {
                        setChallengeStatus({type: "spectate", gameId: game.gameId})
                    } else {
                        setChallengeStatus({type: "challenge"})
                    }
                })
        } else {
            setChallengeStatus(null)
        }
    }, [authStatus, fetch, profileStatus.id]);

    const challengeButtonDisabled = profileStatus.invitePolicy === "FRIENDS_ONLY" && friendStatus !== "Remove"
    const challengeButton = challengeStatus === null ? <></> :
        challengeStatus.type === "challenge" ?
            <AccentedButton
                type={"button"}
                style={buttonStyle}
                disabled={challengeButtonDisabled}
                title={challengeButtonDisabled ? "Этот пользователь принимает вызовы только от друзей" : ""}
                onClick={() => navigate(`/challenge/${profileStatus.id}`)}
            >Вызвать на матч</AccentedButton> :
            <AccentedButton
                type={"button"}
                style={buttonStyle}
                onClick={() => navigate(`/play/${challengeStatus.gameId}`)}
            >Наблюдать</AccentedButton>

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
        } else {
            setFriendStatus("Self")
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
    whiteId: number
    whiteElo: number,
    userWon: boolean | null,
    blackElo: number,
    blackId: number,
    blackName: string,
    gameId: number
}

const StopProp = ({children}: { children?: ReactNode | ReactNode[] }) => (
    <div onClick={(e) => e.stopPropagation()}>
        {children}
    </div>
)


function PlainMatchEntry({
                             className,
                             gameModeIcon,
                             whiteName,
                             blackName,
                             userWon,
                             whiteId,
                             blackId,
                             gameId
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

    const status = userWon === null ? "В процессе" : userWon ? "Победа" : "Поражение"
    const navigate = useNavigate()
    const redirectTo = userWon === null ? `/play/${gameId}` : `/history/${gameId}`

    const statusStyle = {
        color: userWon === null ? "white" : userWon ? "green" : "red",
        position: "absolute",
        left: 0,
        right: 0,
        marginLeft: "auto",
        marginRight: "auto",
        textAlign: "center"
    } satisfies CSSProperties

    return (
        <div className={className} onClick={() => navigate(redirectTo)}>
            <span style={imgContainerStyle}>
                <img style={imgStyle} src={gameModeIcon} alt={"Иконка режима"}/>
            </span>
            <span style={{position: "relative", marginRight: 10}}>
                <span style={{visibility: "hidden"}}>Поражение</span>
                <span style={statusStyle}>{status}</span>
            </span>
            <div style={flexContainerStyle}>
                <span style={{flex: 1, textAlign: "left", whiteSpace: "nowrap"}}>
                    <StopProp>
                        <UsernameLink to={`/profile/${whiteId}`}>{whiteName}</UsernameLink>
                    </StopProp>
                </span>
                <span style={{flex: 1, textAlign: "center", fontSize: 15, whiteSpace: "nowrap"}}>VS</span>
                <span style={{flex: 1, textAlign: "right", whiteSpace: "nowrap"}}>
                    <StopProp>
                        <UsernameLink to={`/profile/${blackId}`}>{blackName}</UsernameLink>
                    </StopProp>
                </span>
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
            max-width: 700px;
        }
    }
`

const PlainProfilePage = observer(function PlainProfilePage({className}: { className?: string }) {
    const [matchList] = useState<{ matches: MatchEntryProp[] }>(makeAutoObservable({matches: []}))
    const profileStatus = useContext(ProfileStatusContext)!
    const [fetch] = useFetch()

    const getIcon = (gameType: string, timeControl: string) => {
        return gameType === "SHORT_BACKGAMMON" ?
            (timeControl === "BLITZ" ?
                "/backgammon_blitz.svg" :
                "/backgammon.svg") :
            (timeControl === "BLITZ" ?
                "/narde_blit.svg" :
                "/narde.svg")
    }

    const getRating = (gameType: string, timeControl: string, rating: ProfileStatus["rating"]) => {
        return gameType === "SHORT_BACKGAMMON" ?
            (timeControl === "BLITZ" ?
                rating.backgammonBlitz :
                rating.backgammonDefault) :
            (timeControl === "BLITZ" ?
                rating.nardeBlitz :
                rating.nardeDefault)
    }

    useEffect(() => {
        runInAction(() => matchList.matches.splice(0, matchList.matches.length))
    }, [profileStatus.id, matchList.matches]);

    useEffect(() => {
        const loadData = (pageNumber: number) => {
            const limit = 10
            getGamesList(fetch, profileStatus.id, pageNumber, limit)
                .then(resp => resp.json())
                .then(matches => Promise.all([
                    matches,
                    Promise.allSettled(
                        matches.map(
                            (match: ReturnType<JSON["parse"]>) => getBackgammonConfig(fetch, match.gameId).then(resp => {
                                if (!resp.ok) {
                                    throw new Error(String(resp.status))
                                }
                                return resp
                            }))
                    )
                ]))
                .then(([matches, responses]) => {
                    const newMatches = []
                    const newResponses = []
                    for (let i = 0; i < matches.length; ++i) {
                        const resp = responses[i]
                        if (resp.status === "fulfilled") {
                            newMatches.push(matches[i])
                            newResponses.push(resp.value)
                        }
                    }
                    return [newMatches, newResponses]
                })
                .then(([matches, responses]) => Promise.all([matches, Promise.all(responses.map(resp => resp.json()))]))
                .then(([matches, configs]) => {
                    console.log(matches, configs)

                    runInAction(() => {
                        for (let i = 0; i < matches.length; ++i) {
                            const match = matches[i]
                            const config = configs[i]

                            const whiteUsername = config.players.WHITE === profileStatus.id ? profileStatus.username : match.opponentUserInfo.username
                            const blackUsername = config.players.BLACK === profileStatus.id ? profileStatus.username : match.opponentUserInfo.username

                            matchList.matches.push({
                                whiteId: config.players.WHITE,
                                whiteName: whiteUsername,
                                blackId: config.players.BLACK,
                                blackName: blackUsername,
                                gameModeIcon: getIcon(match.gameType, match.timePolicy),
                                userWon: config.winner === null ? null : (
                                    config.winner === "WHITE" ? config.players.WHITE === profileStatus.id : config.players.BLACK === profileStatus.id
                                ),
                                whiteElo: getRating(match.gameType, match.timePolicy, config.players.WHITE === profileStatus.id ? profileStatus.rating : match.opponentUserInfo.rating),
                                blackElo: getRating(match.gameType, match.timePolicy, config.players.BLACK === profileStatus.id ? profileStatus.rating : match.opponentUserInfo.rating),
                                gameId: match.gameId
                            })
                        }
                    })
                    if (matches.length >= limit) {
                        loadData(pageNumber + 1)
                    }
                })
        }

        console.log("triggered")
        loadData(0)
        return () => {
            console.log("cleanup")
            runInAction(() => matchList.matches.splice(0, matchList.matches.length))
        }
    }, [fetch, matchList, profileStatus]);

    const matchEntries = matchList.matches.map(e => <MatchEntry {...e} key={e.gameId}/>)

    return (
        <div className={className}>
            <ProfileBar/>
            <MatchList>
                {matchEntries}
            </MatchList>
        </div>
    )
})

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