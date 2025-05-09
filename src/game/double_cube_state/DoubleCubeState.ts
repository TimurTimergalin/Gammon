import {DoubleCubePositionMapper} from "../game_rule/DoubleCubePositionMapper";
import {makeAutoObservable} from "mobx";

export type CubeState = "unavailable" | "free" | "belongs_to_white" | "belongs_to_black" | "offered_to_white" | "offered_to_black"

export class DoubleCubeState {
    get value(): number | undefined {
        return this._value;
    }

    get convertedValue(): number {
        return this._state === "free" || this._state === "unavailable" ? 1 : this._value!
    }

    set value(value: number | undefined) {
        this._value = value;
    }
    get positionMapper(): DoubleCubePositionMapper | undefined {
        return this._positionMapper;
    }

    set positionMapper(value: DoubleCubePositionMapper | undefined) {
        this._positionMapper = value;
    }
    get state(): CubeState {
        return this._state;
    }

    set state(value: CubeState) {
        this._state = value;
    }

    private _state: CubeState = "unavailable"
    private _positionMapper?: DoubleCubePositionMapper
    private _value?: number


    constructor({state = "unavailable", positionMapper, value}: {
        state?: CubeState,
        positionMapper?: DoubleCubePositionMapper,
        value?: number
    }) {
        this._state = state;
        this._positionMapper = positionMapper;
        this._value = value
        makeAutoObservable(this)
    }
}