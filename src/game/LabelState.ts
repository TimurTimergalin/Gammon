import {LabelMapper} from "./game_rule/LabelMapper";
import {makeAutoObservable} from "mobx";
import {Color} from "../common/color";

export class LabelState {
    get color(): Color | undefined {
        return this._color;
    }

    set color(value: Color | undefined) {
        this._color = value;
    }
    get labelMapper(): LabelMapper | undefined{
        return this._labelMapper;
    }

    set labelMapper(value: LabelMapper | undefined) {
        this._labelMapper = value;
    }
    private _labelMapper: LabelMapper | undefined
    private _color: Color | undefined


    constructor(labelMapper?: LabelMapper, color?: Color) {
        this._labelMapper = labelMapper;
        this._color = color
        makeAutoObservable(this)
    }
}