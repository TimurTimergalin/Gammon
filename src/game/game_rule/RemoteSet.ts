import {ConfigParser} from "./ConfigParser";
import {RemoteMoveMapper} from "./RemoteMoveMapper";

export interface RemoteSet<RemoteConfig, Index, Prop, RemoteMove> {
    configParser: ConfigParser<RemoteConfig, Index, Prop>,
    remoteMoveMapper: RemoteMoveMapper<RemoteMove, Index>
}