import {createContext} from "react";
import {ProfileStatus} from "./ProfileStatus";

export const ProfileStatusContext = createContext<ProfileStatus | null>(null)

