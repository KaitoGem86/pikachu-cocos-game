import { _decorator, Component, Node, SpriteFrame, Toggle, Sprite, tween, Vec3, Tween, Collider, Color } from 'cc';
import { CheckPathManager } from './CheckPathManager';
import { GameManager } from './GameManager';
import { SelectPieceSolution } from './SelectPieceSolution';
import { UIManager } from './UIManager';
const { ccclass, property } = _decorator;


@ccclass('PieceController')
export class PieceController extends Component {

    @property({
        type: Node
    })
    private object: Node;

    @property({
        type: Sprite,
        visible: true
    })
    sprite: Sprite;

    @property({
        type: Toggle
    })
    public piece: Toggle;

    public neighbors: { x: number, y: number }[] = [];
    public pos: { x: number, y: number };

    public onEnableWithAnim(delayTime: number) {
        this.node.scale = new Vec3(0, 0, 0);
        let tweenDuration: number = 1;                            // Duration of the tween
        return tween(this.node.scale)
            .delay(delayTime)
            .to(tweenDuration, new Vec3(1, 1, 1), {                        // The interface 'to' represents the absolute value of the node
                easing: "backOut",
                onUpdate: (target: Vec3, ratio: number) => {                        // Implement ITweenOption's onUpdate callback to accept the current tweening progress
                    this.node.scale = target;                                 // Assign the position of the node to the result calculated by the tween system        
                },
            })
            .start();
    }

    onDisableWithAnim(check?: boolean) {
        let tweenDuration: number = 0.45;                            // Duration of the tween
        tween(this.node.scale)
            .to(tweenDuration, new Vec3(0, 0, 0), {                        // The interface 'to' represents the absolute value of the node
                easing: "backIn",
                onUpdate: (target: Vec3, ratio: number) => {                        // Implement ITweenOption's onUpdate callback to accept the current tweening progress
                    this.node.scale = target;                                 // Assign the position of the node to the result calculated by the tween system        
                },
                onComplete: () => {
                    this.node.active = false;
                    this.node.scale = Vec3.ONE;
                    this.getComponent(Sprite).color = new Color(191, 216, 114, 255);
                }
            }).start();
    }

    start() {
        this.object = this.node;
    }

    public setSpriteFrame(sprite: SpriteFrame): void {
        this.sprite.spriteFrame = sprite;
    }

    onClick() {
        let arr = SelectPieceSolution.Instance.select;
        if (this.piece.isChecked)
            if (arr.length > 0) {
                if (arr[0].sprite.spriteFrame === this.sprite.spriteFrame) {
                    //console.log(arr[0].node.name);
                    if (this.node != arr[0].node && CheckPathManager.Instance.CheckPathBetween2Node(this.getComponent(PieceController), arr[0].getComponent(PieceController))) {
                        GameManager.Instance.count_pool -= 2;
                        GameManager.Instance.point += 100;
                        UIManager.Instance.setText(GameManager.Instance.point);
                        //console.log(this.pos);
                        //this.object.active = false;
                        //arr[0].node.parent.active = false;
                        SelectPieceSolution.Instance.update_pool(this, arr[0]);

                        if (GameManager.Instance.count_pool <= 0) {
                            UIManager.Instance.win_game();
                        }

                        if(!GameManager.Instance.isWinGame)
                            GameManager.Instance.check_game_over();
                        else{
                            GameManager.Instance.isWinGame = false;
                        }
                    }
                    else {
                        arr[0].getComponent(Toggle).isChecked = false;
                        this.piece.isChecked = false;
                    }
                    arr.pop();
                    arr.pop();
                }
                else {
                    arr[0].getComponent(Toggle).isChecked = false;
                    arr.pop();
                    arr.push(this);
                }
            }
            else {
                arr.push(this);
            }
        else {
            arr.pop();
        }
    }



    set_neighbor(pos: { x: number, y: number }): void {
        this.pos = pos;
        if (pos.y + 1 < GameManager.Instance.MainPanel.row)
            this.neighbors.push({ x: pos.x, y: pos.y + 1 });
        if (pos.y - 1 >= 0)
            this.neighbors.push({ x: pos.x, y: pos.y - 1 });
        if (pos.x + 1 < GameManager.Instance.MainPanel.column)
            this.neighbors.push({ x: pos.x + 1, y: pos.y });
        if (pos.x - 1 >= 0)
            this.neighbors.push({ x: pos.x - 1, y: pos.y });
    }
}