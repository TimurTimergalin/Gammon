import {backgammonRuleSet} from "../../../game/game_rule/backgammon/RuleSet";
import {NewLocalGamePage} from "./_deps/NewLocalGamePage";

export default function BackgammonLocalGamePage() {
    return <NewLocalGamePage ruleset={backgammonRuleSet}/>;
}