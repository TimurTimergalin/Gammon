import {RuleSet} from "../RuleSet.ts";
import {BackgammonIndex, BackgammonProp} from "../../board/backgammon/types.ts";
import {BackgammonIndexMapper} from "./IndexMapper.ts";
import {BackgammonPropMapper} from "./PropMapper.ts";
import {backgammonDefaultPlacement} from "./InitPlacement.ts";
import {BackgammonRules} from "./BackgammonRules.ts";

export const backgammonRuleSet: RuleSet<BackgammonIndex, BackgammonProp> = {
    indexMapperFactory: (color) => new BackgammonIndexMapper(color),
    propMapper: new BackgammonPropMapper(),
    initPlacement: backgammonDefaultPlacement,
    rules: new BackgammonRules()
}