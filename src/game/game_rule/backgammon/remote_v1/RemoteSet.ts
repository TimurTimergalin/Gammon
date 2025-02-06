import {RemoteSet} from "../../RemoteSet";
import {BackgammonRemoteConfig, BackgammonRemoteMove} from "./types";
import {BackgammonIndex, BackgammonProp} from "../../../board/backgammon/types";
import {BackgammonConfigParser} from "./ConfigParser";
import {BackgammonRemoteMoveMapper} from "./RemoteMoveMapper";

export const backgammonRemoteSetV1: RemoteSet<BackgammonRemoteConfig, BackgammonIndex, BackgammonProp, BackgammonRemoteMove> = {
    configParser: new BackgammonConfigParser(),
    remoteMoveMapper: new BackgammonRemoteMoveMapper()
}