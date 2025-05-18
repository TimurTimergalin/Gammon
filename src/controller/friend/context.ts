import {createContext} from "react";
import {FriendsStatus} from "./FriendsStatus";

export const FriendsStatusContext = createContext<FriendsStatus | null>(null)