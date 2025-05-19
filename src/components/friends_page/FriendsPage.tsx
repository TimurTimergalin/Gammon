import styled from "styled-components";
import {useImgCache, useImgPlaceholder} from "../../controller/img_cache/context";
import {AccentedButton} from "../AccentedButton";
import {ReactNode, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useFetch} from "../../common/hooks";
import {
    addFriendById,
    addFriendByLogin,
    getFriendRequest,
    getFriendsList,
    removeFriend,
    userInfo
} from "../../requests/requests";
import {imageUri} from "../../requests/paths";
import {FriendsStatusContext} from "../../controller/friend/context";
import {FriendsStatus} from "../../controller/friend/FriendsStatus";
import {useAuthContext} from "../../controller/auth_status/context";
import {Link, useNavigate} from "react-router";
import {EloIcon} from "../profile/ProfilePage";
import {observer} from "mobx-react-lite";
import {runInAction} from "mobx";

type Rating = { backgammonBlitz: number; backgammonDefault: number; nardeBlitz: number; nardeDefault: number }

export const UsernameLink = styled(Link)`
    & {
        color: white;
        text-decoration: none;
    }
    
    &:hover {
        text-decoration: underline;
    }
    
    &:active {
        text-decoration: underline;
    }
`

const PlainSearchBar = ({className}: {className?: string}) => {
    const [fetch] = useFetch()
    const inputRef = useRef<HTMLInputElement | null>(null)

    const onClick = useCallback(() => {
        const login = inputRef.current!.value
        if (login.length === 0) {
            return
        }
        addFriendByLogin(fetch, login).then()
        inputRef.current!.value = ""
    }, [fetch])

    return (
        <div className={className}>
            <input placeholder={"Логин пользователя"} ref={inputRef}/>
            <AccentedButton onClick={onClick}>Добавить в друзья</AccentedButton>
        </div>
    )
}

const SearchBar = styled(PlainSearchBar)`
    display: flex;
    margin-bottom: 20px;
    align-items: stretch;
    input {
        flex: 1;
        background-color: #444;
        border: 0;
        margin-right: 10px;
        color: white;
        font-size: 18px;
        padding-left: 3px;
        
        &:focus {
            outline: 1px solid #ff7f2a;
        }
    }
    
    ${AccentedButton} {
        height: 50px;
        border-radius: 10px;
    }
`

const RemoveFriendButton = styled(AccentedButton)`
    background-color: lightgray;
    color: black;
    
    &:hover {
        background-color: #bbb !important;
    }
    
    &:active {
        background-color: #ddd !important;
    }
`

const PlainFriendsEntry = ({className, iconSrc, username, rating, id}: {
    className?: string,
    iconSrc: string,
    rating: Rating,
    username: string,
    id: number
}) => {
    const icon = useImgCache(iconSrc)
    const placeholder = useImgPlaceholder()
    const navigate = useNavigate()
    return (
        <div className={className}>
            <img src={icon} alt={"Аватар"} onError={(e) => e.currentTarget.src = placeholder}/>
            <div>
                <p><UsernameLink to={`/profile/${id}`}>{username}</UsernameLink></p>
                <EloIcon iconSrc={"/backgammon.svg"} value={rating.backgammonDefault}
                         title={"ELO - Короткие нарды"}/>
                <EloIcon iconSrc={"/backgammon_blitz.svg"} value={rating.backgammonBlitz}
                         title={"ELO - Короткие нарды (блиц)"}/>
                <EloIcon iconSrc={"/narde.svg"} value={rating.nardeDefault}
                         title={"ELO - Длинные нарды"}/>
                <EloIcon iconSrc={"/narde_blitz.svg"} value={rating.nardeBlitz}
                         title={"ELO - Длинные нарды (блиц)"}/>
            </div>
            <AccentedButton type={"button"}>Вызвать</AccentedButton>
            <RemoveFriendButton type={"button"} onClick={() => {removeFriend(fetch, id).then(() => navigate(0)); }}>Удалить</RemoveFriendButton>
        </div>
    )
}

const FriendsEntry = styled(PlainFriendsEntry)`
    & {
        background-color: #444444;
        display: flex;
        color: white;
        align-items: center;

        > img {
            height: 60%;
            background-color: #333;
            padding: 5px;
            margin: 10px;
        }

        > :nth-child(2) {
            flex: 1;

            p:nth-child(1) {
                font-size: 20px;
                margin: 0;
            }

        }

        ${AccentedButton} {
            aspect-ratio: 1;
            width: 65px;
            margin-right: 10px;
            border-radius: 10px;
        }
    }
`

const PlainFriendList = observer(({className}: { className?: string }) => {
    const [init, setInit] = useState(false)
    const {friends} = useContext(FriendsStatusContext)!
    const [fetch] = useFetch()

    const loadData = useCallback((offset: number) => {
        const limit = 10
        getFriendsList(fetch, offset, limit)
            .then(resp => resp.json())
            .then(friendsResponse => {
                const requests = friendsResponse.map(({id}: { id: number }) => userInfo(fetch, id))
                return Promise.all(requests)
            })
            .then(responses => Promise.all(responses.map(r => r.json())))
            .then(objects => {
                runInAction(() => objects.forEach(o => friends.push(o)))
                setInit(true)
                if (objects.length >= limit) {
                    setTimeout(() => loadData(offset + 1))
                }
            })
    }, [fetch, friends])

    useEffect(() => {
        loadData(0)
    }, [loadData]);

    const friendEntries: ReactNode[] = []

    for (const {id, username, rating} of friends) {
        friendEntries.push(<FriendsEntry username={username} iconSrc={imageUri(id)} rating={rating} id={id} key={id}/>)
    }

    return (
        <>
            <div className={className}>
                {init && friendEntries}
            </div>
        </>
    )
})

