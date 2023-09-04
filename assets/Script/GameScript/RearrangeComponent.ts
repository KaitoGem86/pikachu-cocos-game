import { _decorator, Component, Node, SpriteFrame, random, randomRange, randomRangeInt, RichText } from 'cc';
import { GameManager } from './GameManager';
import { PieceController } from './PieceController';
import { SelectPieceSolution } from './SelectPieceSolution';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;

@ccclass('RearrangeComponent')
export class RearrangeComponent extends Component {

    @property(RichText) numberText: RichText = new RichText();

    public times: number;

    spriteList: SpriteFrame[] = [];
    nodeList: PieceController[] = [];

    public set_rearrange_number(time: number): void {
        this.numberText.string = "<color=#00ff00>Times:</color><color=#0000ff>" + time + "</color>";
    }

    public can_rearrange(): boolean {
        return GameManager.Instance.rearrange_numbers > 0;
    }

    public rearrange(): void {
        if(SelectPieceSolution.Instance.select.length > 0){
            SelectPieceSolution.Instance.select[0].piece.isChecked = false;
        }
        if (this.can_rearrange()) {
            this.spriteList.splice(0, this.spriteList.length);
            for (let i = 1; i < SelectPieceSolution.Instance.canMoveThroughMatrix.length - 1; i++) {
                for (let j = 1; j < SelectPieceSolution.Instance.canMoveThroughMatrix[1].length - 1; j++) {
                    if (!SelectPieceSolution.Instance.canMoveThroughMatrix[i][j]) {
                        this.spriteList.push(SelectPieceSolution.Instance.piecesPool[i][j].sprite.spriteFrame);
                        this.nodeList.push(SelectPieceSolution.Instance.piecesPool[i][j]);
                    }
                }
            }

            //console.log("nodeList " + this.nodeList.length);
            //console.log("spriteList " + this.spriteList.length);

            this.spriteList.forEach(element => {
                let i = randomRangeInt(0, this.nodeList.length);
                this.nodeList[i].sprite.spriteFrame = element;
                this.nodeList.splice(i, 1);
            });
            GameManager.Instance.rearrange_numbers -= 1;
            UIManager.Instance.rearrange_node.set_rearrange_number(GameManager.Instance.rearrange_numbers);
        }
    }
}


