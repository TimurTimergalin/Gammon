import {createContext} from "react";
import {PhotoEditStatus} from "./PhotoEditStatus";

export const PhotoEditContext = createContext(new PhotoEditStatus())