const FriendList = styled(PlainFriendList)`
    & {
        display: flex;
        flex-direction: column;
        overflow-y: auto;

        ${FriendsEntry} {
            align-self: stretch;
        }
    }

    & > ${FriendsEntry} {
        height: 100px;
        margin-bottom: 20px;
    }
`

const PlainFriendRequestEntry = observer(({className, iconSrc, username, id}: {
    className?: string,
    iconSrc: string,
    username: string,
    id: number
}) => {
    const icon = useImgCache(iconSrc)
    const placeholder = useImgPlaceholder()
    const navigate = useNavigate()
    const {friendRequests: requestsList} = useContext(FriendsStatusContext)!

    const onRefuse = () => {
        removeFriend(fetch, id).then(resp => console.log(resp.status))
        const toDelete = requestsList.findIndex(o => o.id == id)
        runInAction(() => requestsList.splice(toDelete, 1))
    }

    const onAccept = () => {
        addFriendById(fetch, id).then(() => navigate(0))
        const toDelete = requestsList.findIndex(o => o.id == id)
        runInAction(() => requestsList.splice(toDelete, 1))
    }

    return (
        <div className={className}>
            <img src={icon} alt={"Аватар"} onError={(e) => e.currentTarget.src = placeholder}/>
            <div>
                <p><UsernameLink to={`/profile/${id}`}>{username}</UsernameLink></p>
            </div>
            <AccentedButton type={"button"} onClick={onAccept}>Да</AccentedButton>
            <RemoveFriendButton type={"button"} onClick={onRefuse}>Нет</RemoveFriendButton>
        </div>
    )
})

const FriendRequestEntry = styled(PlainFriendRequestEntry)`
    & {
        display: flex;
        align-items: center;
        color: white;

        p {
            margin: 0;
        }

        img {
            height: 80%;
            background-color: #333;
            padding: 5px;
            margin-left: 5px;
            margin-right: 5px;
        }

        > :nth-child(2) {
            flex: 1;

            p:nth-child(1) {
                font-size: 20px;
            }
        }

        ${AccentedButton} {
            aspect-ratio: 1;
            margin-right: 10px;
            height: 80%;
            border-radius: 5px;
        }
    }
`

const PlainFriendRequests = observer(({className}: { className?: string }) => {
    const [fetch] = useFetch()

    const {friendRequests: requestsList} = useContext(FriendsStatusContext)!

    useEffect(() => {
        getFriendRequest(fetch)
            .then(resp => resp.json())
            .then(requests => {
                console.log(requests)
                runInAction(() => {
                    for (const request of requests) {
                        requestsList.push(request)
                    }
                })
            })
    }, [fetch, requestsList]);

    const requestNodes: ReactNode[] = []
    for (const {username, id} of requestsList) {
        requestNodes.push(<FriendRequestEntry username={username} iconSrc={imageUri(id)} id={id} key={id}/>)
    }

    return (
        <div className={className}>
            <div style={{lineHeight: "2em", textAlign: "center"}}>Заявки в друзья</div>
            <div>
                {requestNodes.length > 0 ? requestNodes : <p style={{textAlign: "center"}}>Нет заявок</p>}
            </div>
        </div>
    )
})

const FriendRequests = styled(PlainFriendRequests)`
    & {
        background-color: #222;
        display: flex;
        flex-direction: column;
        align-items: stretch;

        > :nth-child(1) {
            background-color: #444;
            height: 30px;
            margin-bottom: 5px;
        }

        ${FriendRequestEntry} {
            margin-bottom: 5px;
            height: 50px;
        }
    }
`

const PlainFriendsPage = ({className}: { className?: string }) => {
    const [friendsStatus] = useState(new FriendsStatus())
    const authStatus = useAuthContext()
    const [checked, setChecked] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        if (authStatus.id === null) {
            navigate("/sign-in")
        } else {
            setChecked(true)
        }
    }, [authStatus.id, navigate]);

    return (
        <>{checked &&
            <FriendsStatusContext.Provider value={friendsStatus}>
                <div className={className}>
                    <div>
                        <SearchBar />
                        <FriendList/>
                    </div>
                    <div>
                        <FriendRequests/>
                    </div>
                </div>
            </FriendsStatusContext.Provider>
        }</>
    )
}

export const FriendsPage = styled(PlainFriendsPage)`
    & {
        flex: 1;
        align-self: stretch;
        flex-wrap: wrap;
        display: flex;
        justify-content: space-evenly;
        min-width: 0;
        overflow-y: auto;

        > :nth-child(1) {
            width: 60%;
            margin: 20px;
        }

        > :nth-child(2) {
            margin: 20px;
            width: 400px;
        }
    }
`
