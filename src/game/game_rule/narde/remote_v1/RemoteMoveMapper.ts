import {RemoteMoveMapper} from "../../RemoteMoveMapper";
import {NardeRemoteMove} from "./types";
import {NardeIndex} from "../../../board/narde/types";
import {Move} from "../../../board/move";

export class NardeRemoteMoveMapper implements RemoteMoveMapper<NardeRemoteMove, NardeIndex> {
    indexToRemote(index: NardeIndex): number {
        if (index === "White Store") {
            return 25
        }
        if (index === "Black Store") {
            return 0
        }
        return 25 - index
    }

    indexFromRemote(index: number): NardeIndex {
        if (index === 25) {
            return "White Store"
        }
        if (index === 0) {
            return "Black Store"
        }
        return 25 - index
    }

    toRemote = ({from, to}: Move<NardeIndex>): NardeRemoteMove => {
        return {
            from: this.indexToRemote(from),
            to: this.indexToRemote(to)
        }
    }

    fromRemote = ({from, to}: NardeRemoteMove): Move<NardeIndex> => {
        return {
            from: this.indexFromRemote(from),
            to: this.indexFromRemote(to)
        }
    }

}