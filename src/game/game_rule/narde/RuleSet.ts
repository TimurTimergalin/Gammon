import {RuleSet} from "../RuleSet";
import {NardeIndex, NardeProp} from "../../board/narde/types";
import {NardeIndexMapper} from "./IndexMapper";
import {NardeLabelMapper} from "./LabelMapper";
import {NardePropMapper} from "./PropMapper";
import {nardeDefaultPlacement} from "./InitPlacement";
import {NardeRules} from "./Rules";
import {NardeDoubleCubePositionMapper} from "./DoubleCubePositionMapper";
import {NardeHistoryEncoder} from "./HistoryEncoder";
import {NardeDiceRule} from "./DiceRule";

export const nardeRuleSet: RuleSet<NardeIndex, NardeProp> = {
    indexMapperFactory: (color) => new NardeIndexMapper(color),
    labelMapperFactory: (color) => new NardeLabelMapper(color),
    propMapper: new NardePropMapper(),
    initPlacement: nardeDefaultPlacement,
    rules: new NardeRules(),
    doubleCubePositionMapperFactory: (color) => new NardeDoubleCubePositionMapper(color),
    historyEncoder: new NardeHistoryEncoder(),
    diceRule: new NardeDiceRule()
}