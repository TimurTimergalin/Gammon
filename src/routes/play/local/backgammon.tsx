import {backgammonRuleSet} from "../../../game/game_rule/backgammon/RuleSet";
import {LocalGamePage} from "./_deps/LocalGamePage";

export default function BackgammonLocalGamePage() {
    return <LocalGamePage ruleset={backgammonRuleSet}/>;
}