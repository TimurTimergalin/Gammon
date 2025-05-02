import {nardeRuleSet} from "../../../game/game_rule/narde/RuleSet";
import {NewLocalGamePage} from "./_deps/NewLocalGamePage";

export default function NardeLocalGamePage() {
    return <NewLocalGamePage ruleset={nardeRuleSet}/>
}