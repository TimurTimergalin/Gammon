import {ImgCacheProvider} from "../controller/img_cache/provider";
import {Outlet} from "react-router";

export default function Provider() {
    return <ImgCacheProvider><Outlet/></ImgCacheProvider>
}