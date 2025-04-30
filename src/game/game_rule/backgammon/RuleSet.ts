import {RuleSet} from "../RuleSet";
import {BackgammonIndex, BackgammonProp} from "../../board/backgammon/types";
import {BackgammonIndexMapper} from "./IndexMapper";
import {BackgammonPropMapper} from "./PropMapper";
import {backgammonDefaultPlacement} from "./InitPlacement";
import {BackgammonRules} from "./Rules";
import {BackgammonLabelMapper} from "./LabelMapper";
import {BackgammonDoubleCubePositionMapper} from "./DoubleCubePositionMapper";
import {BackgammonHistoryEncoder} from "./HistoryEncoder";
import {BackgammonDiceRule} from "./DiceRule";
import {BackgammonTimeControlTable} from "./TimeControlTable";

export const backgammonRuleSet: RuleSet<BackgammonIndex, BackgammonProp> = {
    indexMapperFactory: (color) => new BackgammonIndexMapper(color),
    labelMapperFactory: (color) => new BackgammonLabelMapper(color),
    propMapper: new BackgammonPropMapper(),
    initPlacement: backgammonDefaultPlacement,
    rules: new BackgammonRules(),
    doubleCubePositionMapperFactory: (color) => new BackgammonDoubleCubePositionMapper(color),
    historyEncoder: new BackgammonHistoryEncoder(),
    diceRule: new BackgammonDiceRule(),
    timeControlTable: new BackgammonTimeControlTable()
}