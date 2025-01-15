import {RemoteSet} from "../../RemoteSet.ts";
import {BackgammonRemoteConfig, BackgammonRemoteMove} from "./types.ts";
import {BackgammonIndex, BackgammonProp} from "../../../board/backgammon/types.ts";
import {BackgammonConfigParser} from "./ConfigParser.ts";
import {BackgammonRemoteMoveMapper} from "./RemoteMoveMapper.ts";

export const backgammonRemoteSetV1: RemoteSet<BackgammonRemoteConfig, BackgammonIndex, BackgammonProp, BackgammonRemoteMove> = {
    configParser: new BackgammonConfigParser(),
    remoteMoveMapper: new BackgammonRemoteMoveMapper()
}