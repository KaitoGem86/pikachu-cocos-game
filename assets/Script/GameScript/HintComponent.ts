import { _decorator, Component, Node, random, randomRangeInt, SpriteFrame, Sprite, Color, RichText } from 'cc';
import { COCOSPLAY } from 'cc/env';
import { CheckPathManager } from './CheckPathManager';
import { GameManager } from './GameManager';
import { PieceController } from './PieceController';
import { SelectPieceSolution } from './SelectPieceSolution';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('HintComponent')
export class HintComponent extends Component {

    public listNodes: PieceController[][]

    @property(RichText) hint_numbers = new RichText();

    public can_hint(): boolean {
        return GameManager.Instance.hint_numbers > 0;
    }

    public Hint(): void {
        if (SelectPieceSolution.Instance.select.length > 0) {
            SelectPieceSolution.Instance.select[0].piece.isChecked = false;
        }
        if (this.can_hint()) {
            let i, j, u, v: number;
            for (i = 1; i < SelectPieceSolution.Instance.piecesPool.length - 1; i++) {
                for (j = 1; j < SelectPieceSolution.Instance.piecesPool[1].length - 1; j++) {
                    if (SelectPieceSolution.Instance.piecesPool[i][j].node.active == false) {
                        continue;
                    }
                    else {
                        for (u = 1; u < SelectPieceSolution.Instance.piecesPool.length - 1; u++) {
                            for (v = 1; v < SelectPieceSolution.Instance.piecesPool[1].length - 1; v++) {
                                if ((u === i && v === j) || SelectPieceSolution.Instance.piecesPool[u][v].node.active == false) {
                                    continue;
                                }
                                if (SelectPieceSolution.Instance.piecesPool[i][j].sprite.spriteFrame === SelectPieceSolution.Instance.piecesPool[u][v].sprite.spriteFrame) {
                                    if (CheckPathManager.Instance.CheckPathBetween2Node(SelectPieceSolution.Instance.piecesPool[i][j], SelectPieceSolution.Instance.piecesPool[u][v], true)) {
                                        SelectPieceSolution.Instance.piecesPool[i][j].getComponent(Sprite).color = Color.CYAN;
                                        SelectPieceSolution.Instance.piecesPool[u][v].getComponent(Sprite).color = Color.CYAN;
                                        GameManager.Instance.hint_numbers -= 1;
                                        this.set_hint_numbers(GameManager.Instance.hint_numbers);
                                        return;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            console.log("cant hint any more");
        }
        //SelectPieceSolution.Instance.piecesPool[u - 1][v - 1].getComponent(Sprite).color = new Color(191, 216, 114, 255);
    }

    public CheckCantMoveMoreOver(): boolean {
        if(GameManager.Instance.count_pool === 0)
            return false;
        for (let i = 1; i < SelectPieceSolution.Instance.piecesPool.length - 1; i++) {
            for (let j = 1; j < SelectPieceSolution.Instance.piecesPool[1].length - 1; j++) {
                if (SelectPieceSolution.Instance.piecesPool[i][j].node.active == false) {
                    continue;
                }
                else {
                    for (let u = 1; u < SelectPieceSolution.Instance.piecesPool.length - 1; u++) {
                        for (let v = 1; v < SelectPieceSolution.Instance.piecesPool[1].length - 1; v++) {

                            if ((u === i && v === j) || SelectPieceSolution.Instance.piecesPool[u][v].node.active == false) {
                                continue;
                            }
                            if (SelectPieceSolution.Instance.piecesPool[i][j].sprite.spriteFrame === SelectPieceSolution.Instance.piecesPool[u][v].sprite.spriteFrame) {
                                if (CheckPathManager.Instance.CheckPathBetween2Node(SelectPieceSolution.Instance.piecesPool[i][j], SelectPieceSolution.Instance.piecesPool[u][v], true)) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        console.log("cant move any more");
        return true;
    }

    public set_hint_numbers(hint_numbers: number): void {
        this.hint_numbers.string = "<color=#00ff00>Times:</color><color=#0000ff>" + hint_numbers + "</color>"
    }
}


