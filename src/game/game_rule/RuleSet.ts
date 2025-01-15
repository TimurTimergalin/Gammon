import {Rules} from "./Rules.ts";
import {IndexMapper} from "./IndexMapper.ts";
import {PropMapper} from "./PropMapper.ts";
import {InitPlacement} from "./InitPlacement.ts";

export interface RuleSet<Index, Prop> {
    rules: Rules<Index, Prop>,
    indexMapper: IndexMapper<Index>,
    propMapper: PropMapper<Prop>,
    initPlacement: InitPlacement<Index, Prop>
}