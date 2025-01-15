import {ConfigParser} from "./ConfigParser.ts";
import {RemoteMoveMapper} from "./RemoteMoveMapper.ts";

export interface RemoteSet<RemoteConfig, Index, Prop, RemoteMove> {
    configParser: ConfigParser<RemoteConfig, Index, Prop>,
    remoteMoveMapper: RemoteMoveMapper<RemoteMove, Index>
}