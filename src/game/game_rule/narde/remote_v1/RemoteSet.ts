import {RemoteSet} from "../../RemoteSet";
import {NardeRemoteConfig, NardeRemoteMove} from "./types";
import {NardeIndex, NardeProp} from "../../../board/narde/types";
import {NardeConfigParser} from "./ConfigParser";
import {NardeRemoteMoveMapper} from "./RemoteMoveMapper";

export const nardeRemoteSetV1: RemoteSet<NardeRemoteConfig, NardeIndex, NardeProp, NardeRemoteMove> = {
    configParser: new NardeConfigParser(),
    remoteMoveMapper: new NardeRemoteMoveMapper()
}